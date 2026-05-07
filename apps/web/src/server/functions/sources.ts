import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb, getOwnerId } from "../db/client";
import type { SourceId } from "../db/schema";
import { getSource, sourceList } from "../sources/registry";
import { deleteCredential, listCredentials, saveCredential } from "../sources/store";
import { exchangeWhoopCode } from "../sources/whoop";
import { runSync } from "../sync/scheduler";

const sourceIdSchema = z.enum(["libre", "whoop", "garmin"]);

export const listSourcesFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOwnerId();
  const stored = listCredentials(db, userId);
  const byId = new Map(stored.map((s) => [s.source, s]));
  return sourceList.map((src) => {
    const found = byId.get(src.meta.id);
    return {
      meta: src.meta,
      connected: Boolean(found),
      lastRefreshedAt: found?.lastRefreshedAt ?? null,
      lastError: found?.lastError ?? null,
    };
  });
});

export const connectSourceFn = createServerFn({ method: "POST" })
  .inputValidator((input: { source: SourceId; payload: unknown }) => ({
    source: sourceIdSchema.parse(input.source),
    payload: input.payload,
  }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    const source = getSource(data.source);
    try {
      const result = await source.authenticate(data.payload, { db, userId });
      saveCredential(db, userId, data.source, result.payload, result.config ?? null);
      const sync = await runSync(data.source);
      return { ok: true, syncOk: sync.ok, syncError: sync.error };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  });

export const disconnectSourceFn = createServerFn({ method: "POST" })
  .inputValidator((input: { source: SourceId }) => ({
    source: sourceIdSchema.parse(input.source),
  }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    deleteCredential(db, userId, data.source);
    return { ok: true };
  });

export const triggerSyncFn = createServerFn({ method: "POST" })
  .inputValidator((input: { source: SourceId }) => ({
    source: sourceIdSchema.parse(input.source),
  }))
  .handler(async ({ data }) => {
    return runSync(data.source);
  });

export const getWhoopAuthorizeUrlFn = createServerFn({ method: "GET" }).handler(async () => {
  const { buildWhoopAuthorizeUrl } = await import("../sources/whoop");
  const state = crypto.randomUUID();
  return { url: buildWhoopAuthorizeUrl(state), state };
});

export const completeWhoopOAuthFn = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => ({ code: z.string().min(1).parse(input.code) }))
  .handler(async ({ data }) => {
    const db = getDb();
    const userId = getOwnerId();
    try {
      const tokens = await exchangeWhoopCode(data.code);
      saveCredential(db, userId, "whoop", tokens, null);
      const sync = await runSync("whoop");
      return { ok: true, syncOk: sync.ok, syncError: sync.error };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  });

// Re-export the source field metadata for client UI
export const getSourceMetaFn = createServerFn({ method: "GET" }).handler(async () => {
  return sourceList.map((s) => s.meta);
});
