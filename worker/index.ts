/// <reference path="../worker-configuration.d.ts" />
// worker/index.ts
import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { songs, karaokeRecords, karaokeScenes, scenes } from './db/schema'
import * as schema from './db/schema'
import { createMiddleware } from 'hono/factory'

const app = new Hono<{ Bindings: Env }>()

// 認証ミドルウェア, 容易, hono/factoryで型チェックを適用
const adminAuth = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const token = c.req.header('X-Admin-Token')
  if (!token || token !== c.env.ADMIN_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})

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
  .post('/api/songs', adminAuth, async (c) => {
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
.post('/api/karaoke_records', adminAuth, async (c) => {
  const body = await c.req.json<{
    song_name: string
    singer_name: string
    youtube_url?: string
    user_id: string
    scene_ids?: number[]
    memo?: string
    next?: boolean
  }>()

  const db = drizzle(c.env.chakkarabeat_db, { schema })

  // 曲の登録とレコード登録は依存関係があるのでbatchの利用不可
  // Step1: 曲を登録（重複なら既存を取得）
  const [newSong] = await db
    .insert(songs)
    .values({
      song_name: body.song_name,
      singer_name: body.singer_name,
      youtube_url: body.youtube_url ?? null,
    })
    .onConflictDoNothing() // スキーマにある同名歌手かつ同名の曲があればスキップ
    .returning() // insertした直後のDBが自動採番したIDなどを含む完全なレコード

  const song_id = newSong?.song_id ?? await db // 重複時は曲名が一致するidを取得
    .select({ song_id: songs.song_id })
    .from(songs)
    .where(and(eq(songs.song_name, body.song_name), eq(songs.singer_name, body.singer_name)))
    .then(r => r[0].song_id)

  // Step2: karaoke_recordsを登録
  const [record] = await db
    .insert(karaokeRecords)
    .values({
      song_id,
      user_id: body.user_id,
      memo: body.memo ?? null,
      next: body.next ?? false,
    })
    .onConflictDoNothing() // unique制約により、同じユーザーが同じ曲を登録するのを防止
    .returning()

  if (!record) { // 重複時は400エラー
    return c.json({ error: 'This song is already in your records.' }, 400)
  }

  // Step3: 中間テーブルにkaraoke_scenesをbatchで登録(新規シーン登録)
  if (body.scene_ids && body.scene_ids.length > 0) {
    await db.batch( // バッチで並列にシーン登録
      body.scene_ids.map((scene_id) =>
        db.insert(karaokeScenes).values({
          karaoke_id: record.karaoke_id,
          scene_id,
        })
      ) as any
    )
  }

  return c.json(record, 201)
})
.get('/api/scenes', async (c) => {
  const db = drizzle(c.env.chakkarabeat_db, { schema })
  const result = await db.select().from(scenes)
  return c.json(result)
})
.patch('/api/songs/:id/url', adminAuth, async (c) => {
  const songId = parseInt(c.req.param('id'), 10)
  if (isNaN(songId)) {
    return c.json({ error: 'Invalid ID' }, 400)
  }
  const body = await c.req.json<{ youtube_url: string }>()

  if (!body.youtube_url || body.youtube_url.length !== 11) {
    return c.json({ error: 'Invalid YouTube ID' }, 400)
  }

  const db = drizzle(c.env.chakkarabeat_db)
  const result = await db
    .update(songs)
    .set({ youtube_url: body.youtube_url })
    .where(eq(songs.song_id, songId))
    .returning()

  if (result.length === 0) {
    return c.json({ error: 'Song not found' }, 404)
  }

  return c.json(result[0])
})

export type AppType = typeof routes // Hono RPC
export default app
