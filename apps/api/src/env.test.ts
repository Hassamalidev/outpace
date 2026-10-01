import { describe, expect, it } from 'vitest'

import { parseEnv } from './env'

describe('parseEnv', () => {
  it('applies defaults', () => {
    const env = parseEnv({})

    expect(env.PORT).toBe(3001)
    expect(env.NODE_ENV).toBe('development')
    expect(env.REDIS_URL).toBe('redis://localhost:6379')
  })

  it('treats blank values as unset', () => {
    const env = parseEnv({ CLERK_SECRET_KEY: '', AXIOM_TOKEN: '   ', PORT: '' })

    expect(env.CLERK_SECRET_KEY).toBeUndefined()
    expect(env.AXIOM_TOKEN).toBeUndefined()
    expect(env.PORT).toBe(3001)
  })

  it('coerces numeric values', () => {
    expect(parseEnv({ PORT: '8080' }).PORT).toBe(8080)
  })

  it('throws a readable error naming the invalid variable', () => {
    expect(() => parseEnv({ PORT: 'not-a-port' })).toThrow(/PORT/)
    expect(() => parseEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/)
  })
})
