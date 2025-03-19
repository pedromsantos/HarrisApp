import { expect, test } from '@playwright/test';

test.describe('LineGenerator Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);
  });

  test('initial render matches snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('line-generator-initial.png', {
      fullPage: true,
      threshold: 0.2, // Allow 20% pixel difference
    });
  });

  test('form with selected patterns matches snapshot', async ({ page }) => {
    // Find a pattern item and click it
    const patternItem = page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.click();

    await expect(page).toHaveScreenshot('line-generator-with-pattern.png', {
      threshold: 0.2, // Allow 20% pixel difference
    });
  });

  test('results display matches snapshot', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Find a pattern item and click it
    const patternItem = page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.click();

    // Click generate button
    await page.locator('button:has-text("Generate Lines")').click();

    // Wait for results
    await page.waitForTimeout(3000);
    await expect(page).toHaveScreenshot('line-generator-results.png');
  });

  test('dark theme matches snapshot', async ({ page }) => {
    // Switch to dark theme
    await page.locator('button[title*="theme"]').click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('line-generator-dark.png', {
      threshold: 0.2, // Allow 20% pixel difference
    });
  });

  test('mobile layout matches snapshot', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('line-generator-mobile.png');
  });

  test('error state matches snapshot', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Force error state
    await page.route('**/api/generate', (route) => route.abort());

    // Find a pattern item and click it
    const patternItem = page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.click();

    // Click generate button
    await page.locator('button:has-text("Generate Lines")').click();

    // Wait for error message
    await page.waitForTimeout(3000);
    await expect(page).toHaveScreenshot('line-generator-error.png');
  });
});
