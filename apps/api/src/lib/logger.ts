import type { FastifyServerOptions } from 'fastify'

import type { Env } from '../env'

type LoggerOptions = NonNullable<FastifyServerOptions['logger']>

/**
 * Pino options for the Fastify logger. With an Axiom token configured, every
 * log line (requests, errors, job events) is shipped to Axiom as well as stdout.
 */
export function buildLoggerOptions(env: Env): LoggerOptions {
  if (env.NODE_ENV === 'test' || env.LOG_LEVEL === 'silent') return false

  const base = {
    level: env.LOG_LEVEL,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'req.headers["x-api-key"]'],
      censor: '[redacted]',
    },
  }

  if (!env.AXIOM_TOKEN) return base

  return {
    ...base,
    transport: {
      targets: [
        { target: 'pino/file', level: env.LOG_LEVEL, options: { destination: 1 } },
        {
          target: '@axiomhq/pino',
          level: env.LOG_LEVEL,
          options: {
            dataset: env.AXIOM_DATASET,
            token: env.AXIOM_TOKEN,
            ...(env.AXIOM_ORG_ID ? { orgId: env.AXIOM_ORG_ID } : {}),
          },
        },
      ],
    },
  }
}
