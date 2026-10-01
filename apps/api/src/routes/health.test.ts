import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { buildTestApp, type TestApp } from '../test/helpers'

describe('GET /health', () => {
  let ctx: TestApp

  beforeEach(async () => {
    ctx = await buildTestApp()
  })

  afterEach(async () => {
    await ctx.app.close()
  })

  it('reports ok without authentication when db and redis respond', async () => {
    const response = await ctx.app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ status: 'ok', db: 'ok', redis: 'ok' })
    expect(response.json().version).toMatch(/^\d+\.\d+\.\d+/)
    expect(typeof response.json().uptime).toBe('number')
  })

  it('reports degraded with 503 when the database is down', async () => {
    ctx.prisma.$queryRaw.mockRejectedValue(new Error('connection refused'))

    const response = await ctx.app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(503)
    expect(response.json()).toMatchObject({ status: 'degraded', db: 'error', redis: 'ok' })
  })

  it('reports degraded with 503 when redis is down', async () => {
    ctx.redis.ping.mockRejectedValue(new Error('connection refused'))

    const response = await ctx.app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(503)
    expect(response.json()).toMatchObject({ status: 'degraded', db: 'ok', redis: 'error' })
  })
})
