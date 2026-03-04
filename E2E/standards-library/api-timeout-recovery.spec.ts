import { expect, test } from '@playwright/test';

/**
 * E2E Scenario: API Timeout Recovery
 * Tests user experience when API experiences high latency (>5 seconds)
 *
 * Acceptance Criteria:
 * 1. User generates lines for a standard
 * 2. API experiences high latency (>5 seconds)
 * 3. Timeout message appears: "Generation is taking longer than expected"
 * 4. Retry button displayed with loading indicator still visible
 * 5. User clicks Retry and API responds successfully within 3 seconds
 * 6. Context preserved (standard and shape not lost)
 */

test.describe('API Timeout Recovery', () => {
  test('user sees timeout message and can retry when API is slow', async ({ page }) => {
    // Navigate to a standard detail page (Autumn Leaves)
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const autumnLeavesCard = page.locator('text="Autumn Leaves"').first();
    await autumnLeavesCard.waitFor({ state: 'visible' });
    await autumnLeavesCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/experimental\/standards\/.+/);

    // AC1: User generates lines
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });

    // AC2: Intercept API request and delay response to simulate timeout (>5 seconds)
    let callCount = 0;
    await page.route('**/api/barry-harris/generate-instructions', async (route) => {
      callCount++;
      if (callCount === 1) {
        // First call - add delay
        await new Promise((resolve) => setTimeout(resolve, 6000));
      }
      // Then fulfill with success response
      await route.continue();
    });

    await generateButton.click();

    // AC3: Timeout message appears after 5 seconds
    const timeoutMessage = page.locator('text="Generation is taking longer than expected"');
    await expect(timeoutMessage).toBeVisible({ timeout: 6000 });

    // AC4: Retry button displayed with loading indicator still visible
    const retryButton = page.locator('button:has-text("Retry")');
    await expect(retryButton).toBeVisible();

    // Loading indicator should still be visible
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    await expect(loadingIndicator).toBeVisible();

    // AC5: User clicks Retry and API responds successfully
    // Second call will not have delay
    await retryButton.click();

    // Wait for lines to appear (should be fast now)
    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await expect(lineDisplay).toBeVisible({ timeout: 3000 });

    // Timeout message should disappear
    await expect(timeoutMessage).not.toBeVisible();

    // AC6: Context preserved - verify we're still on the same standard
    await expect(page).toHaveURL(/autumn-leaves/);

    // Verify shape selector is visible (context preserved)
    const shapeSelector = page.locator('[data-testid="shape-selector"]');
    await expect(shapeSelector).toBeVisible();
  });
});

// Second test removed for now - will add in next iteration after validating basic timeout functionality
