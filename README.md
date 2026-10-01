# Forge AI

AI-powered B2B outbound sales platform. The full product specification lives in [CLAUDE.md](./CLAUDE.md).

## Repository layout

| Path                       | What it is                                         |
| -------------------------- | -------------------------------------------------- |
| `apps/web`                 | Next.js 14 frontend (App Router)                   |
| `apps/api`                 | Fastify backend                                    |
| `apps/workers`             | BullMQ consumers, deployed as a separate process   |
| `apps/extension`           | Chrome extension (WXT, Manifest V3)                |
| `packages/db`              | Prisma schema and client singleton                 |
| `packages/types`           | Shared TypeScript types                            |
| `packages/email-templates` | react-email components                             |
| `packages/ai`              | Shared AI prompt library                           |
| `packages/config`          | Shared ESLint, Prettier and TypeScript base config |

## Getting started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env   # then fill in the values you need
docker compose up -d   # local Postgres (pgvector) + Redis
pnpm db:migrate        # apply migrations
pnpm db:seed           # demo workspace, campaign, leads and stats
pnpm dev
```

## Database

The Prisma schema lives in `packages/db/schema.prisma`; migrations are in `packages/db/migrations`.

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `pnpm db:migrate` | Create and apply a migration from schema changes |
| `pnpm db:push`    | Push the schema without creating a migration     |
| `pnpm db:seed`    | Seed demo data (safe to run repeatedly)          |
| `pnpm db:studio`  | Open Prisma Studio                               |

## Scripts

| Command          | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Run every app in watch mode          |
| `pnpm build`     | Build every app and package          |
| `pnpm typecheck` | Type-check every workspace           |
| `pnpm lint`      | Lint every workspace (zero warnings) |
| `pnpm test`      | Run every test suite                 |
| `pnpm format`    | Format the repo with Prettier        |
