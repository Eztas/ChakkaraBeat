// worker/index.integration.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'
import app from './index'
import * as schema from './db/schema'

describe('GET /api/scenes', () => {
  beforeAll(async () => {
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
    })
    
    expect(res.status).toBe(200)
    const data = await res.json()
    
    expect(data).toHaveLength(2)
    expect(data).toContainEqual(expect.objectContaining({ scene_name: 'ソロ' }))
    expect(data).toContainEqual(expect.objectContaining({ scene_name: '研究室' }))
  })
})
