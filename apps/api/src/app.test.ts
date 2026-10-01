import { describe, expect, it } from 'vitest'

import { buildApp } from './app'

describe('GET /health', () => {
  it('reports ok', async () => {
    const app = await buildApp({ logger: false })
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ status: 'ok' })

    await app.close()
  })
})
