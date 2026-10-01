import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  clean: true,
  sourcemap: true,
  // Workspace packages ship TypeScript source, so they are bundled into the output.
  noExternal: [/^@forge\//],
})
