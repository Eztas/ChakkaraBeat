// worker/test/apply-migrations.ts
import { env } from 'cloudflare:workers'
import { readD1Migrations } from '@cloudflare/vitest-pool-workers'
import { applyD1Migrations } from "cloudflare:test";

const migrations = await readD1Migrations('./migrations')

export async function setup() {
  await applyD1Migrations(env.chakkarabeat_db, migrations)
}
