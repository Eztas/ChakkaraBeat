import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'sqlite', // 今回は Cloudflare D1 なので sqlite
  schema: './worker/db/schema.ts', // schemaファイル（またはフォルダ）の場所を指定
  out: './migrations', // SQLファイルの出力先
  driver: 'd1-http', // Cloudflare D1にpushなどでDrizzleが接続するために必須の指定
  casing: 'snake_case', // 自動でスネークケースに変換
  // dbCredentialsはwranglerで見るため不要
  // migrationsもマイグレーション名はデフォルトでいいので不要
});
