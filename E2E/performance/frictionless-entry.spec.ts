import { expect, test } from '@playwright/test';

/**
 * Performance Benchmark: CSF 1 - Frictionless Entry
 * Validates that users can go from app open to first line generation in <30 seconds
 *
 * Critical Success Factor 1: Users can start practicing within 30 seconds of opening the app
 *
 * Acceptance Criteria:
 * - Total time from app open to first generation <30 seconds
 * - Standards library loads within 2 seconds
 * - Standard detail page loads within 1 second
 * - First line generation completes within 3 seconds
 * - CSF target met in >95% of test runs (target: 28 of 30 runs)
 */

test.describe('Performance: Frictionless Entry (CSF 1)', () => {
  test('users can start practicing within 30 seconds', async ({ page }) => {
    const journeyStart = Date.now();

    // Navigate to app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Experimental tab
    const experimentalLink = page.locator('a:has-text("Experimental")');
    await experimentalLink.waitFor({ state: 'visible', timeout: 10000 });
    await experimentalLink.click();

    // Wait for standards library to load (should be <2 seconds)
    const libraryLoadStart = Date.now();
    await page.waitForURL('/experimental');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const standardCards = page.locator('[data-testid="standards-grid"] > article');
    await expect(standardCards).toHaveCount(15, { timeout: 2000 });

    const libraryLoadTime = Date.now() - libraryLoadStart;
    console.log(`Standards library load time: ${libraryLoadTime}ms`);
    expect(libraryLoadTime).toBeLessThan(2000);

    // Select first standard
    const firstCard = standardCards.first();
    await firstCard.click();

    // Wait for detail page to load (should be <1 second)
    const detailLoadStart = Date.now();
    await page.waitForURL(/\/experimental\/standards\/.+/);
    await expect(page.locator('h2:has-text("Chord Progressions")')).toBeVisible();

    const detailLoadTime = Date.now() - detailLoadStart;
    console.log(`Detail page load time: ${detailLoadTime}ms`);
    expect(detailLoadTime).toBeLessThan(1000);

    // Generate lines (should be <3 seconds)
    const generateStart = Date.now();

    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    // Wait for lines to appear
    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    const generateTime = Date.now() - generateStart;
    console.log(`Line generation time: ${generateTime}ms`);
    expect(generateTime).toBeLessThan(3000);

    // Verify total journey time
    const totalTime = Date.now() - journeyStart;
    console.log(`Total frictionless entry time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(30000);

    // Log results for CI tracking
    console.log(
      JSON.stringify({
        test: 'frictionless-entry',
        csf: 'CSF-1',
        target: 30000,
        actual: totalTime,
        passed: totalTime < 30000,
        breakdown: {
          libraryLoad: libraryLoadTime,
          detailLoad: detailLoadTime,
          generation: generateTime,
        },
      })
    );
  });

  test('frictionless entry performance (30 runs for 95% target)', async ({ page }) => {
    const results: number[] = [];
    const targetRuns = 30;
    const targetPassRate = 0.95;

    for (let i = 0; i < targetRuns; i++) {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const experimentalLink = page.locator('a:has-text("Experimental")');
      await experimentalLink.waitFor({ state: 'visible', timeout: 10000 });
      await experimentalLink.click();

      await page.waitForURL('/experimental');
      const standardsGrid = page.locator('[data-testid="standards-grid"]');
      await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

      const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
      await firstCard.click();

      await page.waitForURL(/\/experimental\/standards\/.+/);

      const generateButton = page.locator('button:has-text("Generate Lines")');
      await generateButton.waitFor({ state: 'visible' });
      await generateButton.click();

      const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
      await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

      const totalTime = Date.now() - startTime;
      results.push(totalTime);

      console.log(`Run ${i + 1}/${targetRuns}: ${totalTime}ms`);
    }

    // Calculate statistics
    const passedRuns = results.filter((time) => time < 30000).length;
    const passRate = passedRuns / targetRuns;
    const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
    const p95Time = results.sort((a, b) => a - b)[Math.floor(results.length * 0.95)];

    console.log(
      JSON.stringify({
        test: 'frictionless-entry-batch',
        csf: 'CSF-1',
        target: 30000,
        runs: targetRuns,
        passed: passedRuns,
        passRate: passRate,
        avgTime: Math.round(avgTime),
        p95Time: p95Time,
        targetPassRate: targetPassRate,
      })
    );

    // Verify 95% pass rate
    expect(passRate).toBeGreaterThanOrEqual(targetPassRate);
  });
});
