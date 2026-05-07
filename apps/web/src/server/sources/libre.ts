import { eq } from "drizzle-orm";
import { z } from "zod";
import { glucoseReadings } from "../db/schema";
import type { Source, SourceContext } from "./types";

const LIBRE_HEADERS = {
  "Content-Type": "application/json",
  product: "llu.android",
  version: "4.7.0",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 serene",
};

const REGION_HOSTS: Record<string, string> = {
  EU: "api-eu.libreview.io",
  EU2: "api-eu2.libreview.io",
  US: "api-us.libreview.io",
  AU: "api-au.libreview.io",
  AE: "api-ae.libreview.io",
  AP: "api-ap.libreview.io",
  CA: "api-ca.libreview.io",
  DE: "api-de.libreview.io",
  FR: "api-fr.libreview.io",
  IN: "api-in.libreview.io",
  JP: "api-jp.libreview.io",
  LA: "api-la.libreview.io",
  RU: "api-ru.libreview.io",
};

const DEFAULT_REGION = "EU";

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  region: z.string().default(DEFAULT_REGION),
  authToken: z.string().optional(),
  authExpires: z.number().optional(),
  patientId: z.string().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

function host(region: string): string {
  return REGION_HOSTS[region] ?? REGION_HOSTS[DEFAULT_REGION]!;
}

async function login(payload: Payload): Promise<{ token: string; expires: number }> {
  const url = `https://${host(payload.region)}/llu/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: LIBRE_HEADERS,
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });
  if (!res.ok) throw new Error(`LibreLinkUp login HTTP ${res.status}`);
  const json = (await res.json()) as {
    status?: number;
    data?: {
      authTicket?: { token?: string; expires?: number };
      redirect?: boolean;
      region?: string;
    };
  };
  if (json.data?.redirect && json.data.region) {
    return login({ ...payload, region: json.data.region.toUpperCase() });
  }
  const token = json.data?.authTicket?.token;
  const expires = json.data?.authTicket?.expires;
  if (!token || !expires) throw new Error("LibreLinkUp login: missing authTicket in response");
  return { token, expires: expires * 1000 };
}

async function ensureToken(payload: Payload): Promise<Payload> {
  const margin = 60 * 60 * 1000;
  if (payload.authToken && payload.authExpires && payload.authExpires - margin > Date.now()) {
    return payload;
  }
  const fresh = await login(payload);
  return { ...payload, authToken: fresh.token, authExpires: fresh.expires };
}

async function api<T>(path: string, payload: Payload): Promise<T> {
  const res = await fetch(`https://${host(payload.region)}${path}`, {
    method: "GET",
    headers: { ...LIBRE_HEADERS, authorization: `Bearer ${payload.authToken}` },
  });
  if (!res.ok) throw new Error(`LibreLinkUp ${path} HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function fetchPatientId(payload: Payload): Promise<string> {
  const json = await api<{ data?: ReadonlyArray<{ patientId?: string }> }>(
    "/llu/connections",
    payload,
  );
  const id = json.data?.[0]?.patientId;
  if (!id) throw new Error("LibreLinkUp: no connections found for this account");
  return id;
}

type LibreReading = {
  FactoryTimestamp?: string;
  Timestamp?: string;
  Value?: number;
  ValueInMgPerDl?: number;
  TrendArrow?: number;
};

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
  // Format: "MM/DD/YYYY hh:mm:ss AM/PM"
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

async function fetchReadings(
  payload: Payload,
): Promise<{ current: LibreReading | null; history: ReadonlyArray<LibreReading> }> {
  const patientId = payload.patientId ?? (await fetchPatientId(payload));
  const json = await api<{
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
  let payload = await ensureToken(input.payload);
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
      const mmol = typeof r.Value === "number" ? r.Value : null;
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

  // Drizzle insert ignoring duplicates on (sourceReadingId)
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
    description: "FreeStyle Libre 3 via the LibreLinkUp follower API. Polls every 1 minute.",
    authType: "credentials",
    fields: [
      { key: "email", label: "LibreLinkUp email", type: "email", required: true },
      { key: "password", label: "Password", type: "password", required: true },
      {
        key: "region",
        label: "Region",
        type: "select",
        required: true,
        options: Object.keys(REGION_HOSTS).map((r) => ({ value: r, label: r })),
        hint: "Use the region your Libre app is registered in.",
      },
    ],
  },
  payloadSchema,
  authenticate: async (raw, _ctx) => {
    const parsed = payloadSchema.parse(raw);
    const { token, expires } = await login(parsed);
    let next: Payload = { ...parsed, authToken: token, authExpires: expires };
    const id = await fetchPatientId(next);
    next = { ...next, patientId: id };
    return { payload: next };
  },
  sync: syncLibre,
  syncTasks: [
    { id: "libre-glucose", intervalCron: "*/1 * * * *", description: "Pull recent glucose" },
  ],
};
