import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schema";

const DB_PATH = process.env.SERENE_DB_PATH ?? "./data/serene.db";
const HERE = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_PATH =
  process.env.SERENE_MIGRATIONS_PATH ?? resolve(HERE, "..", "..", "..", "drizzle");

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let migrated = false;

function ensureDir(path: string): void {
  const dir = dirname(resolve(path));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function getDb() {
  if (dbInstance) return dbInstance;
  ensureDir(DB_PATH);
  const sqlite = new Database(DB_PATH);
  sqlite.exec("PRAGMA journal_mode=WAL;");
  sqlite.exec("PRAGMA foreign_keys=ON;");
  dbInstance = drizzle(sqlite, { schema });
  if (!migrated) {
    migrate(dbInstance, { migrationsFolder: MIGRATIONS_PATH });
    migrated = true;
  }
  return dbInstance;
}

export type DB = ReturnType<typeof getDb>;

export function getOwnerId(): string {
  const fromEnv = process.env.SERENE_OWNER_ID;
  if (fromEnv) return fromEnv;
  const db = getDb();
  const existing = db.select().from(schema.users).limit(1).all();
  if (existing[0]) return existing[0].id;
  const id = crypto.randomUUID();
  db.insert(schema.users).values({ id, email: null, name: null }).run();
  return id;
}

export { schema };
export const TABLES = schema;
