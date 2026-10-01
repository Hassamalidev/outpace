import { describe, expect, it, vi } from 'vitest'

import { cached } from './cache'
import { createRedis, reconnectOnError, retryStrategy } from './redis'

describe('redis retry logic', () => {
  it('backs off linearly and caps at five seconds', () => {
    expect(retryStrategy(1)).toBe(200)
    expect(retryStrategy(5)).toBe(1000)
    expect(retryStrategy(1000)).toBe(5000)
  })

  it('reconnects only on READONLY errors', () => {
    expect(
      reconnectOnError(new Error('READONLY You can not write against a read only replica')),
    ).toBe(true)
    expect(reconnectOnError(new Error('ERR unknown command'))).toBe(false)
  })

  it('creates a lazy client that does not connect until used', () => {
    const client = createRedis('redis://localhost:6399')

    expect(client.status).toBe('wait')
    client.disconnect()
  })
})

describe('cached', () => {
  it('returns the cached value without computing', async () => {
    const redis = { get: vi.fn().mockResolvedValue('{"n":1}'), set: vi.fn() }
    const compute = vi.fn()

    await expect(cached(redis, 'k', 60, compute)).resolves.toEqual({ n: 1 })
    expect(compute).not.toHaveBeenCalled()
  })

  it('computes and stores on a miss', async () => {
    const redis = { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue('OK') }

    await expect(cached(redis, 'k', 60, async () => ({ n: 2 }))).resolves.toEqual({ n: 2 })
    expect(redis.set).toHaveBeenCalledWith('k', '{"n":2}', 'EX', 60)
  })

  it('does not cache null results', async () => {
    const redis = { get: vi.fn().mockResolvedValue(null), set: vi.fn() }

    await expect(cached(redis, 'k', 60, async () => null)).resolves.toBeNull()
    expect(redis.set).not.toHaveBeenCalled()
  })

  it('falls back to computing when redis is unavailable', async () => {
    const redis = {
      get: vi.fn().mockRejectedValue(new Error('down')),
      set: vi.fn().mockRejectedValue(new Error('down')),
    }

    await expect(cached(redis, 'k', 60, async () => 'value')).resolves.toBe('value')
  })
})
