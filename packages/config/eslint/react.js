import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import base from './base.js'

/** ESLint flat config for React code (extension UI, email templates). */
export default tseslint.config(...base, {
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins: { 'react-hooks': reactHooks },
  languageOptions: {
    globals: { ...globals.browser },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
})
