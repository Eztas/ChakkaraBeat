// worker/index.integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import { env } from 'cloudflare:workers'
import { applyD1Migrations, type D1Migration } from 'cloudflare:test'
import app from './index'
import * as schema from './db/schema'

declare const TEST_MIGRATIONS: D1Migration[];

describe('GET /api/scenes', () => {
  beforeAll(async () => {
    await applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)

    // テスト環境のデータベースを取得
    const db = drizzle(env.chakkarabeat_db, { schema })

    // 初期データを挿入
    await db.insert(schema.scenes).values([
      { scene_name: 'ソロ' },
      { scene_name: '研究室' },
    ])
  })

  it('should return all scenes', async () => {
    const res = await app.request('/api/scenes', {
      headers: {
        'Content-Type': 'application/json',
      },
    }, env)

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data).toHaveLength(2)
    expect(data).toContainEqual(expect.objectContaining({ scene_name: 'ソロ' }))
    expect(data).toContainEqual(expect.objectContaining({ scene_name: '研究室' }))
  })
})

describe('PATCH /api/songs/:song_id/url', () => {
  beforeAll(async () => {
    await applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)

    const db = drizzle(env.chakkarabeat_db, { schema })
    await db.insert(schema.songs).values([
      { song_id: 1, song_name: '曲1', singer_name: '歌手1' },
    ])
  })

  it('should return 200 when youtube_url is valid', async () => {
    const res = await app.request(
      '/api/songs/1/url',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({ youtube_url: 'dQw4w9WgXcQ' }),
      },
      env
    )
    expect(res.status).toBe(200)
    const data = await res.json() as { song_id: number; youtube_url: string }
    expect(data.song_id).toBe(1)
    expect(data.youtube_url).toBe('dQw4w9WgXcQ')
  })

  it('should return 400 when youtube_url is invalid', async () => {
    const res = await app.request(
      '/api/songs/1/url',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({ youtube_url: 'invalid_id' }),
      },
      env
    )
    expect(res.status).toBe(400)
    const data = await res.json() as { error: string }
    expect(data.error).toBe('Invalid YouTube ID')
  })

  it('should return 401 when X-Admin-Token header is missing or invalid', async () => {
    const res = await app.request(
      '/api/songs/1/url',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: 'dQw4w9WgXcQ' }),
      },
      env
    )
    expect(res.status).toBe(401)
  })

  it('should return 404 when song does not exist', async () => {
    const res = await app.request(
      '/api/songs/999/url',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({ youtube_url: 'dQw4w9WgXcQ' }),
      },
      env
    )
    expect(res.status).toBe(404)
  })
})

type KaraokeRecordResponse = {
  karaoke_id: number
  user_id: string
  memo: string | null
  next: boolean
  song_name: string
  singer_name: string
  youtube_url: string | null
  scenes: { scene_id: number; scene_name: string }[]
}

describe('GET /api/karaoke_records', () => {
  beforeAll(async () => {
    await applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)

    const db = drizzle(env.chakkarabeat_db, { schema })

    // テスト用の曲、シーン、カラオケ記録、関連付けを挿入
    const [insertedSong] = await db
      .insert(schema.songs)
      .values({ song_name: 'テスト曲', singer_name: 'テスト歌手', youtube_url: 'dQw4w9WgXcQ' })
      .returning()

    const [insertedScene] = await db
      .insert(schema.scenes)
      .values({ scene_name: 'ドライブ' })
      .returning()

    const [insertedRecord] = await db
      .insert(schema.karaokeRecords)
      .values({
        song_id: insertedSong.song_id,
        user_id: 'user_1',
        memo: '練習中',
        next: true,
      })
      .returning()

    await db.insert(schema.karaokeScenes).values({
      karaoke_id: insertedRecord.karaoke_id,
      scene_id: insertedScene.scene_id,
    })
  })

  it('should return full karaoke records with flattened song info and scenes array', async () => {
    const res = await app.request('/api/karaoke_records', {
      headers: {
        'Content-Type': 'application/json',
      },
    }, env)

    expect(res.status).toBe(200)
    const data = (await res.json()) as KaraokeRecordResponse[]

    expect(data).toHaveLength(1)
    const record = data[0]
    expect(record).toMatchObject({
      user_id: 'user_1',
      memo: '練習中',
      next: true,
      song_name: 'テスト曲',
      singer_name: 'テスト歌手',
      youtube_url: 'dQw4w9WgXcQ',
      scenes: [
        expect.objectContaining({ scene_name: 'ドライブ' }),
      ],
    })
    expect('song' in record).toBe(false)
    expect('karaokeScenes' in record).toBe(false)
  })
})

