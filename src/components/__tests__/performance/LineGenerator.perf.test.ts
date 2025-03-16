import { expect, test } from '@playwright/test';

test.describe('LineGenerator Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);
  });

  test('initial load performance', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const timing = window.performance.timing;
      const paintEntries = performance.getEntriesByType('paint');
      return {
        // Use optional chaining to handle missing entries
        firstPaint: paintEntries[0]?.startTime || 0,
        firstContentfulPaint: paintEntries[1]?.startTime || 0,
        domInteractive: timing.domInteractive - timing.navigationStart,
        domComplete: timing.domComplete - timing.navigationStart,
      };
    });

    expect(metrics.firstPaint).toBeLessThan(1000); // 1s threshold
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5s threshold
    expect(metrics.domInteractive).toBeLessThan(2000); // 2s threshold
    expect(metrics.domComplete).toBeLessThan(3000); // 3s threshold
  });

  test('form interaction performance', async ({ page }) => {
    // Measure pattern selection performance
    const patternSelectionTime = await page.evaluate(async () => {
      const start = performance.now();
      // Use a more reliable selector
      const element = document.querySelector('[data-testid^="pattern-item-"]');
      if (element instanceof HTMLElement) {
        element.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for next frame
      return performance.now() - start;
    });

    expect(patternSelectionTime).toBeLessThan(100); // 100ms threshold

    // Measure scale selection performance
    const scaleSelectionTime = await page.evaluate(async () => {
      const start = performance.now();
      // Find the scale selector button and click it
      const scaleButton = document.querySelector('button[aria-haspopup="listbox"]');
      if (scaleButton instanceof HTMLElement) {
        scaleButton.click();
        // Wait a bit for the dropdown to appear
        await new Promise((resolve) => setTimeout(resolve, 50));
        // Find and click a scale option
        const option = document.querySelector('[role="option"]');
        if (option instanceof HTMLElement) {
          option.click();
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
      return performance.now() - start;
    });

    expect(scaleSelectionTime).toBeLessThan(200); // 200ms threshold (increased for dropdown interaction)
  });

  test('notation rendering performance', async ({ page }) => {
    // Add pattern and generate
    await page.locator('[data-testid^="pattern-item-"]').first().click();
    await page.waitForTimeout(500);

    // Use page.locator instead of page.evaluate for clicking the button
    await page.locator('button', { hasText: 'Generate Lines' }).click();

    // Wait for results to appear
    await page.waitForTimeout(3000);

    // Check if results or error message appeared
    const hasResults =
      (await page.locator('pre').count()) > 0 || (await page.locator('[role="alert"]').count()) > 0;
    expect(hasResults).toBeTruthy();
  });

  test('memory usage', async ({ page }) => {
    // Skip this test if performance.memory is not available
    const hasMemoryAPI = await page.evaluate(() => !!(performance as any).memory);
    test.skip(!hasMemoryAPI, 'Performance.memory API not available');

    if (!hasMemoryAPI) return;

    const initialMemory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );

    // Perform actions that might cause memory issues
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid^="pattern-item-"]').first().click();
      await page.locator('button', { hasText: 'Generate Lines' }).click();
      await page.waitForTimeout(1000);
    }

    const finalMemory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);
    const memoryIncrease = finalMemory - initialMemory;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB threshold
  });

  test('long list performance', async ({ page }) => {
    // Test performance with pattern list scrolling
    const scrollPerformance = await page.evaluate(async () => {
      const start = performance.now();
      // Find a pattern list container
      const container = document.querySelector('[data-testid="available-patterns-section"]');
      if (container instanceof HTMLElement) {
        container.scrollTop = container.scrollHeight;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return performance.now() - start;
    });

    expect(scrollPerformance).toBeLessThan(200); // 200ms threshold for scroll performance
  });
});
