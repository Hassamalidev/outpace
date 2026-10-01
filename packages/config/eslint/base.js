import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import turbo from 'eslint-config-turbo/flat'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Shared ESLint flat config for every workspace in the monorepo. */
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.output/**',
      '**/.wxt/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...turbo,
  prettier,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
)
