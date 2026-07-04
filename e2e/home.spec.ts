import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows the site title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/World Of Winfield/);
  });

  test('has no Content-Security-Policy violations on load', async ({ page }) => {
    const cspErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy/i.test(msg.text())) {
        cspErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(cspErrors).toEqual([]);
  });
});
