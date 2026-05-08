// worker/index.ts
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { songs } from './db/schema'

const app = new Hono<{ Bindings: Env }>()

const routes = app.get('/api/songs', async (c) => {
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

export type AppType = typeof routes // Hono RPC
export default app
