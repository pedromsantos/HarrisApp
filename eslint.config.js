import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'eslint.config.js',
      '.eslintrc.cjs',
      'tailwind.config.cjs',
      'vitest.config.ts',
      'vite.config.ts',
      'E2E/e2e.spec.ts',
      'playwright.config.ts',
      'src/test/setup.ts',
      'server/**/*',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        performance: 'readonly',

        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
          alwaysStrict: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      sonarjs,
      prettier,
    },
    rules: {
      // Error prevention
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
      'no-unused-vars': 'off', // Using TypeScript's version
      'no-undef': 'error',
      'no-param-reassign': 'error',
      'no-shadow': 'off', // Using TypeScript's version
      'no-use-before-define': 'off', // Using TypeScript's version
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'no-await-in-loop': 'error',
      'no-promise-executor-return': 'error',
      'require-atomic-updates': 'error',
      'array-callback-return': 'error',
      'consistent-return': 'error',
      'default-case': 'error',
      'default-case-last': 'error',

      // String rules
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-multi-str': 'error',
      'no-template-curly-in-string': 'error',
      'prefer-template': 'error',
      'no-useless-call': 'error',
      'no-eval': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-useless-return': 'error',
      'prefer-regex-literals': 'error',

      // Import rules
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-relative-parent-imports': 'off',
      'import/no-mutable-exports': 'error',
      'import/no-unused-modules': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      // React rules
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'error',
      'react/jsx-no-bind': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'error',
      'react/no-danger': 'error',
      'react/no-multi-comp': 'off',
      'react/jsx-pascal-case': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'warn', // Downgraded to warn

      // SonarJS rules
      'sonarjs/cognitive-complexity': ['error', 10],
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/no-nested-template-literals': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-duplicate-in-composite': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-extra-arguments': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/non-existent-operator': 'error',
      'sonarjs/prefer-while': 'error',
    },
  }
);
