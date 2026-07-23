# Basic Rules

- デフォルトの言語は日本語としてください。
- 指摘は建設的かつ丁寧なトーンで行ってください。
- 不明点がある場合は推測せず質問してください。
- 既存の設計を尊重し、大きなリファクタリングは提案のみ行ってください。

# Project

chakkarabeat is a karaoke song management and recommendation app.

## Architecture

- Frontend: React + TypeScript + shadcn + TailwindCSS
- Backend: Hono + TypeScript
- Build: Vite
- Runtime: Cloudflare Workers
- Database: Cloudflare D1
- ORM: Drizzle
- Linter + Formatter: Biome

## Coding Guidelines

- Use TypeScript.
- Prefer functional React components.
- Keep components focused on a single responsibility.
- Reuse existing utilities before creating new ones.
- Do not introduce new dependencies unless necessary.
- Follow existing naming conventions.

## Cloudflare

- Use Cloudflare Workers APIs.
- Assume D1 is the primary database.
- Do not use Node.js-only APIs unless explicitly requested.

## Verification

- `pnpm check`: Linter + Formatter
- `pnpm test`: Test
