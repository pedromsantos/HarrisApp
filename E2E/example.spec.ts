import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://harrisjazzlines.com//');

  await expect(page).toHaveTitle(/Barry Harris Line generation App/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://harrisjazzlines.com/');

  await page.getByRole('link', { name: 'C', exact: true }).click();
  await page.getByRole('link', { name: 'Dominant', exact: true }).click();
  await page.getByRole('link', { name: 'C Position', exact: true }).click();
  await page.getByRole('link', { name: 'Arpeggio Up', exact: true }).click();

  // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
