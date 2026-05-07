ALTER TABLE `karaoke_records` RENAME COLUMN "score" TO "max_score";--> statement-breakpoint
CREATE UNIQUE INDEX `karaoke_records_song_id_user_id_unique` ON `karaoke_records` (`song_id`,`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_songs` (
	`song_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_name` text NOT NULL,
	`singer_name` text NOT NULL,
	`youtube_url` text
);
--> statement-breakpoint
INSERT INTO `__new_songs`("song_id", "song_name", "singer_name", "youtube_url") SELECT "song_id", "song_name", "singer_name", "youtube_url" FROM `songs`;--> statement-breakpoint
DROP TABLE `songs`;--> statement-breakpoint
ALTER TABLE `__new_songs` RENAME TO `songs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `songs_song_name_singer_name_unique` ON `songs` (`song_name`,`singer_name`);