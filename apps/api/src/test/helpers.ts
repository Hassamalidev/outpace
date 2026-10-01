import type { PrismaClient } from '@forge/db'
import type { FastifyInstance } from 'fastify'
import type { Redis } from 'ioredis'
import { vi } from 'vitest'

import { buildApp } from '../app'
import { parseEnv } from '../env'
import type { AuthClaims, TokenVerifier } from '../plugins/auth'

export function createFakePrisma() {
  return {
    $queryRaw: vi.fn().mockResolvedValue([{ ok: 1 }]),
    workspaceMember: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
  }
}

export function createFakeRedis() {
  return {
    ping: vi.fn().mockResolvedValue('PONG'),
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  }
}

export type FakePrisma = ReturnType<typeof createFakePrisma>
export type FakeRedis = ReturnType<typeof createFakeRedis>

/** Tokens the fake verifier accepts, mapped to the claims they carry. */
export const TEST_TOKENS: Record<string, AuthClaims> = {
  'valid-token': { sub: 'clerk_user_1' },
  'workspace-token': { sub: 'clerk_user_1', metadata: { workspaceId: 'ws_claimed' } },
}

export const fakeVerifyToken: TokenVerifier = async (token) => {
  const claims = TEST_TOKENS[token]
  if (!claims) throw new Error('token rejected')
  return claims
}

export interface TestApp {
  app: FastifyInstance
  prisma: FakePrisma
  redis: FakeRedis
}

export async function buildTestApp(): Promise<TestApp> {
  const prisma = createFakePrisma()
  const redis = createFakeRedis()

  const app = await buildApp({
    env: parseEnv({ NODE_ENV: 'test' }),
    prisma: prisma as unknown as PrismaClient,
    redis: redis as unknown as Redis,
    verifyToken: fakeVerifyToken,
  })

  return { app, prisma, redis }
}
