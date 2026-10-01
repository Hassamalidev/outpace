import { describe, expect, it } from 'vitest'

import { buildDatasourceUrl, parsePositiveInt } from './datasource'

describe('buildDatasourceUrl', () => {
  const base = 'postgresql://user:pass@db.example.com:5432/forge'

  it('leaves the url untouched when no pool options are given', () => {
    expect(buildDatasourceUrl(base)).toBe(base)
  })

  it('adds connection_limit and pool_timeout', () => {
    const url = new URL(buildDatasourceUrl(base, { connectionLimit: 10, poolTimeout: 20 }))

    expect(url.searchParams.get('connection_limit')).toBe('10')
    expect(url.searchParams.get('pool_timeout')).toBe('20')
  })

  it('keeps pool settings already present on the url', () => {
    const url = new URL(
      buildDatasourceUrl(`${base}?connection_limit=3`, { connectionLimit: 10, poolTimeout: 20 }),
    )

    expect(url.searchParams.get('connection_limit')).toBe('3')
    expect(url.searchParams.get('pool_timeout')).toBe('20')
  })

  it('enables pgbouncer mode on the supabase transaction pooler port', () => {
    const url = new URL(buildDatasourceUrl('postgresql://user:pass@pooler.example.com:6543/forge'))

    expect(url.searchParams.get('pgbouncer')).toBe('true')
  })

  it('does not enable pgbouncer mode on a direct connection', () => {
    expect(new URL(buildDatasourceUrl(base)).searchParams.has('pgbouncer')).toBe(false)
  })
})

describe('parsePositiveInt', () => {
  it('parses positive integers', () => {
    expect(parsePositiveInt('10')).toBe(10)
  })

  it.each([undefined, '', '  ', '0', '-4', '2.5', 'abc'])('rejects %j', (value) => {
    expect(parsePositiveInt(value)).toBeUndefined()
  })
})
