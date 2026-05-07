CREATE TABLE `data_source_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`source` text NOT NULL,
	`encrypted_payload` text NOT NULL,
	`config` text,
	`last_refreshed_at` integer,
	`last_error` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_source_credentials_user_id_source_unique` ON `data_source_credentials` (`user_id`,`source`);--> statement-breakpoint
CREATE TABLE `garmin_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`activity_id` text NOT NULL,
	`start` integer NOT NULL,
	`duration_seconds` integer,
	`sport` text,
	`distance_meters` real,
	`elevation_gain_meters` real,
	`avg_hr` integer,
	`max_hr` integer,
	`training_load` real,
	`has_gps` integer DEFAULT false,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `garmin_activities_activity_id_unique` ON `garmin_activities` (`activity_id`);--> statement-breakpoint
CREATE TABLE `garmin_daily_summaries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`training_load_acute` real,
	`training_load_chronic` real,
	`body_battery` integer,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `garmin_daily_summaries_user_id_date_unique` ON `garmin_daily_summaries` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `garmin_track_points` (
	`activity_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`elevation_m` real,
	`hr_bpm` integer,
	FOREIGN KEY (`activity_id`) REFERENCES `garmin_activities`(`activity_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `glucose_readings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`source` text DEFAULT 'libre' NOT NULL,
	`source_reading_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`value_mmol` real NOT NULL,
	`trend` text,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sync_state` (
	`user_id` text NOT NULL,
	`source` text NOT NULL,
	`last_fetched_at` integer,
	`last_success_at` integer,
	`consecutive_errors` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer,
	`last_error` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sync_state_user_id_source_unique` ON `sync_state` (`user_id`,`source`);--> statement-breakpoint
CREATE TABLE `treatments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`kind` text NOT NULL,
	`label` text NOT NULL,
	`detail` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `whoop_recoveries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`cycle_id` text NOT NULL,
	`date` integer NOT NULL,
	`score` integer,
	`hrv_ms` real,
	`resting_hr_bpm` integer,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `whoop_recoveries_cycle_id_unique` ON `whoop_recoveries` (`cycle_id`);--> statement-breakpoint
CREATE TABLE `whoop_sleeps` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sleep_id` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`score` integer,
	`efficiency_percent` real,
	`duration_seconds` integer,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `whoop_sleeps_sleep_id_unique` ON `whoop_sleeps` (`sleep_id`);--> statement-breakpoint
CREATE TABLE `whoop_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workout_id` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`strain` real,
	`sport` text,
	`avg_hr` integer,
	`max_hr` integer,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `whoop_workouts_workout_id_unique` ON `whoop_workouts` (`workout_id`);