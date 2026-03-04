import { expect, test } from '@playwright/test';

/**
 * E2E Scenario: Rate Limit Handling
 * Tests user experience when exceeding API rate limits
 *
 * Acceptance Criteria:
 * 1. User explores shapes rapidly (25 requests in 1 minute)
 * 2. First 20 requests succeed with 200 OK
 * 3. 21st request returns 429 Too Many Requests
 * 4. Error message: "You're exploring shapes too quickly. Please wait 60 seconds"
 * 5. Countdown timer shows seconds remaining
 * 6. After 60 seconds, user can continue exploring shapes
 */

test.describe('Rate Limit Handling', () => {
  test('user sees rate limit message with countdown when exceeding API limits', async ({ page }) => {
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

    // Intercept API requests to simulate rate limiting
    let requestCount = 0;
    await page.route('**/api/barry-harris/generate-instructions', async (route) => {
      requestCount++;

      // AC2: First 20 requests succeed
      if (requestCount <= 20) {
        await route.continue();
      } else {
        // AC3: 21st request returns 429
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Rate limit exceeded',
            message:
              'You have exceeded the rate limit of 20 requests per minute. Please wait 60 seconds before trying again.',
            retry_after: 60,
            endpoint: '/barry-harris/generate-instructions',
          }),
        });
      }
    });

    // AC1: User explores shapes rapidly - click through multiple shapes
    const shapes = ['C', 'A', 'G', 'E', 'D'];
    const generateButton = page.locator('button:has-text("Generate Lines")');

    // Generate initial lines
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    // Wait for initial lines to appear
    await page.locator('.rounded-lg.border.border-gray-300').first().waitFor({ state: 'visible', timeout: 3000 });

    // Make requests until rate limit is hit
    for (let i = 0; i < 25; i++) {
      const shapeIndex = i % shapes.length;
      const shapeButton = page.getByRole('button', { name: shapes[shapeIndex], exact: true });

      await shapeButton.waitFor({ state: 'visible' });
      await shapeButton.click();

      // Wait briefly for shape change
      await page.waitForTimeout(100);

      // If we haven't hit rate limit yet, continue
      if (i < 20) {
        // Request should succeed
        continue;
      } else {
        // AC4: Error message appears with friendly text
        const errorMessage = page.locator('text=/You.*re exploring shapes too quickly.*Please wait.*seconds?/');
        await expect(errorMessage).toBeVisible({ timeout: 2000 });

        // AC5: Countdown timer shows seconds remaining
        const countdownTimer = page.locator('[data-testid="rate-limit-countdown"]');
        await expect(countdownTimer).toBeVisible();

        // Verify countdown is showing a number between 1 and 60
        const countdownText = await countdownTimer.textContent();
        const secondsRemaining = parseInt(countdownText || '0');
        expect(secondsRemaining).toBeGreaterThan(0);
        expect(secondsRemaining).toBeLessThanOrEqual(60);

        break;
      }
    }

    // Verify rate limit message persists
    const errorMessage = page.locator('text=/You.*re exploring shapes too quickly.*Please wait.*seconds?/');
    await expect(errorMessage).toBeVisible();

    // AC6: Verify countdown updates (wait 2 seconds and check it decreased)
    const countdownTimer = page.locator('[data-testid="rate-limit-countdown"]');
    const initialCountdown = await countdownTimer.textContent();
    const initialSeconds = parseInt(initialCountdown || '60');

    await page.waitForTimeout(2000);

    const updatedCountdown = await countdownTimer.textContent();
    const updatedSeconds = parseInt(updatedCountdown || '60');

    // Countdown should have decreased by approximately 2 seconds
    expect(updatedSeconds).toBeLessThan(initialSeconds);
    expect(initialSeconds - updatedSeconds).toBeGreaterThanOrEqual(1);
    expect(initialSeconds - updatedSeconds).toBeLessThanOrEqual(3);
  });
});
