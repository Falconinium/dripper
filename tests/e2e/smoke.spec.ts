import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Dripper/i);
});

test('shops index renders and lists results', async ({ page }) => {
  await page.goto('/shops');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('carte page renders', async ({ page }) => {
  await page.goto('/carte');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('selection criteria page renders', async ({ page }) => {
  await page.goto('/selection');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
