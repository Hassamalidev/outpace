import Fastify, { type FastifyInstance } from 'fastify'

export interface BuildAppOptions {
  logger?: boolean
}

/** Builds the Fastify instance without binding a port, so tests can use `app.inject()`. */
export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? true })

  app.get('/health', async () => ({ status: 'ok', uptime: process.uptime() }))

  return app
}
