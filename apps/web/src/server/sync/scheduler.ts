import { Cron } from "croner";
import { getDb, getOwnerId } from "../db/client";
import type { SourceId } from "../db/schema";
import { getSource } from "../sources/registry";
import { getCredential, recordError, saveCredential } from "../sources/store";

const jobs = new Map<string, Cron>();

export async function runSync(sourceId: SourceId): Promise<{ ok: boolean; error?: string }> {
  const db = getDb();
  const userId = getOwnerId();
  const credential = getCredential(db, userId, sourceId);
  if (!credential) return { ok: false, error: "not connected" };

  const source = getSource(sourceId);
  try {
    const result = await source.sync(
      { payload: credential.payload, config: credential.config ?? undefined },
      { db, userId },
    );
    saveCredential(db, userId, sourceId, result.payload, credential.config);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    recordError(db, userId, sourceId, msg);
    return { ok: false, error: msg };
  }
}

export function startSyncScheduler(): void {
  if (process.env.SERENE_DISABLE_SYNC === "1") {
    // eslint-disable-next-line no-console
    console.log("[serene] sync disabled by SERENE_DISABLE_SYNC=1");
    return;
  }
  const sources: ReadonlyArray<SourceId> = ["libre", "whoop", "garmin"];
  for (const sourceId of sources) {
    const source = getSource(sourceId);
    for (const task of source.syncTasks) {
      const key = `${sourceId}:${task.id}`;
      if (jobs.has(key)) continue;
      const job = new Cron(task.intervalCron, { name: key, protect: true }, async () => {
        await runSync(sourceId);
      });
      jobs.set(key, job);
    }
  }
}

export function stopSyncScheduler(): void {
  for (const job of jobs.values()) job.stop();
  jobs.clear();
}
