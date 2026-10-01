import { Prisma } from '@forge/db'
import type { ApiErrorResponse } from '@forge/types'
import type { FastifyError, FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { ZodError } from 'zod'

import { AppError, STATUS_CODES } from '../lib/errors'

interface NormalizedError {
  statusCode: number
  code: string
  message: string
  details?: unknown
}

/** Maps anything thrown inside a request to a status, a stable code and a safe message. */
export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    }
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        code: 'CONFLICT',
        message: 'A record with this value already exists',
      }
    }
    if (error.code === 'P2025') {
      return { statusCode: 404, code: 'NOT_FOUND', message: 'Resource not found' }
    }
  }

  const candidate = error as Partial<FastifyError> | null | undefined

  if (candidate?.validation) {
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: candidate.message ?? 'Request validation failed',
      details: candidate.validation,
    }
  }

  const statusCode = candidate?.statusCode
  if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500) {
    return {
      statusCode,
      code: STATUS_CODES[statusCode] ?? 'REQUEST_ERROR',
      message: candidate?.message ?? 'Request failed',
    }
  }

  // Never leak internals: unknown failures get a generic message.
  return { statusCode: 500, code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' }
}

async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const normalized = normalizeError(error)

    // The logger ships to Axiom when AXIOM_TOKEN is configured (see lib/logger.ts).
    const logContext = {
      err: error,
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: normalized.statusCode,
      code: normalized.code,
      userId: request.userId || undefined,
      workspaceId: request.workspaceId || undefined,
    }
    if (normalized.statusCode >= 500) {
      request.log.error(logContext, 'request failed')
    } else {
      request.log.info(logContext, 'request rejected')
    }

    const body: ApiErrorResponse = {
      error: {
        code: normalized.code,
        message: normalized.message,
        statusCode: normalized.statusCode,
        requestId: request.id,
        ...(normalized.details !== undefined ? { details: normalized.details } : {}),
      },
    }
    void reply.status(normalized.statusCode).send(body)
  })

  app.setNotFoundHandler((request, reply) => {
    const body: ApiErrorResponse = {
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url.split('?')[0]} not found`,
        statusCode: 404,
        requestId: request.id,
      },
    }
    void reply.status(404).send(body)
  })
}

export default fp(errorHandlerPlugin, { name: 'error-handler' })
