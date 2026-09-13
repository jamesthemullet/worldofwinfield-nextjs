import { expect, test } from '@playwright/test';

test.describe('Favourites', () => {
  test('hub page lists favourite categories with entry counts', async ({ page }) => {
    await page.goto('/favourites');
    await expect(page.getByRole('link', { name: /Books/ })).toBeVisible();
    await expect(page.getByText(/\d+ entries/).first()).toBeVisible();
  });

  test('a favourites category page loads real data rows from the Google Sheet', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/favourite-books');

    // Guards against the CSP connect-src regression that silently blocked
    // the client-side fetch to sheets.googleapis.com and left the grid empty.
    // Books render as a cover grid rather than a table.
    const cards = page.getByTestId('favourite-card');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThan(0);

    const cspErrors = consoleErrors.filter((e) =>
      /Content Security Policy|Refused to connect/i.test(e),
    );
    expect(cspErrors).toEqual([]);
  });
});
