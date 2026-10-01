export interface PoolOptions {
  /** Maximum connections Prisma opens per process. */
  connectionLimit?: number | undefined
  /** Seconds a query waits for a free connection before failing. */
  poolTimeout?: number | undefined
}

/**
 * Applies connection pooling settings to a Postgres connection string.
 * Values already present on the URL win, so an operator can always override
 * the pool from `DATABASE_URL` itself.
 */
export function buildDatasourceUrl(databaseUrl: string, options: PoolOptions = {}): string {
  const url = new URL(databaseUrl)

  if (options.connectionLimit !== undefined && !url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', String(options.connectionLimit))
  }
  if (options.poolTimeout !== undefined && !url.searchParams.has('pool_timeout')) {
    url.searchParams.set('pool_timeout', String(options.poolTimeout))
  }
  // Supabase's transaction pooler (pgbouncer, port 6543) cannot use prepared statements.
  if (url.port === '6543' && !url.searchParams.has('pgbouncer')) {
    url.searchParams.set('pgbouncer', 'true')
  }

  return url.toString()
}

/** Parses a positive integer env value, returning undefined when unset or invalid. */
export function parsePositiveInt(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}
