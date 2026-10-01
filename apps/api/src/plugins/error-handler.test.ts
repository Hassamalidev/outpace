import { Prisma } from '@forge/db'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { AppError } from '../lib/errors'
import { buildTestApp, type TestApp } from '../test/helpers'
import { normalizeError } from './error-handler'

describe('normalizeError', () => {
  it('passes AppError through with its details', () => {
    const error = new AppError(402, 'INSUFFICIENT_CREDITS', 'Not enough credits', { balance: 0 })

    expect(normalizeError(error)).toEqual({
      statusCode: 402,
      code: 'INSUFFICIENT_CREDITS',
      message: 'Not enough credits',
      details: { balance: 0 },
    })
  })

  it('maps zod failures to a 400 with field paths', () => {
    const result = z.object({ email: z.string().email() }).safeParse({ email: 'nope' })
    const normalized = normalizeError(result.error)

    expect(normalized.statusCode).toBe(400)
    expect(normalized.code).toBe('VALIDATION_ERROR')
    expect(normalized.details).toEqual([{ path: 'email', message: 'Invalid email' }])
  })

  it('maps prisma unique violations to 409 and missing records to 404', () => {
    const unique = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: 'test',
    })
    const missing = new Prisma.PrismaClientKnownRequestError('gone', {
      code: 'P2025',
      clientVersion: 'test',
    })

    expect(normalizeError(unique)).toMatchObject({ statusCode: 409, code: 'CONFLICT' })
    expect(normalizeError(missing)).toMatchObject({ statusCode: 404, code: 'NOT_FOUND' })
  })

  it('keeps 4xx statuses raised by plugins', () => {
    const error = Object.assign(new Error('Rate limit exceeded'), { statusCode: 429 })

    expect(normalizeError(error)).toEqual({
      statusCode: 429,
      code: 'RATE_LIMITED',
      message: 'Rate limit exceeded',
    })
  })

  it('hides the message of unexpected errors', () => {
    const normalized = normalizeError(new Error('password authentication failed for user "forge"'))

    expect(normalized).toEqual({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    })
  })

  it('handles non-error throwables', () => {
    expect(normalizeError(undefined).statusCode).toBe(500)
    expect(normalizeError('boom').statusCode).toBe(500)
  })
})

describe('error handler plugin', () => {
  let ctx: TestApp

  beforeEach(async () => {
    ctx = await buildTestApp()
  })

  afterEach(async () => {
    await ctx.app.close()
  })

  it('returns a structured body for thrown errors', async () => {
    ctx.app.get('/boom', { config: { auth: 'public' } }, async () => {
      throw new Error('database exploded at 10.0.0.5')
    })

    const response = await ctx.app.inject({ method: 'GET', url: '/boom' })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        statusCode: 500,
        requestId: expect.any(String),
      },
    })
  })

  it('validates request bodies against the route schema', async () => {
    ctx.app.post(
      '/echo',
      { config: { auth: 'public' }, schema: { body: z.object({ name: z.string().min(1) }) } },
      async (request) => request.body,
    )

    const response = await ctx.app.inject({ method: 'POST', url: '/echo', payload: { name: '' } })

    expect(response.statusCode).toBe(400)
    expect(response.json().error.code).toBe('VALIDATION_ERROR')
  })

  it('returns a structured 404 for unknown routes', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/nope?x=1' })

    expect(response.statusCode).toBe(404)
    expect(response.json().error).toMatchObject({
      code: 'NOT_FOUND',
      message: 'Route GET /nope not found',
    })
  })

  it('supports @fastify/sensible http errors', async () => {
    ctx.app.get('/teapot', { config: { auth: 'public' } }, async () => {
      throw ctx.app.httpErrors.conflict('Already exists')
    })

    const response = await ctx.app.inject({ method: 'GET', url: '/teapot' })

    expect(response.statusCode).toBe(409)
    expect(response.json().error).toMatchObject({ code: 'CONFLICT', message: 'Already exists' })
  })
})
