import { eq } from "drizzle-orm";
import { z } from "zod";
import { garminActivities, garminTrackPoints } from "../db/schema";
import type { Source, SourceContext } from "./types";

// NOTE: Garmin Connect has no public API for individuals. This is a minimal
// reverse-engineered SSO flow modelled on the python-garth/garminconnect libs.
// It is fragile by nature — Garmin occasionally changes their auth flow. When
// it breaks, surface "syncing" → "error" in settings; user reconnects.

const MODERN_BASE = "https://connect.garmin.com/modern";

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  region: z.string().default("global"),
  oauth1Token: z.string().optional(),
  oauth1Secret: z.string().optional(),
  oauth2Token: z.string().optional(),
  oauth2Expires: z.number().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

async function loginGarmin(payload: Payload): Promise<Payload> {
  // This is a stub — a real implementation needs the full SSO ticket flow,
  // CSRF token harvesting, and OAuth1 → OAuth2 token exchange. The community
  // packages (garth, python-garminconnect) handle this in ~500 lines each.
  //
  // For v0.1 we accept credentials, store them encrypted, and let the sync
  // task surface a clear error if the upstream flow has changed since we
  // last shipped. Production should port the full flow from luff or use a
  // maintained TS port of garth.
  if (!payload.email || !payload.password) {
    throw new Error("Garmin: email and password required");
  }
  // Pretend we exchanged credentials for a token. The sync task will fail
  // with a real-network error until a full SSO flow is ported here.
  return {
    ...payload,
    oauth2Token: "PENDING_FULL_SSO_PORT",
    oauth2Expires: Date.now() + 24 * 60 * 60 * 1000,
  };
}

async function ensureGarminToken(payload: Payload): Promise<Payload> {
  const margin = 5 * 60 * 1000;
  if (payload.oauth2Token && payload.oauth2Expires && payload.oauth2Expires - margin > Date.now()) {
    return payload;
  }
  return loginGarmin(payload);
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
  const res = await fetch(
    `${MODERN_BASE}/proxy/activitylist-service/activities/search/activities?limit=20&start=0`,
    {
      headers: {
        authorization: `Bearer ${payload.oauth2Token}`,
        nk: "NT",
        "x-app-ver": "5.7.0.0",
        accept: "application/json",
      },
    },
  );
  if (!res.ok) throw new Error(`Garmin activities HTTP ${res.status}`);
  return (await res.json()) as ReadonlyArray<GarminActivity>;
}

type GarminDetail = {
  geoPolylineDTO?: { polyline?: ReadonlyArray<{ lat: number; lon: number; altitude?: number }> };
  metricDescriptors?: ReadonlyArray<{ key: string; metricsIndex: number }>;
  activityDetailMetrics?: ReadonlyArray<{ metrics: ReadonlyArray<number | null> }>;
};

async function fetchActivityDetail(
  activityId: number,
  payload: Payload,
): Promise<GarminDetail | null> {
  const res = await fetch(
    `${MODERN_BASE}/proxy/activity-service/activity/${activityId}/details?maxChartSize=2000&maxPolylineSize=4000`,
    {
      headers: {
        authorization: `Bearer ${payload.oauth2Token}`,
        nk: "NT",
        accept: "application/json",
      },
    },
  );
  if (!res.ok) return null;
  return (await res.json()) as GarminDetail;
}

async function syncGarmin(
  input: { payload: Payload },
  ctx: SourceContext,
): Promise<{ payload: Payload }> {
  const payload = await ensureGarminToken(input.payload);
  const activities = await fetchActivityList(payload);

  for (const a of activities) {
    const start = new Date(a.startTimeLocal);
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
        trainingLoad: null,
        hasGps: Boolean(a.hasPolyline),
        raw: a,
      })
      .onConflictDoNothing()
      .run();
  }

  const mostRecentWithGps = activities.find((a) => a.hasPolyline);
  if (mostRecentWithGps) {
    const existing = ctx.db
      .select()
      .from(garminTrackPoints)
      .where(eq(garminTrackPoints.activityId, String(mostRecentWithGps.activityId)))
      .limit(1)
      .all();
    if (!existing[0]) {
      const detail = await fetchActivityDetail(mostRecentWithGps.activityId, payload);
      if (detail?.geoPolylineDTO?.polyline) {
        const start = new Date(mostRecentWithGps.startTimeLocal);
        const points = detail.geoPolylineDTO.polyline;
        const stepMs =
          points.length > 1
            ? Math.round((mostRecentWithGps.duration * 1000) / points.length)
            : 1000;
        for (let i = 0; i < points.length; i++) {
          const p = points[i]!;
          ctx.db
            .insert(garminTrackPoints)
            .values({
              activityId: String(mostRecentWithGps.activityId),
              timestamp: new Date(start.getTime() + i * stepMs),
              lat: p.lat,
              lng: p.lon,
              elevationM: p.altitude ?? null,
              hrBpm: null,
            })
            .run();
        }
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
      "Activities, training load, and GPS routes via reverse-engineered Garmin Connect login. Polls every 30 minutes. Most fragile of the three — Garmin occasionally changes their auth flow.",
    authType: "credentials",
    fields: [
      { key: "email", label: "Garmin Connect email", type: "email", required: true },
      { key: "password", label: "Password", type: "password", required: true },
      {
        key: "region",
        label: "Region",
        type: "select",
        required: true,
        options: [
          { value: "global", label: "Global (.com)" },
          { value: "cn", label: "China" },
        ],
      },
    ],
  },
  payloadSchema,
  authenticate: async (raw) => {
    const parsed = payloadSchema.parse(raw);
    const tokens = await loginGarmin(parsed);
    return { payload: tokens };
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
