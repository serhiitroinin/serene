import { createHmac, randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { garminActivities, garminScheduledWorkouts, garminTrackPoints } from "../db/schema";
import type { Source, SourceContext } from "./types";

// Garmin Connect SSO + OAuth1/OAuth2 flow ported verbatim from
// luff/packages/garmin/src/auth.ts (per ADR-0003). The bot-protection layer
// rejects fingerprints it doesn't recognize, so deviations from the proven
// header set / endpoint shape break logins for real accounts.

const GARMIN_DOMAIN = "garmin.com";
const SSO_ORIGIN = `https://sso.${GARMIN_DOMAIN}`;
const CONNECT_API = `https://connectapi.${GARMIN_DOMAIN}`;
const GC_MODERN = `https://connect.${GARMIN_DOMAIN}/modern`;
const CONSUMER_URL = "https://thegarth.s3.amazonaws.com/oauth_consumer.json";

const UA = "com.garmin.android.apps.connectmobile";

type Consumer = { consumer_key: string; consumer_secret: string };

let consumerCache: Consumer | null = null;
async function getConsumer(): Promise<Consumer> {
  if (consumerCache) return consumerCache;
  const res = await fetch(CONSUMER_URL);
  if (!res.ok) throw new Error(`Garmin consumer fetch failed: HTTP ${res.status}`);
  consumerCache = (await res.json()) as Consumer;
  return consumerCache;
}

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function oauth1Sign(
  method: string,
  url: string,
  consumer: Consumer,
  token: string | null,
  tokenSecret: string,
  extraParams?: Record<string, string>,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumer.consumer_key,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  };
  if (token) oauthParams.oauth_token = token;

  const allParams: Record<string, string> = { ...oauthParams, ...extraParams };
  const paramString = Object.keys(allParams)
    .toSorted()
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k]!)}`)
    .join("&");

  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
  const signingKey = `${percentEncode(consumer.consumer_secret)}&${percentEncode(tokenSecret)}`;
  oauthParams.oauth_signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  return (
    "OAuth " +
    Object.keys(oauthParams)
      .toSorted()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k]!)}"`)
      .join(", ")
  );
}

function extractCookies(res: Response): string {
  const setCookies = res.headers.getSetCookie?.() ?? [];
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}

function mergeCookies(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return `${a}; ${b}`;
}

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  oauth1Token: z.string().optional(),
  oauth1Secret: z.string().optional(),
  oauth2Token: z.string().optional(),
  oauth2ExpiresAt: z.number().optional(),
  refreshTokenExpiresAt: z.number().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

