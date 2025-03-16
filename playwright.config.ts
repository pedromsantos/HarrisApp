import { PlaywrightTestConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './E2E',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    toMatchSnapshot: { threshold: 0.2 },
  },
  projects: [
    {
      name: 'E2E Tests',
      testMatch: /.*\.spec\.ts/,
    },
    {
      name: 'Visual Tests',
      testDir: './src/components/__tests__/visual',
      testMatch: /.*\.visual\.test\.tsx/,
      use: {
        screenshot: 'on',
      },
    },
    {
      name: 'Performance Tests',
      testDir: './src/components/__tests__/performance',
      testMatch: /.*\.perf\.test\.ts/,
      use: {
        timezoneId: 'UTC',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['html'], ['json', { outputFile: 'test-results/test-results.json' }]],
};

export default config;
