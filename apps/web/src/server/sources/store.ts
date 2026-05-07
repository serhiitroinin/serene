import { and, eq } from "drizzle-orm";
import type { DB } from "../db/client";
import { decryptJSON, encryptJSON } from "../db/encryption";
import { dataSourceCredentials, type SourceId } from "../db/schema";

export type StoredCredential<T = unknown> = {
  id: string;
  source: SourceId;
  payload: T;
  config: Record<string, unknown> | null;
  lastRefreshedAt: Date | null;
  lastError: string | null;
};

export function getCredential<T>(
  db: DB,
  userId: string,
  source: SourceId,
): StoredCredential<T> | null {
  const row = db
    .select()
    .from(dataSourceCredentials)
    .where(and(eq(dataSourceCredentials.userId, userId), eq(dataSourceCredentials.source, source)))
    .limit(1)
    .all()[0];
  if (!row) return null;
  return {
    id: row.id,
    source: row.source,
    payload: decryptJSON<T>(row.encryptedPayload),
    config: row.config,
    lastRefreshedAt: row.lastRefreshedAt,
    lastError: row.lastError,
  };
}

export function listCredentials(
  db: DB,
  userId: string,
): ReadonlyArray<{ source: SourceId; lastRefreshedAt: Date | null; lastError: string | null }> {
  return db
    .select({
      source: dataSourceCredentials.source,
      lastRefreshedAt: dataSourceCredentials.lastRefreshedAt,
      lastError: dataSourceCredentials.lastError,
    })
    .from(dataSourceCredentials)
    .where(eq(dataSourceCredentials.userId, userId))
    .all();
}

export function saveCredential<T>(
  db: DB,
  userId: string,
  source: SourceId,
  payload: T,
  config: Record<string, unknown> | null,
): void {
  const encrypted = encryptJSON(payload);
  const now = new Date();
  db.insert(dataSourceCredentials)
    .values({
      userId,
      source,
      encryptedPayload: encrypted,
      config,
      lastRefreshedAt: now,
      lastError: null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [dataSourceCredentials.userId, dataSourceCredentials.source],
      set: {
        encryptedPayload: encrypted,
        config,
        lastRefreshedAt: now,
        lastError: null,
        updatedAt: now,
      },
    })
    .run();
}

export function recordError(db: DB, userId: string, source: SourceId, error: string): void {
  db.update(dataSourceCredentials)
    .set({ lastError: error, updatedAt: new Date() })
    .where(and(eq(dataSourceCredentials.userId, userId), eq(dataSourceCredentials.source, source)))
    .run();
}

export function clearError(db: DB, userId: string, source: SourceId): void {
  db.update(dataSourceCredentials)
    .set({ lastError: null, updatedAt: new Date() })
    .where(and(eq(dataSourceCredentials.userId, userId), eq(dataSourceCredentials.source, source)))
    .run();
}

export function deleteCredential(db: DB, userId: string, source: SourceId): void {
  db.delete(dataSourceCredentials)
    .where(and(eq(dataSourceCredentials.userId, userId), eq(dataSourceCredentials.source, source)))
    .run();
}
