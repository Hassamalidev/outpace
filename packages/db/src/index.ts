import { PrismaClient } from '@prisma/client'

import { buildDatasourceUrl, parsePositiveInt } from './datasource'

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  const isProduction = process.env.NODE_ENV === 'production'

  return new PrismaClient({
    log: isProduction ? ['error'] : ['warn', 'error'],
    ...(databaseUrl
      ? {
          datasourceUrl: buildDatasourceUrl(databaseUrl, {
            connectionLimit: parsePositiveInt(process.env.DATABASE_CONNECTION_LIMIT),
            poolTimeout: parsePositiveInt(process.env.DATABASE_POOL_TIMEOUT),
          }),
        }
      : {}),
  })
}

// Reuse one client across hot reloads in development so we never exhaust the pool.
const globalForPrisma = globalThis as typeof globalThis & { __forgePrisma?: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.__forgePrisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__forgePrisma = prisma
}

export { buildDatasourceUrl } from './datasource'
export * from '@prisma/client'
