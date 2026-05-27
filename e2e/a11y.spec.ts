import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility scans (WCAG 2.1 A & AA) against the live demo API,
 * plus a keyboard-navigation smoke check. Runs in the CI quality gate.
 */

const routes = [
  { name: 'active users', hash: '#/user/active' },
  { name: 'articles', hash: '#/articles/active' },
  { name: 'metrics', hash: '#/metrics' },
  { name: 'search', hash: '#/search-results' },
];

for (const route of routes) {
  test(`${route.name} has no detectable WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(`/${route.hash}`);
    // Let data load and render.
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

async function scan(page: import('@playwright/test').Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

test('feature screens (detail, article form, send-money) have no violations', async ({
  page,
}) => {
  // Create a throwaway user so detail screens have real, isolated data.
  const name = `e2e-a11y-${Date.now()}`;
  await page.goto('/');
  await page.getByTitle('add new user').getByRole('button').first().click();
  const nameInput = page.getByPlaceholder('add new user');
  await nameInput.fill(name);
  await nameInput.press('Enter');
  await expect(page).toHaveURL(/#\/user\/\d+/);
  await page.waitForTimeout(1200);
  const url = page.url();
  const id = url.match(/#\/user\/(\d+)/)![1];

  expect((await scan(page)).violations).toEqual([]); // user detail

  await page.goto(`/#/user/${id}/edit`);
  await page.waitForTimeout(800);
  expect((await scan(page)).violations).toEqual([]); // edit user

  await page.goto(`/#/user/${id}/send_money_to_a_friend`);
  await page.waitForTimeout(800);
  expect((await scan(page)).violations).toEqual([]); // send money

  await page.goto('/#/articles/add');
  await page.waitForTimeout(800);
  expect((await scan(page)).violations).toEqual([]); // article form
});

test('skip link is reachable and focuses main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
