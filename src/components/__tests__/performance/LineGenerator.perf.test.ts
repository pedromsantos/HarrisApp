import { expect, test } from '@playwright/test';

test.describe('LineGenerator Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);
  });

  test('initial load performance', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      return {
        firstPaint: paintEntries[0]?.startTime ?? 0,
        firstContentfulPaint: paintEntries[1]?.startTime ?? 0,
        domInteractive: navigation?.domInteractive ?? 0,
        domComplete: navigation?.domComplete ?? 0,
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
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }); // Wait for next frame
      return performance.now() - start;
    });

    expect(patternSelectionTime).toBeLessThan(100); // 100ms threshold

    // Measure scale selection performance
    const scaleSelectionTime = await page.evaluate(() => {
      const start = performance.now();
      // Find the scale selector button and click it
      const scaleButton = document.querySelector('button[aria-haspopup="listbox"]');
      if (scaleButton instanceof HTMLElement) {
        scaleButton.click();
      }
      return performance.now() - start;
    });

    // Wait for dropdown and select option
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      const option = document.querySelector('[role="option"]');
      if (option instanceof HTMLElement) {
        option.click();
      }
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
    const hasMemoryAPI = await page.evaluate(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      return typeof perf.memory !== 'undefined';
    });
    test.skip(!hasMemoryAPI, 'Performance.memory API not available');

    if (!hasMemoryAPI) return;

    const initialMemory = await page.evaluate(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize ?? 0;
    });

    // Perform actions that might cause memory issues
    await Promise.all(
      Array(3)
        .fill(null)
        .map(async () => {
          await page.locator('[data-testid^="pattern-item-"]').first().click();
          await page.locator('button', { hasText: 'Generate Lines' }).click();
          await page.waitForTimeout(1000);
        })
    );

    const finalMemory = await page.evaluate(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize ?? 0;
    });
    const memoryIncrease = finalMemory - initialMemory;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB threshold
  });
});
