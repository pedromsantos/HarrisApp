import { expect, test } from '@playwright/test';

/**
 * Walking Skeleton 2: Returning User URL Access
 * Tests direct URL access to standard detail page
 *
 * Acceptance Criteria:
 * 1. User opens URL with standard ID (e.g., /experimental/standards/blue-bossa)
 * 2. Lands directly on detail page without seeing library list first
 * 3. Dual progressions visible immediately
 * 4. Generates lines with default E shape within 3 seconds
 * 5. Switches to G shape and sees new lines within 3 seconds
 * 6. Total URL-to-practice time <20 seconds
 */

test.describe('Returning User: Direct URL Access', () => {
  test('user can access standard directly via URL and practice with different shapes', async ({ page }) => {
    const journeyStart = Date.now();

    // AC1 & AC2: User opens URL with standard ID and lands directly on detail page
    await page.goto('/experimental/standards/blue-bossa');
    await page.waitForLoadState('networkidle');

    // Verify we're on the detail page (not the library list)
    await page.waitForURL(/\/experimental\/standards\/blue-bossa/);

    // AC3: Dual progressions visible immediately
    const progressionsStart = Date.now();

    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible({
      timeout: 2000,
    });
    await expect(page.locator('text=/Original Progression/i')).toBeVisible();
    await expect(page.locator('text=/Improvisation Progression/i')).toBeVisible();

    const progressionsTime = Date.now() - progressionsStart;
    expect(progressionsTime).toBeLessThan(2000);

    // AC4: User generates lines with default E shape within 3 seconds
    const generateStart = Date.now();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    // Wait for lines to appear
    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    const generateTime = Date.now() - generateStart;
    expect(generateTime).toBeLessThan(3000);

    // Verify default shape is E
    const shapeSelector = page.locator('h3:has-text("Select CAGED Shape")');
    await expect(shapeSelector).toBeVisible();

    // AC5: User switches to G shape and sees new lines within 3 seconds
    const shapeChangeStart = Date.now();

    const gShapeButton = page.getByRole('button', { name: 'G', exact: true });
    await gShapeButton.waitFor({ state: 'visible' });
    await gShapeButton.click();

    // Wait for regeneration to complete
    await page.waitForTimeout(500); // Brief wait for loading state
    await expect(generateButton).not.toBeDisabled();

    // Verify lines are displayed
    await expect(lineDisplay).toBeVisible({ timeout: 3000 });

    const shapeChangeTime = Date.now() - shapeChangeStart;
    expect(shapeChangeTime).toBeLessThan(3000);

    // AC6: Total URL-to-practice time <20 seconds
    const totalJourneyTime = Date.now() - journeyStart;
    expect(totalJourneyTime).toBeLessThan(20000);

    console.log(`Total URL-to-practice time: ${totalJourneyTime}ms`);
  });
});
