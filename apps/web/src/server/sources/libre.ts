import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { glucoseReadings } from "../db/schema";
import type { Source, SourceContext } from "./types";

const LIBRE_HEADERS: Record<string, string> = {
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
  accountIdHash: z.string().optional(),
  patientId: z.string().optional(),
});

type Payload = z.infer<typeof payloadSchema>;

type AuthTicket = { token: string; expires: number };

type LoginUser = { id?: string; accountId?: string };

type LoginResponse = {
  status?: number;
  message?: string;
  error?: { message?: string };
  data?: {
    authTicket?: { token?: string; expires?: number };
    redirect?: boolean;
    region?: string;
    user?: LoginUser;
    step?: { type?: string; componentName?: string };
  };
};

function host(region: string): string {
  return REGION_HOSTS[region] ?? REGION_HOSTS[DEFAULT_REGION]!;
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function pickAccountIdHash(user?: LoginUser): string | undefined {
  const id = user?.id ?? user?.accountId;
  return id ? sha256Hex(id) : undefined;
}

function authHeaders(payload: Payload): Record<string, string> {
  const h: Record<string, string> = { ...LIBRE_HEADERS };
  if (payload.authToken) h.authorization = `Bearer ${payload.authToken}`;
  if (payload.accountIdHash) h["account-id"] = payload.accountIdHash;
  return h;
}

async function postLogin(
  payload: Payload,
  body: Record<string, unknown> = { email: payload.email, password: payload.password },
): Promise<LoginResponse> {
  const url = `https://${host(payload.region)}/llu/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(payload),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: LoginResponse;
  try {
    json = JSON.parse(text) as LoginResponse;
  } catch {
    throw new Error(`LibreLinkUp login HTTP ${res.status}: ${text.slice(0, 160)}`);
  }
  if (!res.ok) {
    const msg = json.error?.message ?? json.message ?? text.slice(0, 160);
    throw new Error(`LibreLinkUp login HTTP ${res.status}: ${msg}`);
  }
  return json;
}

async function continueStep(step: string, payload: Payload): Promise<LoginResponse> {
  // The LibreLinkUp ToU / consent flow expects a POST to
  // /llu/auth/continue/{step} with the in-flight bearer + account-id headers.
  const url = `https://${host(payload.region)}/llu/auth/continue/${step}`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(payload),
    body: JSON.stringify({}),
  });
  const text = await res.text();
  let json: LoginResponse;
  try {
    json = JSON.parse(text) as LoginResponse;
  } catch {
    throw new Error(`LibreLinkUp continue/${step} HTTP ${res.status}: ${text.slice(0, 160)}`);
  }
  if (!res.ok) {
    const msg = json.error?.message ?? json.message ?? text.slice(0, 160);
    throw new Error(`LibreLinkUp continue/${step} HTTP ${res.status}: ${msg}`);
  }
  return json;
}

async function login(
  initial: Payload,
): Promise<{ ticket: AuthTicket; accountIdHash: string | undefined; region: string }> {
  let payload = initial;
  let json = await postLogin(payload);

  // Handle region redirect (e.g., EU vs EU2)
  if (json.data?.redirect && json.data.region) {
    payload = { ...payload, region: json.data.region.toUpperCase() };
    json = await postLogin(payload);
  }

  // Capture account-id hash early so the continue/* step is authenticated.
  let accountIdHash = pickAccountIdHash(json.data?.user);

  // Bearer token is sometimes present even on the step response so we can
  // POST the continue endpoint authenticated. Carry it forward.
  if (json.data?.authTicket?.token) {
    payload = {
      ...payload,
      authToken: json.data.authTicket.token,
      authExpires: (json.data.authTicket.expires ?? 0) * 1000,
      accountIdHash,
    };
  } else {
    payload = { ...payload, accountIdHash };
  }

  // Walk through any number of step screens (tou, pp, etc.). Bound the loop
  // so a malformed response can't hang the connect flow.
  let stepCount = 0;
  while (json.data?.step?.type && stepCount < 5) {
    stepCount++;
    json = await continueStep(json.data.step.type, payload);
    accountIdHash = pickAccountIdHash(json.data?.user) ?? accountIdHash;
    if (json.data?.authTicket?.token) {
      payload = {
        ...payload,
        authToken: json.data.authTicket.token,
        authExpires: (json.data.authTicket.expires ?? 0) * 1000,
        accountIdHash,
      };
    }
  }

  const token = json.data?.authTicket?.token;
  const expires = json.data?.authTicket?.expires;
  if (!token || !expires) {
    const stepHint = json.data?.step ? ` (stuck on step "${json.data.step.type}")` : "";
    throw new Error(
      `LibreLinkUp login: missing authTicket in response${stepHint}. ` +
        `Try logging into the LibreView website and accepting any pending terms, then retry.`,
    );
  }
  return {
    ticket: { token, expires: expires * 1000 },
    accountIdHash,
    region: payload.region,
  };
}

async function ensureAuthenticated(payload: Payload): Promise<Payload> {
  const margin = 60 * 60 * 1000;
  if (
    payload.authToken &&
    payload.authExpires &&
    payload.accountIdHash &&
    payload.authExpires - margin > Date.now()
  ) {
    return payload;
  }
  const fresh = await login(payload);
  return {
    ...payload,
    region: fresh.region,
    authToken: fresh.ticket.token,
    authExpires: fresh.ticket.expires,
    accountIdHash: fresh.accountIdHash,
  };
}

async function api<T>(path: string, payload: Payload): Promise<T> {
  const res = await fetch(`https://${host(payload.region)}${path}`, {
    method: "GET",
    headers: authHeaders(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`LibreLinkUp ${path} HTTP ${res.status}: ${text.slice(0, 160)}`);
  }
  return JSON.parse(text) as T;
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
  authenticate: async (raw) => {
    const parsed = payloadSchema.parse(raw);
    const { ticket, accountIdHash, region } = await login(parsed);
    let next: Payload = {
      ...parsed,
      region,
      authToken: ticket.token,
      authExpires: ticket.expires,
      accountIdHash,
    };
    const id = await fetchPatientId(next);
    next = { ...next, patientId: id };
    return { payload: next };
  },
  sync: syncLibre,
  syncTasks: [
    { id: "libre-glucose", intervalCron: "*/1 * * * *", description: "Pull recent glucose" },
  ],
};
