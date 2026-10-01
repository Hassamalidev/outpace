import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  CLERK_SECRET_KEY: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),

  AXIOM_TOKEN: z.string().optional(),
  AXIOM_ORG_ID: z.string().optional(),
  AXIOM_DATASET: z.string().default('forge-api'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validates environment variables. Blank values (`KEY=` in a .env file) are
 * treated as unset so optional settings behave the same either way.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const cleaned = Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined && value.trim() !== ''),
  )
  const result = envSchema.safeParse(cleaned)

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid environment configuration — ${problems}`)
  }

  return result.data
}
