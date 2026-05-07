// worker/index.ts
import { drizzle } from 'drizzle-orm/d1'
import { songs } from './db/schema'

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/songs') {
      const db = drizzle(env.chakkarabeat_db)
      const result = await db
        .select({
          song_id: songs.song_id,
          song_name: songs.song_name,
          singer_name: songs.singer_name,
        })
        .from(songs)
      
      return Response.json(result)
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ name: "cloudflare desuyo" });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
