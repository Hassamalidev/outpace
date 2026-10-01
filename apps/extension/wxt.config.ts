import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  // `pnpm dev` at the repo root should not launch a browser window per run.
  webExt: { disabled: true },
  manifest: {
    name: 'Forge AI',
    description: 'Prospect on LinkedIn, Apollo and company websites straight into Forge AI.',
    permissions: ['storage'],
  },
})
