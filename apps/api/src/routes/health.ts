import type { DependencyStatus, HealthResponse } from '@forge/types'
import type { FastifyInstance } from 'fastify'

import { APP_VERSION } from '../lib/version'

const CHECK_TIMEOUT_MS = 2_000

async function check(probe: () => Promise<unknown>): Promise<DependencyStatus> {
  let timer: NodeJS.Timeout | undefined
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('health check timed out')), CHECK_TIMEOUT_MS)
  })

  try {
    await Promise.race([probe(), timeout])
    return 'ok'
  } catch {
    return 'error'
  } finally {
    clearTimeout(timer)
  }
}

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', { config: { auth: 'public' } }, async (_request, reply) => {
    const [db, redis] = await Promise.all([
      check(() => app.prisma.$queryRaw`SELECT 1`),
      check(() => app.redis.ping()),
    ])

    const healthy = db === 'ok' && redis === 'ok'
    const body: HealthResponse = {
      status: healthy ? 'ok' : 'degraded',
      version: APP_VERSION,
      uptime: Math.round(process.uptime()),
      db,
      redis,
    }

    return reply.status(healthy ? 200 : 503).send(body)
  })
}
