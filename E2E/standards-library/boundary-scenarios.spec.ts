import { expect, test } from '@playwright/test';

/**
 * Boundary Scenarios: Error Handling
 * Tests 404 (invalid standard ID) and 401 (missing API key) error handling
 *
 * Acceptance Criteria:
 * 1. User navigates to /experimental/standards/invalid-standard-name
 * 2. 404 error message: "Standard not found" with "Return to Library" link
 * 3. No broken UI or stack trace visible
 * 4. Unauthenticated API request returns 401 with message: "Missing or invalid API key"
 * 5. Authentication enforced consistently across all endpoints
 */

test.describe('Boundary Scenarios: Error Handling', () => {
  test('displays 404 error with clean UI when navigating to invalid standard', async ({ page }) => {
    // AC1: User navigates to /experimental/standards/invalid-standard-name
    await page.goto('http://localhost:5173/experimental/standards/invalid-standard-name');
    await page.waitForLoadState('networkidle');

    // AC2: 404 error message: "Standard not found" with "Return to Library" link
    const errorMessage = page.locator('text=/Standard not found/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    const returnLink = page.locator('a:has-text("Return to Library")');
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/experimental');

    // AC3: No broken UI or stack trace visible
    const stackTrace = page.locator('text=/Error:|Stack:|at |TypeError:|ReferenceError:/i');
    await expect(stackTrace).not.toBeVisible();

    // Verify the error container has proper styling (not broken layout)
    const errorContainer = errorMessage.locator('..');
    await expect(errorContainer).toHaveCSS('display', /flex|block/);

    // Verify link is clickable and navigates correctly
    await returnLink.click();
    await page.waitForURL('http://localhost:5173/experimental');

    // Should see the standards library page
    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await expect(standardsGrid).toBeVisible({ timeout: 5000 });
  });

  test('returns 401 error when API key is missing or invalid', async ({ page, context }) => {
    // AC4: Unauthenticated API request returns 401
    // Make a direct fetch to the API without authentication using the page context
    const response = await page.evaluate(async () => {
      const res = await fetch('http://localhost:5173/api/jazz-standards', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          // Intentionally omitting X-API-Key header
        },
      });
      return {
        status: res.status,
        body: await res.json().catch(() => ({})),
      };
    });

    // Verify 401 status
    expect(response.status).toBe(401);

    // AC4: Message should be "Missing or invalid API key"
    expect(response.body.error || response.body.message).toMatch(/missing or invalid api key/i);
  });

  test('authentication is enforced consistently across all endpoints', async ({ page }) => {
    // AC5: Test multiple endpoints to ensure consistent authentication
    const endpoints = [
      'http://localhost:5173/api/jazz-standards',
      'http://localhost:5173/api/jazz-standards/autumn-leaves',
    ];

    for (const endpoint of endpoints) {
      const response = await page.evaluate(async (url) => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            // Intentionally omitting X-API-Key header
          },
        });
        return {
          url,
          status: res.status,
          body: await res.json().catch(() => ({})),
        };
      }, endpoint);

      // All endpoints should return 401
      expect(response.status).toBe(401);
      expect(response.body.error || response.body.message).toMatch(/missing or invalid api key/i);
    }
  });
});
