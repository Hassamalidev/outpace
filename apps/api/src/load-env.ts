import { fileURLToPath } from 'node:url'

import { config } from 'dotenv'

// Side-effect module: import it before anything that reads process.env at load time
// (the Prisma singleton does). Real environment variables always win over .env files,
// and in production the files simply do not exist (Doppler injects the values).
config({
  path: [
    fileURLToPath(new URL('../.env', import.meta.url)),
    fileURLToPath(new URL('../../../.env', import.meta.url)),
  ],
})
