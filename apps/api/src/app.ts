import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import sensible from '@fastify/sensible'
import type { PrismaClient } from '@forge/db'
import Fastify, { type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import type { Redis } from 'ioredis'

import type { Env } from './env'
import { buildLoggerOptions } from './lib/logger'
import authPlugin, { type TokenVerifier } from './plugins/auth'
import errorHandlerPlugin from './plugins/error-handler'
import { healthRoutes } from './routes/health'

declare module 'fastify' {
  interface FastifyInstance {
    env: Env
    prisma: PrismaClient
    redis: Redis
  }
}

/** Everything the app needs from the outside world. Tests pass fakes. */
export interface AppDependencies {
  env: Env
  prisma: PrismaClient
  redis: Redis
  verifyToken: TokenVerifier
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

/** Builds the Fastify instance without binding a port, so tests can use `app.inject()`. */
export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  const { env } = deps

  const app = Fastify({
    logger: buildLoggerOptions(env),
    trustProxy: true,
    disableRequestLogging: false,
  })

  app.decorate('env', env)
  app.decorate('prisma', deps.prisma)
  app.decorate('redis', deps.redis)

  // Routes are schema-first: Zod schemas validate input and serialize output.
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(errorHandlerPlugin)
  await app.register(sensible)
  await app.register(helmet)
  await app.register(cors, {
    origin: [env.NEXT_PUBLIC_APP_URL],
    credentials: true,
  })
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    // Share counters across API instances; fall back to memory in tests.
    ...(env.NODE_ENV === 'test' ? {} : { redis: deps.redis }),
    skipOnError: true,
    allowList: (request) => request.url.startsWith('/health'),
  })
  await app.register(multipart, {
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  })
  await app.register(authPlugin, { verifyToken: deps.verifyToken })

  await app.register(healthRoutes)

  return app
}
