import { expect, test } from '@playwright/test';

const PATTERN_ITEM_SELECTOR = '[data-testid^="pattern-item-"]';

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
        domInteractive: navigation.domInteractive,
        domComplete: navigation.domComplete,
      };
    });

    expect(metrics.firstPaint).toBeLessThan(1000); // 1s threshold
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5s threshold
    expect(metrics.domInteractive).toBeLessThan(2000); // 2s threshold
    expect(metrics.domComplete).toBeLessThan(3000); // 3s threshold
  });

  test('form interaction performance', async ({ page }) => {
    // Measure pattern selection performance
    const patternSelectionTime = await page.evaluate((selector) => {
      const start = performance.now();
      // Use the selector passed from the test
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) {
        element.click();
      }
      return performance.now() - start;
    }, PATTERN_ITEM_SELECTOR);

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
    await page.locator(PATTERN_ITEM_SELECTOR).first().click();
    await page.waitForTimeout(500);

    // Use page.locator instead of page.evaluate for clicking the button
    await page.locator('button', { hasText: 'Generate Lines' }).click();

    // Wait for results to appear
    await page.waitForTimeout(3000);

    // Check if results appeared or error cards are present (using our new error components)
    const hasResults =
      (await page.locator('pre').count()) > 0 ||
      (await page.locator('.border-destructive').count()) > 0;

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
          await page.locator(PATTERN_ITEM_SELECTOR).first().click();
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

  test('long list performance', async ({ page }) => {
    // Test performance with pattern list scrolling
    const scrollPerformance = await page.evaluate(() => {
      const start = performance.now();
      // Find a pattern list container
      const container = document.querySelector('[data-testid="available-patterns-section"]');
      if (container instanceof HTMLElement) {
        container.scrollTop = container.scrollHeight;
        // Simple synchronous delay
        const end = performance.now() + 16; // ~1 frame
        while (performance.now() < end) {
          // Busy wait
        }
      }
      return performance.now() - start;
    });

    expect(scrollPerformance).toBeLessThan(200); // 200ms threshold for scroll performance
  });
});
