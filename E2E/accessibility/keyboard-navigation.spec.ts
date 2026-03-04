import { expect, test } from '@playwright/test';

/**
 * Accessibility: Keyboard Navigation Scenario
 * Tests keyboard-only navigation through the standards library
 *
 * Acceptance Criteria:
 * 1. Keyboard-only user can Tab through standards cards
 * 2. Focus indicators visible on all interactive elements
 * 3. Enter key on focused standard navigates to detail page
 * 4. Tab to Generate Lines button and Enter triggers generation
 * 5. Tab to shape buttons and Enter triggers shape regeneration
 * 6. All interactive elements have ARIA labels
 */

test.describe('Keyboard Navigation: Standards Library', () => {
  test('keyboard-only user can navigate and interact with standards library', async ({ page }) => {
    // Navigate to standards library
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    // AC1: Keyboard-only user can Tab through standards cards
    // AC2: Focus indicators visible on all interactive elements
    await page.keyboard.press('Tab');

    // Focus should be on first interactive element (Experimental tab link if still visible, or first card)
    // Find the first standard card
    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();

    // Tab until we reach the first card (it should have focus indicator)
    let focused = await firstCard.evaluate((el) => el === document.activeElement);
    let tabCount = 0;
    while (!focused && tabCount < 20) {
      await page.keyboard.press('Tab');
      focused = await firstCard.evaluate((el) => el === document.activeElement);
      tabCount++;
    }

    // Verify focus is on first card
    await expect(firstCard).toBeFocused();

    // Verify focus indicator is visible (check for focus-visible or outline styles)
    const hasFocusStyles = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || styles.boxShadow.includes('rgb');
    });
    expect(hasFocusStyles).toBeTruthy();

    // AC6: All interactive elements have ARIA labels
    // Verify first card has accessible name
    const accessibleName = await firstCard.getAttribute('aria-label');
    expect(accessibleName).toBeTruthy();

    // AC3: Enter key on focused standard navigates to detail page
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/experimental\/standards\/.+/, { timeout: 3000 });

    // Verify dual progressions are displayed
    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible();

    // AC4: Tab to Generate Lines button and Enter triggers generation
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });

    // Tab to Generate Lines button
    let generateButtonFocused = await generateButton.evaluate((el) => el === document.activeElement);
    tabCount = 0;
    while (!generateButtonFocused && tabCount < 30) {
      await page.keyboard.press('Tab');
      generateButtonFocused = await generateButton.evaluate((el) => el === document.activeElement);
      tabCount++;
    }

    await expect(generateButton).toBeFocused();

    // Verify button has ARIA label or accessible text
    const buttonText = await generateButton.textContent();
    expect(buttonText).toBeTruthy();

    // Press Enter to trigger generation
    await page.keyboard.press('Enter');

    // Wait for lines to appear
    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // AC5: Tab to shape buttons and Enter triggers shape regeneration
    const shapeSelector = page.locator('h3:has-text("Select CAGED Shape")');
    await expect(shapeSelector).toBeVisible();

    // Find a different shape button (not E which is default)
    const aShapeButton = page.getByRole('button', { name: 'A', exact: true });
    await aShapeButton.waitFor({ state: 'visible' });

    // Tab to A shape button
    let aShapeButtonFocused = await aShapeButton.evaluate((el) => el === document.activeElement);
    tabCount = 0;
    while (!aShapeButtonFocused && tabCount < 20) {
      await page.keyboard.press('Tab');
      aShapeButtonFocused = await aShapeButton.evaluate((el) => el === document.activeElement);
      tabCount++;
    }

    await expect(aShapeButton).toBeFocused();

    // Verify shape button has ARIA attributes
    const ariaPressed = await aShapeButton.getAttribute('aria-pressed');
    expect(ariaPressed).toBeTruthy();

    // Press Enter to change shape
    await page.keyboard.press('Enter');

    // Wait for regeneration to complete
    await page.waitForTimeout(500);
    await expect(generateButton).not.toBeDisabled();

    // Verify shape was changed (A button should now be pressed)
    const aShapePressed = await aShapeButton.getAttribute('aria-pressed');
    expect(aShapePressed).toBe('true');

    console.log('Keyboard navigation test completed successfully');
  });
});
