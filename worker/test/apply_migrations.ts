// worker/test/apply_migrations.ts
import { env } from 'cloudflare:workers'
import { applyD1Migrations, type D1Migration } from "cloudflare:test";

declare const TEST_MIGRATIONS: D1Migration[];

export async function setup() {
  await applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)
}

