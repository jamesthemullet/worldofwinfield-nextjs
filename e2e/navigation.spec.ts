import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates from home to the favourites hub', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Favourites', exact: false }).first().click();
    await expect(page).toHaveURL(/\/favourites$/);
    await expect(page.getByRole('heading', { name: 'Favourites' })).toBeVisible();
  });

  test('navigates from home to the blog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Blog', exact: false }).first().click();
    await expect(page).toHaveURL(/\/blog$/);
  });
});
