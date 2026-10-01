import { logger } from './lib/logger'

// BullMQ consumers are registered here in Task 1.4.
logger.info('forge workers process started')

function shutdown(signal: NodeJS.Signals) {
  logger.info({ signal }, 'forge workers process shutting down')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
