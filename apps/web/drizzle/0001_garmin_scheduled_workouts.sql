CREATE TABLE `garmin_scheduled_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`source_workout_uuid` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`name` text,
	`sport` text,
	`duration_seconds` integer,
	`description` text,
	`plan_name` text,
	`completed` integer DEFAULT false NOT NULL,
	`raw` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `garmin_scheduled_workouts_user_id_source_workout_uuid_unique` ON `garmin_scheduled_workouts` (`user_id`,`source_workout_uuid`);