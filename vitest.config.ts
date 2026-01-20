/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks',
    isolate: true,
    fileParallelism: false,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: [
      'node_modules',
      '**/node_modules/**',
      'E2E/**',
      '**/*.perf.test.{ts,tsx}',
      '**/*.visual.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'dist/',
        '*.config.{js,ts,cjs}',
        '.eslintrc.cjs',
        'postcss.config.cjs',
        'tailwind.config.cjs',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
