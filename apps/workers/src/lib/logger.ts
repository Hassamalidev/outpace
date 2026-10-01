import { pino } from 'pino'

export const logger = pino({
  name: 'forge-workers',
  level: process.env.LOG_LEVEL ?? 'info',
})
