import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./entrypoints/**/*.{ts,tsx,html}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
