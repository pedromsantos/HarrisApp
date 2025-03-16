import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://harrisjazzlines.com/';

test.describe('Harris Jazz Lines App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Barry Harris Line generation App/);
  });

  test('loads initial UI components correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Barry Harris Line Generator');
    await expect(page.locator('button:has-text("Generate Lines")')).toBeDisabled();

    await expect(page.locator('text=From Scale')).toBeVisible();
    await expect(page.locator('text=To Scale')).toBeVisible();

    await expect(page.locator('text=Guitar Position')).toBeVisible();

    await expect(page.locator('text=Available Patterns')).toBeVisible();
    await expect(page.locator('text=Selected Patterns')).toBeVisible();

    await expect(
      page.locator('text=Select your parameters and click "Generate Lines"')
    ).toBeVisible();
  });

  test('can select a pattern', async ({ page }) => {
    const patternItem = await page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.waitFor({ state: 'visible' });
    await patternItem.click();

    const selectedPatternsSection = await page.locator('[data-testid="selected-patterns-section"]');
    await expect(selectedPatternsSection.locator('[data-testid^="pattern-item-"]')).toHaveCount(1);

    await expect(page.locator('button:has-text("Generate Lines")')).toBeEnabled();
  });

  test('can generate lines', async ({ page }) => {
    const patternItem = await page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.waitFor({ state: 'visible' });
    await patternItem.click();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await expect(generateButton).toBeEnabled();

    // Click the generate button
    await generateButton.click();

    // Wait for the pre element to be visible with a more generous timeout
    await page.locator('pre').first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('pre').first()).toBeVisible();
  });

  test('can toggle dark theme', async ({ page }) => {
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    const themeButton = page.locator('button[title*="theme"]');
    await themeButton.waitFor({ state: 'visible' });
    await themeButton.click();

    await expect(page.locator('html')).toHaveClass(/dark/);

    await themeButton.click();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('can change scales', async ({ page }) => {
    const fromScaleNoteButton = page.locator(
      '[data-testid="from-scale-section"] button[aria-label="Select note"]'
    );
    await fromScaleNoteButton.waitFor({ state: 'visible' });
    await fromScaleNoteButton.click();

    await page.locator('[role="listbox"]').waitFor({ state: 'visible' });
    await page.locator('[role="option"]').filter({ hasText: 'C4' }).first().click();

    const fromScaleTypeButton = page.locator(
      '[data-testid="from-scale-section"] button[aria-label="Select scale"]'
    );
    await fromScaleTypeButton.waitFor({ state: 'visible' });
    await fromScaleTypeButton.click();

    await page.locator('[role="listbox"]').waitFor({ state: 'visible' });
    await page.locator('[role="option"]').filter({ hasText: 'Major' }).first().click();

    const toScaleNoteButton = page.locator(
      '[data-testid="to-scale-section"] button[aria-label="Select note"]'
    );
    await toScaleNoteButton.waitFor({ state: 'visible' });
    await toScaleNoteButton.click();

    await page.locator('[role="listbox"]').waitFor({ state: 'visible' });
    await page.locator('[role="option"]').filter({ hasText: 'G4' }).first().click();

    const toScaleTypeButton = page.locator(
      '[data-testid="to-scale-section"] button[aria-label="Select scale"]'
    );
    await toScaleTypeButton.waitFor({ state: 'visible' });
    await toScaleTypeButton.click();

    await page.locator('[role="listbox"]').waitFor({ state: 'visible' });
    await page.locator('[role="option"]').filter({ hasText: 'Major' }).first().click();
  });

  test('can change position', async ({ page }) => {
    const positionInput = await page.locator('input[type="number"]');
    await positionInput.waitFor({ state: 'visible' });

    await positionInput.clear();
    await positionInput.fill('7');

    await expect(positionInput).toHaveValue('7');
  });

  test('can reorder patterns', async ({ page }) => {
    const patternItems = await page.locator('[data-testid^="pattern-item-"]').all();

    await patternItems[0].waitFor({ state: 'visible' });
    await patternItems[0].click();

    await patternItems[1].waitFor({ state: 'visible' });
    await patternItems[1].click();

    const selectedPatternsSection = await page.locator('[data-testid="selected-patterns-section"]');
    await selectedPatternsSection.waitFor({ state: 'visible' });

    await expect(selectedPatternsSection.locator('[data-testid^="pattern-item-"]')).toHaveCount(2);

    const selectedPatterns = await selectedPatternsSection
      .locator('[data-testid^="pattern-item-"]')
      .all();

    expect(selectedPatterns.length).toBe(2);

    const firstPatternText = await selectedPatterns[0].textContent();

    const downButton = selectedPatternsSection
      .locator('button svg path[d*="M19 9l-7 7-7-7"]')
      .first();
    await downButton.waitFor({ state: 'visible' });
    await downButton.click();

    await page.waitForFunction(() => {
      const items = document.querySelectorAll('[data-testid^="pattern-item-"]');
      return items.length >= 2;
    });

    const updatedSelectedPatterns = await selectedPatternsSection
      .locator('[data-testid^="pattern-item-"]')
      .all();

    const newSecondPatternText = await updatedSelectedPatterns[1].textContent();

    expect(firstPatternText).toBe(newSecondPatternText);
  });

  test('can remove patterns', async ({ page }) => {
    const patternItem = await page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.waitFor({ state: 'visible' });
    await patternItem.click();

    const selectedPatternsSection = await page.locator('[data-testid="selected-patterns-section"]');
    await selectedPatternsSection.waitFor({ state: 'visible' });

    await expect(selectedPatternsSection.locator('[data-testid^="pattern-item-"]')).toHaveCount(1);

    const removeButton = selectedPatternsSection.locator(
      'button svg path[d*="M6 18L18 6M6 6l12 12"]'
    );
    await removeButton.waitFor({ state: 'visible' });
    await removeButton.click();

    await expect(selectedPatternsSection.locator('text=No patterns selected')).toBeVisible();
  });

  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for the page to adjust to the new viewport size
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Barry Harris Line Generator');

    const patternItem = await page.locator('[data-testid^="pattern-item-"]').first();
    await patternItem.waitFor({ state: 'visible' });
    await patternItem.click();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await expect(generateButton).toBeEnabled();

    // Click the generate button
    await generateButton.click();

    // Wait for the pre element to be visible with a more generous timeout
    await page.locator('pre').first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('pre').first()).toBeVisible();
  });
});
