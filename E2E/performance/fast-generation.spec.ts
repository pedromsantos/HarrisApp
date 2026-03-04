import { expect, test } from '@playwright/test';

/**
 * Performance Benchmark: CSF 2 - Fast Generation
 * Validates that line generation completes in <3 seconds at p95
 *
 * Critical Success Factor 2: Line generation feels instant (<3 seconds p95)
 *
 * Acceptance Criteria:
 * - Individual generation requests complete in <3 seconds
 * - p95 latency <3 seconds across 100 requests
 * - No timeouts or errors during generation
 * - CSF target met in >95% of test runs
 */

test.describe('Performance: Fast Generation (CSF 2)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a standard detail page
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);
  });

  test('single generation completes in <3 seconds', async ({ page }) => {
    const generateStart = Date.now();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    const generateTime = Date.now() - generateStart;
    console.log(`Generation time: ${generateTime}ms`);

    expect(generateTime).toBeLessThan(3000);

    console.log(
      JSON.stringify({
        test: 'fast-generation-single',
        csf: 'CSF-2',
        target: 3000,
        actual: generateTime,
        passed: generateTime < 3000,
      })
    );
  });

  test('p95 latency <3 seconds across 100 requests', async ({ page }) => {
    const results: number[] = [];
    const targetRequests = 100;
    const shapes: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'E', 'D'];

    // First generation to initialize
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // Wait for shape selector to appear
    await page.waitForTimeout(500);

    // Run 100 shape switches to measure API latency
    for (let i = 0; i < targetRequests; i++) {
      const shape = shapes[i % shapes.length];
      const shapeButton = page.getByRole('button', { name: shape, exact: true });

      const startTime = Date.now();

      await shapeButton.click();

      // Wait for button to be enabled again (generation complete)
      await expect(generateButton).not.toBeDisabled({ timeout: 5000 });

      const generateTime = Date.now() - startTime;
      results.push(generateTime);

      if ((i + 1) % 10 === 0) {
        console.log(`Completed ${i + 1}/${targetRequests} requests`);
      }

      // Brief pause between requests
      await page.waitForTimeout(100);
    }

    // Calculate statistics
    const sortedResults = [...results].sort((a, b) => a - b);
    const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
    const p50Time = sortedResults[Math.floor(results.length * 0.5)];
    const p95Time = sortedResults[Math.floor(results.length * 0.95)];
    const p99Time = sortedResults[Math.floor(results.length * 0.99)];
    const maxTime = sortedResults[sortedResults.length - 1];

    const passedRequests = results.filter((time) => time < 3000).length;
    const passRate = passedRequests / targetRequests;

    console.log(
      JSON.stringify({
        test: 'fast-generation-p95',
        csf: 'CSF-2',
        target: 3000,
        requests: targetRequests,
        passed: passedRequests,
        passRate: passRate,
        avgTime: Math.round(avgTime),
        p50Time: p50Time,
        p95Time: p95Time,
        p99Time: p99Time,
        maxTime: maxTime,
      })
    );

    // Verify p95 <3 seconds
    expect(p95Time).toBeLessThan(3000);

    // Verify >95% pass rate
    expect(passRate).toBeGreaterThanOrEqual(0.95);
  });

  test('no timeouts or errors during generation', async ({ page }) => {
    const shapes: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'E', 'D'];
    let errorCount = 0;
    let timeoutCount = 0;

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorCount++;
        console.error('Browser error:', msg.text());
      }
    });

    // First generation
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // Test 20 shape switches
    for (let i = 0; i < 20; i++) {
      const shape = shapes[i % shapes.length];
      const shapeButton = page.getByRole('button', { name: shape, exact: true });

      try {
        await shapeButton.click();
        await expect(generateButton).not.toBeDisabled({ timeout: 5000 });
      } catch (error) {
        timeoutCount++;
        console.error(`Timeout on request ${i + 1}:`, error);
      }

      await page.waitForTimeout(100);
    }

    console.log(
      JSON.stringify({
        test: 'fast-generation-reliability',
        csf: 'CSF-2',
        requests: 20,
        errors: errorCount,
        timeouts: timeoutCount,
        reliability: (20 - errorCount - timeoutCount) / 20,
      })
    );

    // Verify no errors or timeouts
    expect(errorCount).toBe(0);
    expect(timeoutCount).toBe(0);
  });
});
