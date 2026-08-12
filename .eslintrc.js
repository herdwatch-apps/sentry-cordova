module.exports = {
  root: true,
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ['@sentry-internal/sdk'],
  plugins: ['@sentry-internal/sdk'],
  ignorePatterns: [
    'build/**',
    'dist/**',
    'esm/**',
    'sample/**',
    'scripts/**',
    'src/js/Ionic/**',
    '__tests__/**',
    // Pre-existing, unrelated to the Sentry SDK upgrade: danger-js injects `danger`, `message`,
    // `fail`, `markdown`, `schedule` as globals at runtime (via `npx danger ci`, see
    // .github/workflows/danger.yml). ESLint has no way to know about them statically, and this repo
    // has never declared them, so `dangerfile.js` has always failed `no-undef` -- just never
    // noticed because no CI workflow runs `yarn lint`. Excluded the same way `scripts/**` (also
    // tool-runtime code, not application source) already is.
    'dangerfile.js',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['src/js/__tests__/**'],
      rules: {
        'jsdoc/require-jsdoc': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
      },
    },
  ],
  rules: {
    '@sentry-internal/sdk/no-async-await': 'off',
    '@sentry-internal/sdk/no-optional-chaining': 'off',
    '@sentry-internal/sdk/no-nullish-coalescing': 'off',
    '@sentry-internal/sdk/no-class-field-initializers': 'off',
    '@sentry-internal/sdk/no-unsupported-es6-methods' : 'off',
  }
};
