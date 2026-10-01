import nextPlugin from '@next/eslint-plugin-next'
import tseslint from 'typescript-eslint'

import react from './react.js'

/** ESLint flat config for the Next.js app. */
export default tseslint.config(...react, {
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins: { '@next/next': nextPlugin },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
})
