import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { glucoseReadings } from "../db/schema";
import type { Source, SourceContext } from "./types";

// Header set ported verbatim from luff's working LibreLinkUp client. Deviations
// from this — newer version strings, custom User-Agent, preemptive Account-Id —
// have been observed to trigger silent credential rejection by the API's
// bot-protection layer.
const LLU_HEADERS: Record<string, string> = {
  product: "llu.android",
  version: "4.16.0",
  "content-type": "application/json",
  "cache-control": "no-cache",
  connection: "Keep-Alive",
};

const DEFAULT_REGION = "EU";

const REGION_OPTIONS = [
  "EU",
  "EU2",
  "US",
  "AU",
  "AE",
  "AP",
  "CA",
  "DE",
  "FR",
  "IN",
  "JP",
  "LA",
  "RU",
] as const;

function apiBase(region: string): string {
  return `https://api-${region.toLowerCase()}.libreview.io`;
}

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  region: z.string().default(DEFAULT_REGION),
  apiBase: z.string().optional(),
  authToken: z.string().optional(),
  authExpires: z.number().optional(),
  accountHash: z.string().optional(),
  patientId: z.string().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

type LoginResponse = {
  status?: number;
  error?: { message?: string };
  data?: {
    redirect?: boolean;
    region?: string;
    authTicket?: { token?: string; expires?: number; duration?: number };
    user?: { id?: string };
  };
};

function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

async function postLogin(url: string, email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${url}/llu/auth/login`, {
    method: "POST",
    headers: LLU_HEADERS,
    body: JSON.stringify({ email, password }),
  });
  return (await res.json()) as LoginResponse;
}

async function login(initial: Payload): Promise<Payload> {
  const { email, password } = initial;
  let url = initial.apiBase ?? apiBase(initial.region);

  let body = await postLogin(url, email, password);

  // Region redirect — API returns lowercase 2-letter region; build the host directly.
  if (body.data?.redirect && body.data.region) {
    const region = body.data.region;
    if (!/^[a-z]{2,3}$/i.test(region)) {
      throw new Error(`LibreLinkUp: invalid region code from API: ${region}`);
    }
    url = `https://api-${region.toLowerCase()}.libreview.io`;
    body = await postLogin(url, email, password);
  }

  switch (body.status) {
    case 0:
      break;
    case 2:
      throw new Error("LibreLinkUp login failed: bad credentials");
    case 4:
      throw new Error(
        "LibreLinkUp login failed: open the LibreLinkUp app and accept the Terms of Use first",
      );
    default:
      throw new Error(
        `LibreLinkUp login failed: ${body.error?.message ?? `unknown error (status: ${body.status})`}`,
      );
  }

  const token = body.data?.authTicket?.token;
  const expires = body.data?.authTicket?.expires;
  const userId = body.data?.user?.id;
  if (!token || !expires) throw new Error("LibreLinkUp login: no token in response");
  if (!userId) throw new Error("LibreLinkUp login: no user ID in response");

  return {
    ...initial,
    apiBase: url,
    authToken: token,
    authExpires: expires * 1000,
    accountHash: sha256Hex(userId),
  };
}

async function ensureAuthenticated(payload: Payload): Promise<Payload> {
  const margin = 60 * 60 * 1000;
  if (
    payload.authToken &&
    payload.authExpires &&
    payload.accountHash &&
    payload.apiBase &&
    payload.authExpires - margin > Date.now()
  ) {
    return payload;
  }
  return login(payload);
}

