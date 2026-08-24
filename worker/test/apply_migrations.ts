// worker/test/apply_migrations.ts
import { env } from 'cloudflare:workers'
import { readD1Migrations } from '@cloudflare/vitest-pool-workers'
import { applyD1Migrations } from "cloudflare:test";
import path from "path";

const migrations = await readD1Migrations(path.join(__dirname, '..', 'migrations'))

export async function setup() {
  await applyD1Migrations(env.chakkarabeat_db, migrations)
}
