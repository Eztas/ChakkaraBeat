# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## インストール手順

https://developers.cloudflare.com/workers/framework-guides/web-apps/react/
を読めばOK

Geminiなどに聞くと、`pnpm create hono`や`pnpm create vite`からの手順を推奨するがこれが一番早い

## 普段の手順

1. `pnpm dev`でOK(フロントもバックも同時で実行される, 試しに`worker/index.ts`の`name`を変えると検証できる)

## デプロイ

`pnpm deploy`を実行 (参考: package.json)

mainブランチにマージするだけでデプロイ

1. GitHubにリポジトリを作り、コードをプッシュ
2. Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git を選択。
3. リポジトリを選択し、以下の設定を入れる：
  1. Framework preset: Vite
  2. Build command: pnpm build
  3. Build output directory: dist
4. Settings > Functions > Compatibility flags で `nodejs_compat` を追加（Honoを動かすのに必要）
5. Settings > Bindings で D1 を紐付け

## プレビュー画面（マージ前確認用）

## データベース(本番用, 開発用, テスト用)

jsoncに登録するのも忘れず

- 本番: `pnpm wrangler d1 create certain-db`
- ローカル: `pnpm wrangler d1 execute --local`
- プレビュー: `pnpm wrangler d1 create certain-db-preview`
- テスト: `pnpm add -D @cloudflare/vitest-pool-workers vitest`でテスト用に独立したストレージができるらしい

```
# ローカル開発（Macのsqliteに繋がる）
pnpm dev

# ローカルDBにスキーマを流す
pnpm wrangler d1 execute certain-db --local --file=./schema.sql

# ローカルDBにシードデータを入れる
pnpm wrangler d1 execute certain-db --local --file=./seed.sql

# プレビューDBにスキーマを流す（remoteのpreview環境）
pnpm wrangler d1 execute certain-db-preview --remote --file=./schema.sql

# 本番DBにスキーマを流す
pnpm wrangler d1 execute certain-db --remote --file=./schema.sql

# 本番デプロイ
pnpm run deploy
```