async function ssoLogin(
  email: string,
  password: string,
): Promise<{ oauth1Token: string; oauth1Secret: string }> {
  const consumer = await getConsumer();

  // Step 1: prime SSO cookies
  const embedUrl = `${SSO_ORIGIN}/sso/embed?clientId=GarminConnect&locale=en&service=${encodeURIComponent(GC_MODERN)}`;
  const embedRes = await fetch(embedUrl, {
    headers: { "User-Agent": UA },
    redirect: "manual",
  });
  const cookies1 = extractCookies(embedRes);

  // Step 2: harvest CSRF token from sign-in widget
  const signinParams = new URLSearchParams({
    id: "gauth-widget",
    embedWidget: "true",
    clientId: "GarminConnect",
    locale: "en",
    service: GC_MODERN,
  });
  const csrfRes = await fetch(`${SSO_ORIGIN}/sso/signin?${signinParams.toString()}`, {
    headers: { "User-Agent": UA, Cookie: cookies1 },
  });
  const csrfHtml = await csrfRes.text();
  const csrfMatch = csrfHtml.match(/name="_csrf"\s+value="(.+?)"/);
  if (!csrfMatch) {
    throw new Error("Garmin SSO: could not extract _csrf token (page format changed)");
  }
  const csrf = csrfMatch[1]!;
  const cookies2 = mergeCookies(cookies1, extractCookies(csrfRes));

  // Step 3: submit credentials
  const loginBody = new URLSearchParams({
    username: email,
    password,
    embed: "true",
    _csrf: csrf,
  });
  const loginRes = await fetch(`${SSO_ORIGIN}/sso/signin?${signinParams.toString()}`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies2,
    },
    body: loginBody.toString(),
    redirect: "manual",
  });
  const loginHtml = await loginRes.text();

  if (loginHtml.includes("locked")) {
    throw new Error(
      "Garmin: account is locked. Sign in via the Garmin Connect website to unlock it, then retry.",
    );
  }

  const ticketMatch = loginHtml.match(/ticket=([^"&\s]+)/);
  if (!ticketMatch) {
    if (/MFA|mfa|multi-factor/.test(loginHtml)) {
      throw new Error(
        "Garmin: MFA is enabled on this account. MFA is not yet supported in serene v0.1 — disable MFA on Garmin Connect or wait for v0.2 MFA support.",
      );
    }
    throw new Error(
      "Garmin: login failed — could not find auth ticket. Check email/password are correct.",
    );
  }
  const ticket = ticketMatch[1]!;

  // Step 4: exchange ticket for OAuth1 token
  const preauthUrl = `${CONNECT_API}/oauth-service/oauth/preauthorized`;
  const preauthHeader = oauth1Sign("GET", preauthUrl, consumer, null, "", { ticket });
  const preauthRes = await fetch(`${preauthUrl}?ticket=${encodeURIComponent(ticket)}`, {
    headers: { "User-Agent": UA, Authorization: preauthHeader },
  });
  if (!preauthRes.ok) {
    throw new Error(`Garmin OAuth1 preauthorize HTTP ${preauthRes.status}`);
  }
  const preauthParams = new URLSearchParams(await preauthRes.text());
  const oauthToken = preauthParams.get("oauth_token");
  const oauthSecret = preauthParams.get("oauth_token_secret");
  if (!oauthToken || !oauthSecret) {
    throw new Error("Garmin OAuth1: response missing oauth_token / oauth_token_secret");
  }
  return { oauth1Token: oauthToken, oauth1Secret: oauthSecret };
}

type OAuth2Tokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
};

async function exchangeOAuth2(
  oauth1Token: string,
  oauth1Secret: string,
): Promise<{ token: string; expiresAt: number; refreshExpiresAt: number }> {
  const consumer = await getConsumer();
  const url = `${CONNECT_API}/oauth-service/oauth/exchange/user/2.0`;
  const header = oauth1Sign("POST", url, consumer, oauth1Token, oauth1Secret);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      Authorization: header,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!res.ok) {
    throw new Error(`Garmin OAuth2 exchange HTTP ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as OAuth2Tokens;
  const now = Date.now();
  return {
    token: data.access_token,
    // 60s safety margin
    expiresAt: now + (data.expires_in - 60) * 1000,
    refreshExpiresAt: now + (data.refresh_token_expires_in - 60) * 1000,
  };
}

async function ensureGarminToken(payload: Payload): Promise<Payload> {
  const margin = 5 * 60 * 1000;
  if (
    payload.oauth2Token &&
    payload.oauth2ExpiresAt &&
    payload.oauth2ExpiresAt - margin > Date.now()
  ) {
    return payload;
  }

  // Refresh path: re-mint OAuth2 from saved OAuth1 tokens (the garth pattern;
  // no separate refresh-token grant exists for the Garmin OAuth2 endpoint).
  if (
    payload.oauth1Token &&
    payload.oauth1Secret &&
    (!payload.refreshTokenExpiresAt || payload.refreshTokenExpiresAt > Date.now())
  ) {
    const fresh = await exchangeOAuth2(payload.oauth1Token, payload.oauth1Secret);
    return {
      ...payload,
      oauth2Token: fresh.token,
      oauth2ExpiresAt: fresh.expiresAt,
      refreshTokenExpiresAt: fresh.refreshExpiresAt,
    };
  }

  // Full re-login path
  const oauth1 = await ssoLogin(payload.email, payload.password);
  const oauth2 = await exchangeOAuth2(oauth1.oauth1Token, oauth1.oauth1Secret);
  return {
    ...payload,
    oauth1Token: oauth1.oauth1Token,
    oauth1Secret: oauth1.oauth1Secret,
    oauth2Token: oauth2.token,
    oauth2ExpiresAt: oauth2.expiresAt,
    refreshTokenExpiresAt: oauth2.refreshExpiresAt,
  };
}

async function garminGet<T>(path: string, payload: Payload): Promise<T> {
  if (!payload.oauth2Token) throw new Error("Garmin: not authenticated");
  const res = await fetch(`${CONNECT_API}${path}`, {
    headers: {
      "User-Agent": UA,
      Authorization: `Bearer ${payload.oauth2Token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Garmin ${path} HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
  return (await res.json()) as T;
}

type GarminActivity = {
  activityId: number;
  startTimeLocal: string;
  duration: number;
  distance?: number;
  averageHR?: number;
  maxHR?: number;
  elevationGain?: number;
  hasPolyline?: boolean;
  activityType?: { typeKey?: string };
};

async function fetchActivityList(payload: Payload): Promise<ReadonlyArray<GarminActivity>> {
  return garminGet<ReadonlyArray<GarminActivity>>(
    "/activitylist-service/activities/search/activities?limit=50&start=0",
    payload,
  );
}

type MetricDescriptor = { key: string; metricsIndex: number };

type GarminDetail = {
  geoPolylineDTO?: { polyline?: ReadonlyArray<{ lat: number; lon: number; altitude?: number }> };
  metricDescriptors?: ReadonlyArray<MetricDescriptor>;
  activityDetailMetrics?: ReadonlyArray<{ metrics: ReadonlyArray<number | null> }>;
};

// Garmin's detail endpoint returns parallel arrays: `metricDescriptors` says
// which key lives at which `metrics` index; `activityDetailMetrics` is the
// per-sample tuple. Project that into per-sample objects.
type ParsedSample = {
  timestamp: Date | null;
  lat: number | null;
  lng: number | null;
  elevation: number | null;
  hr: number | null;
  speed: number | null;
};

function parseDetailSamples(detail: GarminDetail, fallbackStart: Date): ParsedSample[] {
  const descriptors = detail.metricDescriptors ?? [];
  const metrics = detail.activityDetailMetrics ?? [];
  if (descriptors.length === 0 || metrics.length === 0) return [];

  const idx: Record<string, number | undefined> = {};
  for (const d of descriptors) idx[d.key] = d.metricsIndex;

  const samples: ParsedSample[] = [];
  for (const row of metrics) {
    const m = row.metrics;
    const tIdx = idx.directTimestamp;
    const tRaw = tIdx == null ? null : m[tIdx];
    samples.push({
      timestamp: typeof tRaw === "number" ? new Date(tRaw) : null,
      lat: idx.directLatitude != null ? (m[idx.directLatitude] ?? null) : null,
      lng: idx.directLongitude != null ? (m[idx.directLongitude] ?? null) : null,
      elevation: idx.directAltitude != null ? (m[idx.directAltitude] ?? null) : null,
      hr: idx.directHeartRate != null ? (m[idx.directHeartRate] ?? null) : null,
      speed: idx.directSpeed != null ? (m[idx.directSpeed] ?? null) : null,
    });
  }

  // If timestamps are missing, distribute evenly from the activity start.
  const hasTimestamps = samples.some((s) => s.timestamp != null);
  if (!hasTimestamps && samples.length > 1) {
    for (let i = 0; i < samples.length; i++) {
      samples[i]!.timestamp = new Date(fallbackStart.getTime() + i * 1000);
    }
  }

  return samples;
}

// ── Scheduled workouts (GraphQL) ─────────────────────────────────

type ScheduledWorkoutSummary = {
  workoutUuid?: string;
  workoutName?: string;
  workoutType?: string;
  sport?: string;
  scheduleDate?: string;
  duration?: number;
  description?: string;
  completed?: boolean;
  planName?: string;
  tpPlanName?: string;
};

async function fetchScheduledWorkouts(
  payload: Payload,
  startDate: string,
  endDate: string,
): Promise<ReadonlyArray<ScheduledWorkoutSummary>> {
  if (!payload.oauth2Token) throw new Error("Garmin: not authenticated");
  const query = `query { workoutScheduleSummariesScalar(startDate:"${startDate}", endDate:"${endDate}") }`;
  const res = await fetch(`${CONNECT_API}/graphql-gateway/graphql`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      Authorization: `Bearer ${payload.oauth2Token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Garmin GraphQL HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
  const json = (await res.json()) as {
    data?: { workoutScheduleSummariesScalar?: ReadonlyArray<ScheduledWorkoutSummary> };
    errors?: ReadonlyArray<{ message?: string }>;
  };
  if (json.errors?.length) {
    throw new Error(`Garmin GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data?.workoutScheduleSummariesScalar ?? [];
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function syncScheduledWorkouts(
  input: { payload: Payload },
  ctx: SourceContext,
): Promise<{ payload: Payload }> {
  const payload = await ensureGarminToken(input.payload);
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 1);
  const end = new Date(today);
  end.setDate(end.getDate() + 14);

  const summaries = await fetchScheduledWorkouts(payload, isoDate(start), isoDate(end));

  for (const s of summaries) {
    if (!s.workoutUuid || !s.scheduleDate) continue;
    ctx.db
      .insert(garminScheduledWorkouts)
      .values({
        userId: ctx.userId,
        sourceWorkoutUuid: s.workoutUuid,
        scheduledDate: s.scheduleDate,
        name: s.workoutName ?? null,
        sport: s.sport ?? s.workoutType ?? null,
        durationSeconds: s.duration ?? null,
        description: s.description ?? null,
        planName: s.tpPlanName ?? s.planName ?? null,
        completed: Boolean(s.completed),
        raw: s,
      })
      .onConflictDoUpdate({
        target: [garminScheduledWorkouts.userId, garminScheduledWorkouts.sourceWorkoutUuid],
        set: {
          scheduledDate: s.scheduleDate,
          name: s.workoutName ?? null,
          sport: s.sport ?? s.workoutType ?? null,
          durationSeconds: s.duration ?? null,
          description: s.description ?? null,
          planName: s.tpPlanName ?? s.planName ?? null,
          completed: Boolean(s.completed),
          raw: s,
          updatedAt: new Date(),
        },
      })
      .run();
  }

  // Prune any stored future-date entries that no longer appear in the API
  // window — they were cancelled/rescheduled. Past entries kept as history.
  const todayStr = isoDate(today);
  const keepIds = new Set(summaries.map((s) => s.workoutUuid).filter(Boolean) as string[]);
  const stored = ctx.db
    .select()
    .from(garminScheduledWorkouts)
    .where(eq(garminScheduledWorkouts.userId, ctx.userId))
    .all();
  for (const row of stored) {
    if (row.scheduledDate >= todayStr && !keepIds.has(row.sourceWorkoutUuid)) {
      ctx.db
        .delete(garminScheduledWorkouts)
        .where(
          and(
            eq(garminScheduledWorkouts.userId, ctx.userId),
            eq(garminScheduledWorkouts.sourceWorkoutUuid, row.sourceWorkoutUuid),
          ),
        )
        .run();
    }
  }

  return { payload };
}

async function fetchActivityDetail(
  activityId: number | string,
  payload: Payload,
): Promise<GarminDetail | null> {
  try {
    return await garminGet<GarminDetail>(
      `/activity-service/activity/${activityId}/details?maxChartSize=2000&maxPolylineSize=4000`,
      payload,
    );
  } catch {
    return null;
  }
}

async function syncGarmin(
  input: { payload: Payload },
  ctx: SourceContext,
): Promise<{ payload: Payload }> {
  let payload = await ensureGarminToken(input.payload);
  const activities = await fetchActivityList(payload);

  // Pull scheduled workouts on the same tick — single round-trip is cheap.
  const result = await syncScheduledWorkouts({ payload }, ctx);
  payload = result.payload;

  // Bound to last 30 days to match v0.1 scope.
  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = activities.filter((a) => new Date(a.startTimeLocal).getTime() >= cutoffMs);

  for (const a of recent) {
    const start = new Date(a.startTimeLocal);
    const rawTrainingLoad = (a as unknown as Record<string, unknown>).trainingLoad;
    const trainingLoad = typeof rawTrainingLoad === "number" ? rawTrainingLoad : null;
    ctx.db
      .insert(garminActivities)
      .values({
        userId: ctx.userId,
        activityId: String(a.activityId),
        start,
        durationSeconds: Math.round(a.duration),
        sport: a.activityType?.typeKey ?? null,
        distanceMeters: a.distance ?? null,
        elevationGainMeters: a.elevationGain ?? null,
        avgHr: a.averageHR ? Math.round(a.averageHR) : null,
        maxHr: a.maxHR ? Math.round(a.maxHR) : null,
        trainingLoad,
        hasGps: Boolean(a.hasPolyline),
        raw: a,
      })
      .onConflictDoNothing()
      .run();
  }

  // Backfill track-points + per-sample HR/speed for outdoor activities in the
  // 30d window that don't yet have any track points stored. One detail call
  // per activity; idempotent.
  for (const a of recent) {
    if (!a.hasPolyline) continue;
    const existing = ctx.db
      .select()
      .from(garminTrackPoints)
      .where(eq(garminTrackPoints.activityId, String(a.activityId)))
      .limit(1)
      .all();
    if (existing[0]) continue;

    const detail = await fetchActivityDetail(a.activityId, payload);
    if (!detail) continue;
    const start = new Date(a.startTimeLocal);
    const samples = parseDetailSamples(detail, start);

    if (samples.length > 0) {
      // Prefer parsed samples (give us HR + speed). Fall back to geoPolylineDTO
      // when no detail samples exist.
      for (const s of samples) {
        if (s.lat == null || s.lng == null || s.timestamp == null) continue;
        ctx.db
          .insert(garminTrackPoints)
          .values({
            activityId: String(a.activityId),
            timestamp: s.timestamp,
            lat: s.lat,
            lng: s.lng,
            elevationM: s.elevation,
            hrBpm: s.hr != null ? Math.round(s.hr) : null,
            speedMps: s.speed,
          })
          .run();
      }
    } else if (detail.geoPolylineDTO?.polyline) {
      const points = detail.geoPolylineDTO.polyline;
      const stepMs = points.length > 1 ? Math.round((a.duration * 1000) / points.length) : 1000;
      for (let i = 0; i < points.length; i++) {
        const p = points[i]!;
        ctx.db
          .insert(garminTrackPoints)
          .values({
            activityId: String(a.activityId),
            timestamp: new Date(start.getTime() + i * stepMs),
            lat: p.lat,
            lng: p.lon,
            elevationM: p.altitude ?? null,
            hrBpm: null,
            speedMps: null,
          })
          .run();
      }
    }
  }

  return { payload };
}

export const garminSource: Source<Payload> = {
  meta: {
    id: "garmin",
    name: "Garmin Connect",
    description:
      "Activities, training load, GPS routes, and (in v0.1) the planned-workout list — via the reverse-engineered SSO web-widget flow. Polls every 30 minutes.",
    authType: "credentials",
    fields: [
      { key: "email", label: "Garmin Connect email", type: "email", required: true },
      { key: "password", label: "Password", type: "password", required: true },
    ],
  },
  payloadSchema,
  authenticate: async (raw) => {
    const parsed = payloadSchema.parse(raw);
    const oauth1 = await ssoLogin(parsed.email, parsed.password);
    const oauth2 = await exchangeOAuth2(oauth1.oauth1Token, oauth1.oauth1Secret);
    return {
      payload: {
        ...parsed,
        oauth1Token: oauth1.oauth1Token,
        oauth1Secret: oauth1.oauth1Secret,
        oauth2Token: oauth2.token,
        oauth2ExpiresAt: oauth2.expiresAt,
        refreshTokenExpiresAt: oauth2.refreshExpiresAt,
      },
    };
  },
  sync: syncGarmin,
  syncTasks: [
    {
      id: "garmin-activities",
      intervalCron: "*/30 * * * *",
      description: "Pull recent activities and GPS for the latest run",
    },
  ],
};
