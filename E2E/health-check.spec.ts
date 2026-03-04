import { expect, test } from '@playwright/test';

test.describe('Playwright Setup Health Check', () => {
  test('Playwright is configured correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const htmlElement = page.locator('html');
    await expect(htmlElement).toBeVisible();
  });

  test('can access test fixtures', async () => {
    const { mockScales, mockPatterns } = await import('./fixtures/mock-data');

    expect(mockScales.fromScale.note).toBe('C4');
    expect(mockScales.toScale.note).toBe('G4');
    expect(mockPatterns.length).toBeGreaterThan(0);
  });
});
