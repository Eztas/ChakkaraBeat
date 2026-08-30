# Vitest

テストの待ち時間も減らし、Viteとも相性がいい

小規模プロジェクトなので、機能と同じ箇所にテストファイルを置いてみる

`pnpm add -D vitest jsdom @testing-library/react`

**インストールしたライブラリ**
   - Vitest: テストランナー、アサーション、モック機能を提供。
   - jsdom: Node.js 上で DOM API (document や window) をシミュレート。
   - @testing-library/react: React コンポーネントを人間が使うようにテストするためのユーティリティ。

## workspaces

defineWorkspaceはvitestが4以降だと使えない, 結局workspaceは使わない(`vitest.config.ts`のみで完結する
)

import元は@cloudflare/vitest-pool-workers/configではなく@cloudflare/vitest-pool-workers本体で行う

サイトも全然新しいのが出ないので、claudeに調べてエラー文を教えながら微調整（どのAIも多分一発では正解を出せない）

`import { env } from 'cloudflare:test'`じゃなくて

`import { env } from 'cloudflare:workers'`

---

## これまでの苦悩と試行錯誤のまとめ(hono環境において, 2026/08/26)

公式ドキュメントや既存の解説記事がVitest v4系や最新の `@cloudflare/vitest-pool-workers` に対応しておらず、どのAI（ClaudeやGemini）に聞いても一発で動く構成にならず大いに苦労した。
ひたすらエラーメッセージと睨めっこしながら対応

### 1. `vitest.workspace.ts` / `defineWorkspace` の罠
* Vitest v4以降では `defineWorkspace` / `vitest.workspace.ts` の独立設定ファイル形式が非推奨・変更。
* 最終的に `vitest.config.ts` 1ファイル内の `projects` 配列でフロントエンド（jsdom）とWorker環境を分ける構成に着地。

### 2. インポート元の罠
* 公式ドキュメントの古い記述や検索記事では `import { cloudflareTest } from '@cloudflare/vitest-pool-workers/config'` と書かれていることがあるが、現在は `@cloudflare/vitest-pool-workers` 本体から直接インポートする必要がある。
* 環境変数の参照も `cloudflare:test` ではなく `import { env } from 'cloudflare:workers'` が正解。

### 3. Workers結合テストと `node:process` / `path` エラー（最難関）
* `setupFiles`（`worker/test/apply_migrations.ts` など）は **Miniflare/workerd（Workersランタイム）上** で実行される。
* そのため、`setupFiles` の中で `readD1Migrations` や Node.js の `path` / `fs` をインポートすると、モジュールが見つからず `Error: No such module "node:process"` でテストが全滅する。
* **解決策**:
  1. `vitest.config.ts`（Node.js環境）側で `readD1Migrations(path.join(__dirname, 'migrations'))` を事前実行する。
  2. Viteの `define` オプション（または `TEST_MIGRATIONS` 定数）経由でWorkers側にインライン注入する。
  3. `setupFiles` や `beforeAll` 内では Node.js モジュールを触らず、注入された定数を `applyD1Migrations(env.chakkarabeat_db, TEST_MIGRATIONS)` に渡す。

### 4. Hono `app.request` 実行時の `env` 渡し忘れ
* `app.request('/api/...', { ... }, env)` の第3引数に `env` を渡さないと、Honoのハンドラ内で `c.env.chakkarabeat_db` が `undefined` になり `500 Internal Server Error` になる。

## 参考文献

https://freelance-start.com/articles/1434

[Vitest Workspace(公式)](https://v2.vitest.dev/guide/workspace)

[Cloudflare Vitest Pool Workers Docs](https://developers.cloudflare.com/workers/testing/vitest-integration/)

[vitest workspace](https://zenn.dev/you_5805/articles/vitest-workspace)

[統合テスト](https://qiita.com/tsuzuki_takaaki/items/b810b898a36fa4a9b3f2)
