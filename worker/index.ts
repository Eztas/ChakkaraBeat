/// <reference path="../worker-configuration.d.ts" />
// worker/index.ts
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { songs } from './db/schema'
import * as schema from './db/schema'

const app = new Hono<{ Bindings: Env }>()

const routes = app
  .get('/api/songs', async (c) => {
    const db = drizzle(c.env.chakkarabeat_db)
    const result = await db
      .select({
        song_id: songs.song_id,
        song_name: songs.song_name,
        singer_name: songs.singer_name,
      })
      .from(songs)
    return c.json(result)
  })
  .post('/api/songs', async (c) => {
    const body = await c.req.json<{
      song_name: string
      singer_name: string
      youtube_url?: string
    }>()

    const db = drizzle(c.env.chakkarabeat_db)
    const result = await db
      .insert(songs)
      .values({
        song_name: body.song_name,
        singer_name: body.singer_name,
        youtube_url: body.youtube_url ?? null,
      })
      .returning()

    return c.json(result[0], 201)
  })
  .get('/api/karaoke_records', async (c) => {
    const db = drizzle(c.env.chakkarabeat_db, { schema }) // schemaを渡して全体のリレーションを使用可能

    const result = await db.query.karaokeRecords.findMany({ // queryを使って、複雑なLEFT JOINを回避
      with: {
        song: true, // karaokeRecordsに紐付けてsongsも取得
        karaokeScenes: {
          with: { scene: true }, // まず中間を見てから紐付けたsceneも取得
        },
      },
    })

    const fullRecords = result.map((record) => ({
      ...record, // スプレッド構文で中身だけ抽出
      song_name:    record.song.song_name,
      singer_name:  record.song.singer_name,
      youtube_url:  record.song.youtube_url,
      scenes:       record.karaokeScenes.map((ks) => ks.scene), //リレーション先のscene
      song:         undefined, // スプレッド構文ですでにある
      karaokeScenes: undefined, // スプレッド構文ですでにある
    }))

    return c.json(fullRecords)
  })

export type AppType = typeof routes // Hono RPC
export default app
