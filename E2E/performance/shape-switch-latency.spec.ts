import { expect, test } from '@playwright/test';

/**
 * Performance Benchmark: CSF 5 - Shape Exploration
 * Validates that shape switching completes in <3 seconds
 *
 * Critical Success Factor 5: Switching between CAGED shapes feels instant (<3 seconds)
 *
 * Acceptance Criteria:
 * - Individual shape switches complete in <3 seconds
 * - All 5 shapes can be explored in <20 seconds
 * - Shape switching feels responsive (no lag)
 * - CSF target met in >95% of test runs
 */

test.describe('Performance: Shape Switch Latency (CSF 5)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a standard and generate initial lines
    await page.goto('/experimental');
    await page.waitForLoadState('networkidle');

    const standardsGrid = page.locator('[data-testid="standards-grid"]');
    await standardsGrid.waitFor({ state: 'visible', timeout: 2000 });

    const firstCard = page.locator('[data-testid="standards-grid"] > article').first();
    await firstCard.click();

    await page.waitForURL(/\/experimental\/standards\/.+/);

    // Generate initial lines with default E shape
    const generateButton = page.locator('button:has-text("Generate Lines")');
    await generateButton.waitFor({ state: 'visible' });
    await generateButton.click();

    const lineDisplay = page.locator('.rounded-lg.border.border-gray-300').first();
    await lineDisplay.waitFor({ state: 'visible', timeout: 3000 });

    // Wait for shape selector to appear
    await page.waitForTimeout(500);
  });

  test('single shape switch completes in <3 seconds', async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate Lines")');
    const aShapeButton = page.getByRole('button', { name: 'A', exact: true });

    const switchStart = Date.now();

    await aShapeButton.click();
    await expect(generateButton).not.toBeDisabled({ timeout: 3000 });

    const switchTime = Date.now() - switchStart;
    console.log(`Shape switch time: ${switchTime}ms`);

    expect(switchTime).toBeLessThan(3000);

    console.log(
      JSON.stringify({
        test: 'shape-switch-single',
        csf: 'CSF-5',
        target: 3000,
        actual: switchTime,
        passed: switchTime < 3000,
      })
    );
  });

  test('exploring all 5 shapes completes in <20 seconds', async ({ page }) => {
    const shapes: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'D', 'E'];
    const generateButton = page.locator('button:has-text("Generate Lines")');
    const switchTimes: number[] = [];

    const explorationStart = Date.now();

    for (const shape of shapes) {
      const shapeButton = page.getByRole('button', { name: shape, exact: true });

      const switchStart = Date.now();

      await shapeButton.click();
      await expect(generateButton).not.toBeDisabled({ timeout: 3000 });

      const switchTime = Date.now() - switchStart;
      switchTimes.push(switchTime);

      console.log(`${shape} shape: ${switchTime}ms`);
    }

    const totalExplorationTime = Date.now() - explorationStart;
    const avgSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;

    console.log(
      JSON.stringify({
        test: 'shape-exploration-complete',
        csf: 'CSF-5',
        target: 20000,
        actual: totalExplorationTime,
        passed: totalExplorationTime < 20000,
        shapeTimes: switchTimes,
        avgSwitchTime: Math.round(avgSwitchTime),
      })
    );

    // Verify total exploration time <20 seconds
    expect(totalExplorationTime).toBeLessThan(20000);

    // Verify each switch <3 seconds
    for (const switchTime of switchTimes) {
      expect(switchTime).toBeLessThan(3000);
    }
  });

  test('shape switching performance (30 runs for 95% target)', async ({ page }) => {
    const results: number[] = [];
    const targetRuns = 30;
    const targetPassRate = 0.95;
    const shapes: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'D', 'E'];
    const generateButton = page.locator('button:has-text("Generate Lines")');

    for (let i = 0; i < targetRuns; i++) {
      const shape = shapes[i % shapes.length];
      const shapeButton = page.getByRole('button', { name: shape, exact: true });

      const switchStart = Date.now();

      await shapeButton.click();
      await expect(generateButton).not.toBeDisabled({ timeout: 5000 });

      const switchTime = Date.now() - switchStart;
      results.push(switchTime);

      if ((i + 1) % 10 === 0) {
        console.log(`Completed ${i + 1}/${targetRuns} switches`);
      }

      // Brief pause between switches
      await page.waitForTimeout(100);
    }

    // Calculate statistics
    const passedSwitches = results.filter((time) => time < 3000).length;
    const passRate = passedSwitches / targetRuns;
    const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
    const sortedResults = [...results].sort((a, b) => a - b);
    const p95Time = sortedResults[Math.floor(results.length * 0.95)];

    console.log(
      JSON.stringify({
        test: 'shape-switch-batch',
        csf: 'CSF-5',
        target: 3000,
        runs: targetRuns,
        passed: passedSwitches,
        passRate: passRate,
        avgTime: Math.round(avgTime),
        p95Time: p95Time,
        targetPassRate: targetPassRate,
      })
    );

    // Verify 95% pass rate
    expect(passRate).toBeGreaterThanOrEqual(targetPassRate);
  });

  test('rapid shape switching maintains performance', async ({ page }) => {
    const shapes: ('C' | 'A' | 'G' | 'E' | 'D')[] = ['C', 'A', 'G', 'E', 'D'];
    const generateButton = page.locator('button:has-text("Generate Lines")');
    const rapidSwitchTimes: number[] = [];

    // Perform 15 rapid switches (3 cycles through all shapes)
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const shape of shapes) {
        const shapeButton = page.getByRole('button', { name: shape, exact: true });

        const switchStart = Date.now();

        await shapeButton.click();
        await expect(generateButton).not.toBeDisabled({ timeout: 3000 });

        const switchTime = Date.now() - switchStart;
        rapidSwitchTimes.push(switchTime);

        // Minimal pause for rapid switching
        await page.waitForTimeout(50);
      }
    }

    const avgTime = rapidSwitchTimes.reduce((a, b) => a + b, 0) / rapidSwitchTimes.length;
    const maxTime = Math.max(...rapidSwitchTimes);
    const slowSwitches = rapidSwitchTimes.filter((time) => time >= 3000).length;

    console.log(
      JSON.stringify({
        test: 'shape-switch-rapid',
        csf: 'CSF-5',
        target: 3000,
        switches: rapidSwitchTimes.length,
        avgTime: Math.round(avgTime),
        maxTime: maxTime,
        slowSwitches: slowSwitches,
        allFast: slowSwitches === 0,
      })
    );

    // Verify all switches are <3 seconds even with rapid switching
    expect(slowSwitches).toBe(0);
    expect(avgTime).toBeLessThan(2000); // Should be even faster with rapid switching
  });
});
