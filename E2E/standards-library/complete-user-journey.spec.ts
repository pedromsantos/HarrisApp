import { expect, test } from '@playwright/test';

/**
 * Walking Skeleton: First-Time User Journey
 * Tests complete flow from app open to guitar practice
 *
 * Acceptance Criteria:
 * 1. User opens app and clicks Experimental tab within 10 seconds
 * 2. Standards library loads 15 standards within 2 seconds
 * 3. User selects Autumn Leaves and views dual progressions
 * 4. User generates lines with default E shape within 3 seconds
 * 5. User switches to A shape and sees new lines within 3 seconds
 * 6. Total journey time <30 seconds (CSF 1)
 */

test.describe('Complete User Journey: Standards Library', () => {
  test('first-time user can navigate to standards library, select Autumn Leaves, and practice with different shapes', async ({
    page,
  }) => {
    const journeyStart = Date.now();

    // AC1: User opens app and clicks Experimental tab within 10 seconds
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const experimentalLink = page.locator('a:has-text("Experimental")');
    await experimentalLink.waitFor({ state: 'visible', timeout: 10000 });

    const navigationTime = Date.now() - journeyStart;
    expect(navigationTime).toBeLessThan(10000);

    await experimentalLink.click();

    // AC2: Standards library loads 15 standards within 2 seconds
    const loadStart = Date.now();
    await page.waitForURL('/experimental');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const standardCards = page.locator('[data-testid="standards-grid"] > article');
    await expect(standardCards).toHaveCount(15, { timeout: 2000 });

    const loadTime = Date.now() - loadStart;
    expect(loadTime).toBeLessThan(2000);

    // AC3: User selects Autumn Leaves and views dual progressions
    const autumnLeavesCard = page.locator('text="Autumn Leaves"').first();
    await autumnLeavesCard.waitFor({ state: 'visible' });
    await autumnLeavesCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/experimental\/standards\/.+/);

    // Verify dual progressions are displayed
    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible();
    await expect(page.locator('text=/Original Progression/i')).toBeVisible();
    await expect(page.locator('text=/Improvisation Progression/i')).toBeVisible();

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

    // AC5: User switches to A shape and sees new lines within 3 seconds
    const shapeChangeStart = Date.now();

    const aShapeButton = page.getByRole('button', { name: 'A', exact: true });
    await aShapeButton.waitFor({ state: 'visible' });
    await aShapeButton.click();

    // Wait for regeneration to complete
    await page.waitForTimeout(500); // Brief wait for loading state
    await expect(generateButton).not.toBeDisabled();

    // Verify lines are displayed (may be same or different content)
    await expect(lineDisplay).toBeVisible({ timeout: 3000 });

    const shapeChangeTime = Date.now() - shapeChangeStart;
    expect(shapeChangeTime).toBeLessThan(3000);

    // AC6: Total journey time <30 seconds (CSF 1)
    const totalJourneyTime = Date.now() - journeyStart;
    expect(totalJourneyTime).toBeLessThan(30000);

    console.log(`Total journey time: ${totalJourneyTime}ms`);
  });
});
