import type { z } from "zod";
import type { DB } from "../db/client";
import type { SourceId } from "../db/schema";

export type ConnectionStatus = "disconnected" | "connected" | "error" | "syncing";

export type SourceField = {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "email";
  placeholder?: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
  hint?: string;
};

export type SourceMeta = {
  id: SourceId;
  name: string;
  description: string;
  authType: "credentials" | "oauth";
  fields: ReadonlyArray<SourceField>;
};

export type SyncTask = {
  id: string;
  intervalCron: string;
  description: string;
};

export type SourceContext = {
  db: DB;
  userId: string;
};

export type Source<TPayload = unknown, TConfig = unknown> = {
  meta: SourceMeta;
  payloadSchema: z.ZodType<TPayload>;
  configSchema?: z.ZodType<TConfig>;
  authenticate: (
    input: TPayload,
    ctx: SourceContext,
  ) => Promise<{ payload: TPayload; config?: TConfig }>;
  sync: (
    input: { payload: TPayload; config?: TConfig },
    ctx: SourceContext,
  ) => Promise<{ payload: TPayload }>;
  syncTasks: ReadonlyArray<SyncTask>;
};

export type AnySource = Source<any, any>;
