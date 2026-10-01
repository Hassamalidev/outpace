import type { Redis } from 'ioredis'

/**
 * Read-through JSON cache. Redis failures never fail the request: on any cache
 * error we fall back to computing the value.
 */
export async function cached<T>(
  redis: Pick<Redis, 'get' | 'set'>,
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>,
): Promise<T> {
  try {
    const hit = await redis.get(key)
    if (hit !== null) return JSON.parse(hit) as T
  } catch {
    return compute()
  }

  const value = await compute()

  if (value !== undefined && value !== null) {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
    } catch {
      // Cache write failures are not worth failing the request for.
    }
  }

  return value
}
