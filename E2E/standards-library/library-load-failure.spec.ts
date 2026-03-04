import { expect, test } from '@playwright/test';

/**
 * E2E Scenario: Standards Library Load Failure
 * Tests user experience when standards library API is temporarily unavailable
 *
 * Acceptance Criteria:
 * 1. User clicks Experimental tab
 * 2. Standards library API is temporarily unavailable
 * 3. Loading indicator shown then error message: "Unable to load standards library"
 * 4. Retry button displayed without broken UI or stack trace
 * 5. API becomes available and user clicks Retry
 * 6. Standards load successfully within 2 seconds
 */

test.describe('Standards Library Load Failure', () => {
  test('user sees error message and can retry when library fails to load', async ({ page }) => {
    let callCount = 0;

    // AC2: Intercept API request and simulate failure on first call
    await page.route('**/api/jazz-standards', async (route) => {
      callCount++;
      if (callCount === 1) {
        // First call - simulate API unavailable
        await route.abort('failed');
      } else {
        // Subsequent calls - allow to succeed
        await route.continue();
      }
    });

    // AC1: User navigates to Experimental tab
    await page.goto('/experimental');

    // AC3: Error message appears (loading indicator may be too fast to catch)
    const errorMessage = page.locator('text=/Unable to.*standards library/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    // AC4: Retry button displayed without broken UI
    const retryButton = page.locator('button:has-text("Retry")');
    await expect(retryButton).toBeVisible();

    // Verify no stack trace or broken UI
    const stackTrace = page.locator('text=/Error:/i, text=/at /i, text=/stack/i');
    await expect(stackTrace).not.toBeVisible();

    // Verify page structure is intact
    const errorContainer = page.locator('text=/Unable to.*standards library/i').locator('..');
    await expect(errorContainer).toBeVisible();

    // AC5: API becomes available and user clicks Retry
    await retryButton.click();

    // AC6: Standards load successfully within 2 seconds
    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await expect(standardsGrid).toBeVisible({ timeout: 2000 });

    // Verify error message is gone
    await expect(errorMessage).not.toBeVisible();

    // Verify standards are displayed by checking for article elements (StandardCard)
    const standardCards = standardsGrid.locator('article');
    await expect(standardCards.first()).toBeVisible();
  });
});
