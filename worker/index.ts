// worker/index.ts
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { songs } from './db/schema'

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

export type AppType = typeof routes // Hono RPC
export default app
