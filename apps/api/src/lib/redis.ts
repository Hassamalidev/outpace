import { Redis, type RedisOptions } from 'ioredis'

const MAX_RETRY_DELAY_MS = 5_000

/** Reconnect backoff: 200ms, 400ms, ... capped at 5s. Never gives up. */
export function retryStrategy(attempt: number): number {
  return Math.min(attempt * 200, MAX_RETRY_DELAY_MS)
}

/** Reconnect when a failover leaves us talking to a read-only replica. */
export function reconnectOnError(error: Error): boolean {
  return error.message.includes('READONLY')
}

export function createRedis(url: string, options: RedisOptions = {}): Redis {
  return new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy,
    reconnectOnError,
    ...options,
  })
}

let singleton: Redis | undefined

/** Process-wide Redis connection, created on first use. */
export function getRedis(url: string): Redis {
  singleton ??= createRedis(url)
  return singleton
}

export async function closeRedis(): Promise<void> {
  if (!singleton) return
  const client = singleton
  singleton = undefined
  // quit() rejects when the connection never opened; disconnect() always works.
  await client.quit().catch(() => client.disconnect())
}
