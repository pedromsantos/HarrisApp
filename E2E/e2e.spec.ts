import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://harrisjazzlines.com//');

  await expect(page).toHaveTitle(/Barry Harris Line generation App/);
});