describe('POST /api/karaoke_records', () => {
  beforeAll(async () => {
    await applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)

    const db = drizzle(env.chakkarabeat_db, { schema })
    await db.insert(schema.scenes).values([
      { scene_id: 10, scene_name: 'パーティー' },
      { scene_id: 11, scene_name: '夜' },
    ])
  })

  it('should return 401 when X-Admin-Token header is missing or invalid', async () => {
    const res = await app.request(
      '/api/karaoke_records',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          song_name: '新曲',
          singer_name: '新歌手',
          user_id: 'user_post_test',
        }),
      },
      env
    )
    expect(res.status).toBe(401)
  })

  it('should create song, record, and karaoke scenes successfully', async () => {
    const res = await app.request(
      '/api/karaoke_records',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({
          song_name: 'POSTテスト曲',
          singer_name: 'POSTテスト歌手',
          youtube_url: 'dQw4w9WgXcQ',
          user_id: 'user_post_1',
          scene_ids: [10, 11],
          memo: '初登録',
          next: true,
        }),
      },
      env
    )

    expect(res.status).toBe(201)
    const data = (await res.json()) as {
      karaoke_id: number
      song_id: number
      user_id: string
      memo: string | null
      next: boolean
    }

    expect(data.user_id).toBe('user_post_1')
    expect(data.memo).toBe('初登録')
    expect(data.next).toBe(true)

    // DBの状態を検証
    const db = drizzle(env.chakkarabeat_db, { schema })
    const createdRecord = await db.query.karaokeRecords.findFirst({
      where: eq(schema.karaokeRecords.karaoke_id, data.karaoke_id),
      with: {
        song: true,
        karaokeScenes: true,
      },
    })

    expect(createdRecord).toBeDefined()
    expect(createdRecord?.song.song_name).toBe('POSTテスト曲')
    expect(createdRecord?.song.singer_name).toBe('POSTテスト歌手')
    expect(createdRecord?.karaokeScenes).toHaveLength(2)
  })

  it('should reuse existing song when inserting same song and singer', async () => {
    const res = await app.request(
      '/api/karaoke_records',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({
          song_name: 'POSTテスト曲',
          singer_name: 'POSTテスト歌手',
          user_id: 'user_post_2',
        }),
      },
      env
    )

    expect(res.status).toBe(201)
    const data = (await res.json()) as { song_id: number; user_id: string }
    expect(data.user_id).toBe('user_post_2')

    // 曲テーブルの総件数が増えていないことを確認
    const db = drizzle(env.chakkarabeat_db, { schema })
    const matchedSongs = await db
      .select()
      .from(schema.songs)
      .where(
        and(
          eq(schema.songs.song_name, 'POSTテスト曲'),
          eq(schema.songs.singer_name, 'POSTテスト歌手')
        )
      )

    expect(matchedSongs).toHaveLength(1)
    expect(data.song_id).toBe(matchedSongs[0].song_id)
  })

  it('should return 400 when user tries to record the same song twice', async () => {
    const res = await app.request(
      '/api/karaoke_records',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': env.ADMIN_TOKEN,
        },
        body: JSON.stringify({
          song_name: 'POSTテスト曲',
          singer_name: 'POSTテスト歌手',
          user_id: 'user_post_1',
        }),
      },
      env
    )

    expect(res.status).toBe(400)
    const data = (await res.json()) as { error: string }
    expect(data.error).toBe('This song is already in your records.')
  })
})


