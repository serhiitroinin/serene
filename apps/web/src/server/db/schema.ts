import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  createdAt: createdAt(),
});

export type SourceId = "libre" | "whoop" | "garmin";

export const dataSourceCredentials = sqliteTable(
  "data_source_credentials",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    source: text("source").$type<SourceId>().notNull(),
    encryptedPayload: text("encrypted_payload").notNull(),
    config: text("config", { mode: "json" }).$type<Record<string, unknown>>(),
    lastRefreshedAt: integer("last_refreshed_at", { mode: "timestamp_ms" }),
    lastError: text("last_error"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [unique().on(t.userId, t.source)],
);

export const glucoseReadings = sqliteTable("glucose_readings", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  source: text("source").$type<SourceId>().notNull().default("libre"),
  sourceReadingId: text("source_reading_id").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
  valueMmol: real("value_mmol").notNull(),
  trend: text("trend").$type<
    "rising_quick" | "rising" | "stable" | "falling" | "falling_quick" | null
  >(),
  raw: text("raw", { mode: "json" }),
  createdAt: createdAt(),
});

export const whoopRecoveries = sqliteTable("whoop_recoveries", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cycleId: text("cycle_id").notNull().unique(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  score: integer("score"),
  hrvMs: real("hrv_ms"),
  restingHrBpm: integer("resting_hr_bpm"),
  raw: text("raw", { mode: "json" }),
  createdAt: createdAt(),
});

export const whoopSleeps = sqliteTable("whoop_sleeps", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sleepId: text("sleep_id").notNull().unique(),
  start: integer("start", { mode: "timestamp_ms" }).notNull(),
  end: integer("end", { mode: "timestamp_ms" }).notNull(),
  score: integer("score"),
  efficiencyPercent: real("efficiency_percent"),
  durationSeconds: integer("duration_seconds"),
  raw: text("raw", { mode: "json" }),
  createdAt: createdAt(),
});

export const whoopWorkouts = sqliteTable("whoop_workouts", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workoutId: text("workout_id").notNull().unique(),
  start: integer("start", { mode: "timestamp_ms" }).notNull(),
  end: integer("end", { mode: "timestamp_ms" }).notNull(),
  strain: real("strain"),
  sport: text("sport"),
  avgHr: integer("avg_hr"),
  maxHr: integer("max_hr"),
  raw: text("raw", { mode: "json" }),
  createdAt: createdAt(),
});

export const garminActivities = sqliteTable("garmin_activities", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activityId: text("activity_id").notNull().unique(),
  start: integer("start", { mode: "timestamp_ms" }).notNull(),
  durationSeconds: integer("duration_seconds"),
  sport: text("sport"),
  distanceMeters: real("distance_meters"),
  elevationGainMeters: real("elevation_gain_meters"),
  avgHr: integer("avg_hr"),
  maxHr: integer("max_hr"),
  trainingLoad: real("training_load"),
  hasGps: integer("has_gps", { mode: "boolean" }).default(false),
  raw: text("raw", { mode: "json" }),
  createdAt: createdAt(),
});

export const garminTrackPoints = sqliteTable("garmin_track_points", {
  activityId: text("activity_id")
    .notNull()
    .references(() => garminActivities.activityId, { onDelete: "cascade" }),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  elevationM: real("elevation_m"),
  hrBpm: integer("hr_bpm"),
  speedMps: real("speed_mps"),
});

export const garminScheduledWorkouts = sqliteTable(
  "garmin_scheduled_workouts",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceWorkoutUuid: text("source_workout_uuid").notNull(),
    scheduledDate: text("scheduled_date").notNull(),
    name: text("name"),
    sport: text("sport"),
    durationSeconds: integer("duration_seconds"),
    description: text("description"),
    planName: text("plan_name"),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    raw: text("raw", { mode: "json" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [unique().on(t.userId, t.sourceWorkoutUuid)],
);

export const garminDailySummaries = sqliteTable(
  "garmin_daily_summaries",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    trainingLoadAcute: real("training_load_acute"),
    trainingLoadChronic: real("training_load_chronic"),
    bodyBattery: integer("body_battery"),
    raw: text("raw", { mode: "json" }),
    createdAt: createdAt(),
  },
  (t) => [unique().on(t.userId, t.date)],
);

export const treatments = sqliteTable("treatments", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
  kind: text("kind").$type<"insulin" | "carbs" | "exercise" | "note">().notNull(),
  label: text("label").notNull(),
  detail: text("detail"),
  source: text("source").$type<SourceId | "manual">().notNull().default("manual"),
  createdAt: createdAt(),
});

export const syncState = sqliteTable(
  "sync_state",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    source: text("source").$type<SourceId>().notNull(),
    lastFetchedAt: integer("last_fetched_at", { mode: "timestamp_ms" }),
    lastSuccessAt: integer("last_success_at", { mode: "timestamp_ms" }),
    consecutiveErrors: integer("consecutive_errors").notNull().default(0),
    nextAttemptAt: integer("next_attempt_at", { mode: "timestamp_ms" }),
    lastError: text("last_error"),
  },
  (t) => [unique().on(t.userId, t.source)],
);

export type User = typeof users.$inferSelect;
export type DataSourceCredential = typeof dataSourceCredentials.$inferSelect;
export type GlucoseReading = typeof glucoseReadings.$inferSelect;
export type WhoopRecovery = typeof whoopRecoveries.$inferSelect;
export type WhoopSleep = typeof whoopSleeps.$inferSelect;
export type WhoopWorkout = typeof whoopWorkouts.$inferSelect;
export type GarminActivity = typeof garminActivities.$inferSelect;
export type GarminTrackPoint = typeof garminTrackPoints.$inferSelect;
export type GarminScheduledWorkout = typeof garminScheduledWorkouts.$inferSelect;
export type GarminDailySummary = typeof garminDailySummaries.$inferSelect;
export type Treatment = typeof treatments.$inferSelect;
export type SyncState = typeof syncState.$inferSelect;
