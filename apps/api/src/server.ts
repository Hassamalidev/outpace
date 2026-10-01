import './load-env'

import { buildApp } from './app'
import { parseEnv } from './env'
import { prisma } from './lib/prisma'
import { closeRedis, getRedis } from './lib/redis'
import { createClerkVerifier } from './plugins/auth'

const env = parseEnv(process.env)
const redis = getRedis(env.REDIS_URL)

const app = await buildApp({
  env,
  prisma,
  redis,
  verifyToken: createClerkVerifier(env.CLERK_SECRET_KEY),
})

redis.on('error', (error) => app.log.error({ err: error }, 'redis connection error'))
// Connect eagerly so the first request does not pay for it; retries continue in the background.
redis.connect().catch((error: unknown) => app.log.error({ err: error }, 'redis connect failed'))

let shuttingDown = false
async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return
  shuttingDown = true
  app.log.info({ signal }, 'shutting down')
  await app.close()
  await Promise.allSettled([prisma.$disconnect(), closeRedis()])
  process.exit(0)
}

process.on('SIGINT', (signal) => void shutdown(signal))
process.on('SIGTERM', (signal) => void shutdown(signal))

try {
  await app.listen({ port: env.PORT, host: env.HOST })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