async function apiGet<T>(path: string, payload: Payload): Promise<T> {
  if (!payload.authToken || !payload.accountHash || !payload.apiBase) {
    throw new Error("LibreLinkUp: cannot call API before login");
  }
  const res = await fetch(`${payload.apiBase}${path}`, {
    headers: {
      ...LLU_HEADERS,
      Authorization: `Bearer ${payload.authToken}`,
      "Account-Id": payload.accountHash,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`LibreLinkUp ${path} HTTP ${res.status}: ${text.slice(0, 160)}`);
  return JSON.parse(text) as T;
}

async function fetchPatientId(payload: Payload): Promise<string> {
  const json = await apiGet<{ data?: ReadonlyArray<{ patientId?: string }> }>(
    "/llu/connections",
    payload,
  );
  const id = json.data?.[0]?.patientId;
  if (!id) {
    throw new Error(
      "LibreLinkUp: no connected patients found. Set up sharing in the LibreLinkUp app first.",
    );
  }
  return id;
}

type LibreReading = {
  FactoryTimestamp?: string;
  Timestamp?: string;
  Value?: number;
  ValueInMgPerDl?: number;
  GlucoseUnits?: number;
  TrendArrow?: number;
};

const MGDL_PER_MMOL = 18.018;

function readingToMmol(r: LibreReading): number | null {
  if (typeof r.ValueInMgPerDl === "number")
    return Number((r.ValueInMgPerDl / MGDL_PER_MMOL).toFixed(1));
  if (typeof r.Value !== "number") return null;
  if (r.GlucoseUnits === 1) return Number((r.Value / MGDL_PER_MMOL).toFixed(1));
  return Number(r.Value.toFixed(1));
}

const TREND_MAP: Record<
  number,
  "rising_quick" | "rising" | "stable" | "falling" | "falling_quick"
> = {
  1: "falling_quick",
  2: "falling",
  3: "stable",
  4: "rising",
  5: "rising_quick",
};

function parseLibreTimestamp(raw?: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

async function fetchReadings(
  payload: Payload,
): Promise<{ current: LibreReading | null; history: ReadonlyArray<LibreReading> }> {
  const patientId = payload.patientId ?? (await fetchPatientId(payload));
  const json = await apiGet<{
    data?: {
      connection?: { glucoseMeasurement?: LibreReading };
      graphData?: ReadonlyArray<LibreReading>;
    };
  }>(`/llu/connections/${patientId}/graph`, payload);
  return {
    current: json.data?.connection?.glucoseMeasurement ?? null,
    history: json.data?.graphData ?? [],
  };
}

async function syncLibre(
  input: { payload: Payload },
  ctx: SourceContext,
): Promise<{ payload: Payload }> {
  let payload = await ensureAuthenticated(input.payload);
  if (!payload.patientId) {
    const id = await fetchPatientId(payload);
    payload = { ...payload, patientId: id };
  }
  const { current, history } = await fetchReadings(payload);
  const merged: LibreReading[] = [];
  if (current) merged.push(current);
  merged.push(...history);

  const rows = merged
    .map((r) => {
      const ts = parseLibreTimestamp(r.Timestamp ?? r.FactoryTimestamp ?? undefined);
      const mmol = readingToMmol(r);
      if (!ts || mmol == null) return null;
      const trendKey = r.TrendArrow ? (TREND_MAP[r.TrendArrow] ?? null) : null;
      return {
        userId: ctx.userId,
        source: "libre" as const,
        sourceReadingId: `${ts.getTime()}`,
        timestamp: ts,
        valueMmol: mmol,
        trend: trendKey,
        raw: r,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r != null);

  if (rows.length === 0) return { payload };

  for (const row of rows) {
    const existing = ctx.db
      .select()
      .from(glucoseReadings)
      .where(eq(glucoseReadings.sourceReadingId, row.sourceReadingId))
      .limit(1)
      .all();
    if (existing[0]) continue;
    ctx.db.insert(glucoseReadings).values(row).run();
  }

  return { payload };
}

export const libreSource: Source<Payload> = {
  meta: {
    id: "libre",
    name: "LibreLinkUp",
    description:
      "FreeStyle Libre 3 via the LibreLinkUp follower API. Polls every 1 minute. " +
      "Requires a LibreLinkUp follower account (separate from your LibreLink patient account) — " +
      "in the LibreLink app, invite a follower with any email of yours, then create the " +
      "follower account from that invitation and use those credentials here.",
    authType: "credentials",
    fields: [
      {
        key: "email",
        label: "LibreLinkUp follower email",
        type: "email",
        required: true,
        hint: "Not your LibreLink patient email — the email tied to a follower account.",
      },
      { key: "password", label: "Password", type: "password", required: true },
      {
        key: "region",
        label: "Region",
        type: "select",
        required: true,
        options: REGION_OPTIONS.map((r) => ({ value: r, label: r })),
        hint: "Use the region your Libre app is registered in. The API auto-redirects if wrong.",
      },
    ],
  },
  payloadSchema,
  authenticate: async (raw) => {
    const parsed = payloadSchema.parse(raw);
    const authed = await login(parsed);
    const id = await fetchPatientId(authed);
    return { payload: { ...authed, patientId: id } };
  },
  sync: syncLibre,
  syncTasks: [
    { id: "libre-glucose", intervalCron: "*/1 * * * *", description: "Pull recent glucose" },
  ],
};
