import { z } from "zod";
import { whoopRecoveries, whoopSleeps, whoopWorkouts } from "../db/schema";
import type { Source, SourceContext } from "./types";

const AUTH_BASE = "https://api.prod.whoop.com/oauth/oauth2";
const API_BASE = "https://api.prod.whoop.com/developer/v1";

const SCOPES = [
  "read:recovery",
  "read:sleep",
  "read:workout",
  "read:cycles",
  "read:profile",
  "offline",
].join(" ");

const payloadSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});

type Payload = z.infer<typeof payloadSchema>;

export function getWhoopRedirectUri(): string {
  return process.env.WHOOP_REDIRECT_URI ?? "http://localhost:3001/settings?tab=sources";
}

export function getWhoopClient(): { id: string; secret: string } {
  const id = process.env.WHOOP_CLIENT_ID;
  const secret = process.env.WHOOP_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET env vars are required. Register a developer app at https://developer.whoop.com.",
    );
  }
  return { id, secret };
}

// Single-process single-tenant state store. State expires after 10 minutes.
const issuedStates = new Map<string, number>();
const STATE_TTL_MS = 10 * 60 * 1000;

function pruneStates(): void {
  const now = Date.now();
  for (const [s, exp] of issuedStates) {
    if (exp < now) issuedStates.delete(s);
  }
}

export function issueWhoopState(): string {
  pruneStates();
  const state = crypto.randomUUID();
  issuedStates.set(state, Date.now() + STATE_TTL_MS);
  return state;
}

export function consumeWhoopState(state: string): boolean {
  pruneStates();
  const exp = issuedStates.get(state);
  if (exp == null) return false;
  issuedStates.delete(state);
  return exp >= Date.now();
}

export function buildWhoopAuthorizeUrl(state: string): string {
  const { id } = getWhoopClient();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: id,
    redirect_uri: getWhoopRedirectUri(),
    scope: SCOPES,
    state,
  });
  return `${AUTH_BASE}/auth?${params.toString()}`;
}

export async function exchangeWhoopCode(code: string): Promise<Payload> {
  const { id, secret } = getWhoopClient();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getWhoopRedirectUri(),
    client_id: id,
    client_secret: secret,
  });
  const res = await fetch(`${AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`WHOOP token exchange HTTP ${res.status}`);
  const json = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
}

async function refreshWhoopToken(payload: Payload): Promise<Payload> {
  const { id, secret } = getWhoopClient();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: payload.refreshToken,
    client_id: id,
    client_secret: secret,
  });
  const res = await fetch(`${AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`WHOOP token refresh HTTP ${res.status}`);
  const json = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? payload.refreshToken,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
}

async function ensureWhoopToken(payload: Payload): Promise<Payload> {
  const margin = 60 * 1000;
  if (payload.expiresAt - margin > Date.now()) return payload;
  return refreshWhoopToken(payload);
}

async function whoopFetch<T>(path: string, payload: Payload): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { authorization: `Bearer ${payload.accessToken}` },
  });
  if (!res.ok) throw new Error(`WHOOP ${path} HTTP ${res.status}`);
  return (await res.json()) as T;
}

type WhoopRecovery = {
  cycle_id: number;
  created_at: string;
  score?: { recovery_score?: number; hrv_rmssd_milli?: number; resting_heart_rate?: number };
};
type WhoopSleep = {
  id: number;
  start: string;
  end: string;
  score?: { sleep_performance_percentage?: number; sleep_efficiency_percentage?: number };
  during?: { duration?: { milli?: number } };
};
type WhoopWorkout = {
  id: number;
  start: string;
  end: string;
  sport_id?: number;
  score?: { strain?: number; average_heart_rate?: number; max_heart_rate?: number };
};

async function syncWhoop(
  input: { payload: Payload },
  ctx: SourceContext,
): Promise<{ payload: Payload }> {
  const payload = await ensureWhoopToken(input.payload);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const start = encodeURIComponent(since);

  type Page<T> = { records: ReadonlyArray<T>; next_token?: string };

  const recoveries = await whoopFetch<Page<WhoopRecovery>>(
    `/recovery?start=${start}&limit=25`,
    payload,
  );
  const sleeps = await whoopFetch<Page<WhoopSleep>>(
    `/activity/sleep?start=${start}&limit=25`,
    payload,
  );
  const workouts = await whoopFetch<Page<WhoopWorkout>>(
    `/activity/workout?start=${start}&limit=25`,
    payload,
  );

  for (const r of recoveries.records) {
    ctx.db
      .insert(whoopRecoveries)
      .values({
        userId: ctx.userId,
        cycleId: String(r.cycle_id),
        date: new Date(r.created_at),
        score: r.score?.recovery_score ?? null,
        hrvMs: r.score?.hrv_rmssd_milli ?? null,
        restingHrBpm: r.score?.resting_heart_rate ?? null,
        raw: r,
      })
      .onConflictDoNothing()
      .run();
  }

  for (const s of sleeps.records) {
    ctx.db
      .insert(whoopSleeps)
      .values({
        userId: ctx.userId,
        sleepId: String(s.id),
        start: new Date(s.start),
        end: new Date(s.end),
        score: s.score?.sleep_performance_percentage ?? null,
        efficiencyPercent: s.score?.sleep_efficiency_percentage ?? null,
        durationSeconds: s.during?.duration?.milli
          ? Math.round(s.during.duration.milli / 1000)
          : null,
        raw: s,
      })
      .onConflictDoNothing()
      .run();
  }

  for (const w of workouts.records) {
    ctx.db
      .insert(whoopWorkouts)
      .values({
        userId: ctx.userId,
        workoutId: String(w.id),
        start: new Date(w.start),
        end: new Date(w.end),
        strain: w.score?.strain ?? null,
        sport: w.sport_id ? String(w.sport_id) : null,
        avgHr: w.score?.average_heart_rate ?? null,
        maxHr: w.score?.max_heart_rate ?? null,
        raw: w,
      })
      .onConflictDoNothing()
      .run();
  }

  return { payload };
}

export const whoopSource: Source<Payload> = {
  meta: {
    id: "whoop",
    name: "WHOOP",
    description:
      "Recovery, sleep, and workouts via WHOOP's official OAuth2 API. Polls every 30 minutes.",
    authType: "oauth",
    fields: [],
  },
  payloadSchema,
  authenticate: async (raw) => ({ payload: payloadSchema.parse(raw) }),
  sync: syncWhoop,
  syncTasks: [
    {
      id: "whoop-recovery-sleep-workouts",
      intervalCron: "*/30 * * * *",
      description: "Pull recovery, sleep, and workouts (last 30 days)",
    },
  ],
};
