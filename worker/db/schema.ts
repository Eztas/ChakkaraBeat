// worker/db/schema.ts
import { sqliteTable, integer, text, real, primaryKey, unique } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
//  import { defineRelations } from 'drizzle-orm'// 現在betaの次のバージョン以降

// tables
export const songs = sqliteTable('songs', {
  song_id:     integer('song_id').primaryKey({ autoIncrement: true }),
  song_name:   text('song_name').notNull(), // 検索用のひらがな, アルファベットは後に実施
  singer_name: text('singer_name').notNull(), // 検索用のひらがな, アルファベットは後に実施
  youtube_url: text('youtube_url'),
  // singer_idやsingerテーブルはMVPでは不要
}, (t) => [
  unique().on(t.song_name, t.singer_name), // 同じ歌手・同じ曲の重複登録を防ぐ, 主キーほどではない
])

export const scenes = sqliteTable('scenes', {
  scene_id:   integer('scene_id').primaryKey({ autoIncrement: true }),
  scene_name: text('scene_name').notNull().unique(), // シーン名の重複防止,
})

export const karaokeRecords = sqliteTable('karaoke_records', {
  karaoke_id:   integer('karaoke_id').primaryKey({ autoIncrement: true }),
  song_id:      integer('song_id').notNull().references(() => songs.song_id),
  user_id:      text('user_id').notNull(),
  created_at:   text('created_at').notNull().default(sql`(datetime('now', 'localtime'))`), // JST
  updated_at:   text('updated_at').notNull().default(sql`(datetime('now', 'localtime'))`), // JST
  last_sang_at: text('last_sang_at'),
  max_score:    real('max_score'), // 機械はもうmemoに書いておく, どの日に最高スコアなのかはMVP外
  memo:         text('memo'),
  next:         integer('next', { mode: 'boolean' }).default(false), // drizzleを使ってbooleanも使用可能
  play_count:   integer('play_count').notNull().default(0),
}, (t) => [
  unique().on(t.song_id, t.user_id),
])

export const karaokeScenes = sqliteTable('karaoke_scenes', {
  karaoke_id: integer('karaoke_id').notNull().references(() => karaokeRecords.karaoke_id),
  scene_id:   integer('scene_id').notNull().references(() => scenes.scene_id),
}, (t) => [
  // 複合主キーにして、テーブル内の重複をなくす
  primaryKey({ columns: [t.karaoke_id, t.scene_id] }),
])

// relations, relationsの変更のみならマイグレーション不要
// 1リレーションあると2つのrelations関数を用いる(各テーブルにおける自分のテーブルから見た関係性)

// 1つの曲は複数のカラオケ記録に紐付く
export const songsRelations = relations(songs, ({ many }) => ({
  records: many(karaokeRecords),
}))

// カラオケ記録は1つの曲にidで紐づく + カラオケ記録は複数のカラオケシーンに紐づく
// fields: 「自分のテーブル」にある、相手を指し示すためのカラム（外部キー）
// references: 「相手のテーブル」にある、自分と紐付くための一意なカラム（主キー）
export const karaokeRecordsRelations = relations(karaokeRecords, ({ one, many }) => ({
  song: one(songs, { fields: [karaokeRecords.song_id], references: [songs.song_id] }), // -> songs
  karaokeScenes: many(karaokeScenes), // -> karaoke_scenes
}))

// 1つのシーンは複数のカラオケシーン(中間テーブル)に紐付く, 多対多を中間テーブルの多対１に分解
export const scenesRelations = relations(scenes, ({ many }) => ({
  karaokeScenes: many(karaokeScenes),
}))

// 中間テーブルのカラオケ記録とシーンはそれぞれ多対1で紐づく
export const karaokeScenesRelations = relations(karaokeScenes, ({ one }) => ({
  record: one(karaokeRecords, { fields: [karaokeScenes.karaoke_id], references: [karaokeRecords.karaoke_id] }),
  scene: one(scenes, { fields: [karaokeScenes.scene_id], references: [scenes.scene_id] }),
}))
