import { expect, test } from '@playwright/test';

/**
 * E2E Scenario: Shape Exploration Across Standards
 * Tests user exploring multiple CAGED shapes across different standards
 *
 * Acceptance Criteria:
 * 1. User explores all 5 shapes (C, A, G, E, D) for Autumn Leaves
 * 2. Each shape switch completes within 3 seconds
 * 3. User completes 5 shape switches in <20 seconds total
 * 4. User returns to library and selects Blue Bossa
 * 5. User explores A and G shapes for Blue Bossa
 * 6. Total time for 2 standards with multiple shapes <2 minutes
 */

test.describe('Shape Exploration Across Standards', () => {
  test('user can explore all 5 CAGED shapes for Autumn Leaves and multiple shapes for Blue Bossa', async ({ page }) => {
    const scenarioStart = Date.now();

    // Navigate to Autumn Leaves
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const autumnLeavesCard = page.locator('text="Autumn Leaves"').first();
    await autumnLeavesCard.waitFor({ state: 'visible' });
    await autumnLeavesCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/experimental\/standards\/.+/);

    // Generate lines with default E shape
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    // Wait for initial lines to appear
    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // AC1 & AC2: Explore all 5 shapes (C, A, G, E, D) within 3 seconds each
    const shapesExplorationStart = Date.now();
    const shapes = ['C', 'A', 'G', 'E', 'D'];

    for (const shape of shapes) {
      const shapeStart = Date.now();

      const shapeButton = page.getByRole('button', { name: shape, exact: true });
      await shapeButton.waitFor({ state: 'visible' });
      await shapeButton.click();

      // Wait for regeneration to complete
      await page.waitForTimeout(500); // Brief wait for loading state
      await expect(generateButton).not.toBeDisabled();

      // Verify lines are displayed
      await expect(lineDisplay).toBeVisible({ timeout: 3000 });

      const shapeTime = Date.now() - shapeStart;
      expect(shapeTime).toBeLessThan(3000);

      console.log(`${shape} shape switch time: ${shapeTime}ms`);
    }

    // AC3: All 5 shape switches completed in <20 seconds
    const totalShapesTime = Date.now() - shapesExplorationStart;
    expect(totalShapesTime).toBeLessThan(20000);
    console.log(`Total shapes exploration time (Autumn Leaves): ${totalShapesTime}ms`);

    // AC4: Return to library and select Blue Bossa
    // Click the Experimental tab to return to the standards library
    const experimentalLink = page.locator('a:has-text("Experimental")');
    await experimentalLink.waitFor({ state: 'visible' });
    await experimentalLink.click();

    // Wait for library to load
    await page.waitForURL('/experimental');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const blueBossaCard = page.locator('text="Blue Bossa"').first();
    await blueBossaCard.waitFor({ state: 'visible' });
    await blueBossaCard.click();

    // Wait for navigation to Blue Bossa detail page
    await page.waitForURL(/\/experimental\/standards\/.+/);

    // Generate lines for Blue Bossa
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // AC5: Explore A and G shapes for Blue Bossa
    const blueBossaShapes = ['A', 'G'];

    for (const shape of blueBossaShapes) {
      const shapeStart = Date.now();

      const shapeButton = page.getByRole('button', { name: shape, exact: true });
      await shapeButton.waitFor({ state: 'visible' });
      await shapeButton.click();

      // Wait for regeneration to complete
      await page.waitForTimeout(500); // Brief wait for loading state
      await expect(generateButton).not.toBeDisabled();

      // Verify lines are displayed
      await expect(lineDisplay).toBeVisible({ timeout: 3000 });

      const shapeTime = Date.now() - shapeStart;
      expect(shapeTime).toBeLessThan(3000);

      console.log(`Blue Bossa ${shape} shape switch time: ${shapeTime}ms`);
    }

    // AC6: Total time for 2 standards with multiple shapes <2 minutes
    const totalScenarioTime = Date.now() - scenarioStart;
    expect(totalScenarioTime).toBeLessThan(120000);

    console.log(`Total scenario time (2 standards, 7 shapes): ${totalScenarioTime}ms`);
  });
});
