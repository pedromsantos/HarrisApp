import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://harrisjazzlines.com//');

  await expect(page).toHaveTitle(/Barry Harris Line generation App/);
});

test.skip('Display guitar tab for C7 scale Arpeggio up fom degree I', async ({ page }) => {
  await page.goto('https://harrisjazzlines.com/');

  await page.getByRole('link', { name: 'C', exact: true }).click();
  await page.getByRole('link', { name: 'Dominant', exact: true }).click();
  await page.getByRole('link', { name: 'C Position', exact: true }).click();
  await page.getByRole('link', { name: 'Arpeggio Up', exact: true }).click();

  const expectedTab = `e|-------------------------------|
B|---------------------3-5-------|
G|-------3-2---------3-------2-5-|
D|---2-5-----5-3-2-5-------3-----|
A|-3-----------------------------|
E|-------------------------------|`;

  await expect(page.getByText(expectedTab)).toBeVisible();
});
