CREATE TABLE `karaoke_records` (
	`karaoke_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`last_sang_at` text,
	`score` real,
	`memo` text,
	`next` integer DEFAULT false,
	`play_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `karaoke_scenes` (
	`karaoke_id` integer NOT NULL,
	`scene_id` integer NOT NULL,
	PRIMARY KEY(`karaoke_id`, `scene_id`),
	FOREIGN KEY (`karaoke_id`) REFERENCES `karaoke_records`(`karaoke_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`scene_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`scene_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scene_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scenes_scene_name_unique` ON `scenes` (`scene_name`);--> statement-breakpoint
CREATE TABLE `songs` (
	`song_id` integer PRIMARY KEY NOT NULL,
	`song_name` text NOT NULL,
	`singer_name` text NOT NULL,
	`youtube_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `songs_song_name_singer_name_unique` ON `songs` (`song_name`,`singer_name`);