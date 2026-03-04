import { expect, test } from '@playwright/test';

/**
 * Smoke Tests for CI/CD Post-Deployment Validation
 * Target execution time: <2 minutes total
 *
 * Critical Tests (9): Must pass for deployment to be considered successful
 * Important Tests (4): Should pass but won't block deployment
 */

test.describe('Smoke Tests: Critical', () => {
  test('frontend application loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify basic structure is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('frontend loads and displays Experimental tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const experimentalLink = page.locator('a:has-text("Experimental")');
    await expect(experimentalLink).toBeVisible({ timeout: 5000 });
  });

  test('standards library page loads with grid', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await expect(standardsGrid).toBeVisible({ timeout: 2000 });

    const standardCards = page.locator('[data-testid="standards-grid"] > article');
    await expect(standardCards).toHaveCount(15, { timeout: 2000 });
  });

  test('standard detail page loads with progressions', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible();
    await expect(page.locator('text=/Original Progression/i')).toBeVisible();
    await expect(page.locator('text=/Improvisation Progression/i')).toBeVisible();
  });

  test('line generation works with default shape', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await expect(lineDisplay).toBeVisible({ timeout: 3000 });

    const shapeSelector = page.locator('h3:has-text("Select CAGED Shape")');
    await expect(shapeSelector).toBeVisible();
  });

  test('shape switching triggers regeneration', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    const aShapeButton = page.getByRole('button', { name: 'A', exact: true });
    await aShapeButton.waitFor({ state: 'visible' });
    await aShapeButton.click();

    await page.waitForTimeout(500);
    await expect(generateButton).not.toBeDisabled({ timeout: 3000 });

    const ariaPressed = await aShapeButton.getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');
  });
});

test.describe('Smoke Tests: Important', () => {
  test('404 error handled gracefully for invalid standard', async ({ page }) => {
    await page.goto('/experimental/standards/nonexistent-standard');
    await page.waitForLoadState('networkidle');

    const notFoundHeading = page.getByRole('heading', { name: '404' });
    await expect(notFoundHeading).toBeVisible({ timeout: 2000 });

    const notFoundText = page.getByText('Standard not found');
    await expect(notFoundText).toBeVisible();
  });

  test('library load failure shows retry option', async ({ page }) => {
    // Intercept and fail the standards API call
    await page.route('**/jazz-standards', (route) => {
      route.abort('failed');
    });

    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const errorMessage = page.locator('text=/unable to load|error|failed/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    const retryButton = page.locator('button:has-text("Retry")');
    await expect(retryButton).toBeVisible();
  });

  test('generation timeout shows appropriate message', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    // Intercept and delay the generation API call
    await page.route('**/barry-harris/generate-instructions', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 6000));
      route.continue();
    });

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    // Should show timeout message after 5 seconds
    const timeoutMessage = page.locator('text=/taking longer|please wait/i');
    await expect(timeoutMessage).toBeVisible({ timeout: 6000 });
  });

  test('keyboard navigation works for accessibility', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();

    // Tab until we reach the first card
    let focused = await firstCard.evaluate((el) => el === document.activeElement);
    let tabCount = 0;
    while (!focused && tabCount < 20) {
      await page.keyboard.press('Tab');
      focused = await firstCard.evaluate((el) => el === document.activeElement);
      tabCount++;
    }

    await expect(firstCard).toBeFocused();

    // Press Enter to navigate
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/experimental\/standards\/.+/, { timeout: 3000 });

    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible();
  });
});

test.describe('Smoke Tests: Performance Validation', () => {
  test('standards library loads in <2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const loadTime = Date.now() - startTime;
    console.log(`Library load time: ${loadTime}ms`);

    expect(loadTime).toBeLessThan(2000);
  });

  test('line generation completes in <3 seconds', async ({ page }) => {
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    const startTime = Date.now();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    const generateTime = Date.now() - startTime;
    console.log(`Generation time: ${generateTime}ms`);

    expect(generateTime).toBeLessThan(3000);
  });
});
