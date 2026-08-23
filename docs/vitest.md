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

## 参考文献

https://freelance-start.com/articles/1434

[Vitest Workspace(公式)](https://v2.vitest.dev/guide/workspace)

[vitest workspace](https://zenn.dev/you_5805/articles/vitest-workspace)
