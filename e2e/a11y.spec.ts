import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility scans (WCAG 2.1 A & AA) against the live demo API,
 * plus keyboard-navigation and modal-open coverage. Runs in the CI quality
 * gate.
 */

const routes = [
  { name: 'active users', hash: '#/user/active' },
  { name: 'articles', hash: '#/articles/active' },
  { name: 'metrics', hash: '#/metrics' },
  { name: 'search', hash: '#/search-results' },
];

async function gotoAndSettle(page: Page, hash: string) {
  await page.goto(`/${hash}`);
  // Wait on a deterministic signal: header is present once the SPA has booted.
  await page.getByRole('navigation').waitFor();
  // Network-idle catches the demo-API fetch that drives most screens.
  await page.waitForLoadState('networkidle');
}

function scan(page: Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

for (const route of routes) {
  test(`${route.name} has no detectable WCAG A/AA violations`, async ({
    page,
  }) => {
    await gotoAndSettle(page, route.hash);
    expect((await scan(page)).violations).toEqual([]);
  });
}

test('feature screens (detail, article form, send-money) have no violations', async ({
  page,
}) => {
  // Create a throwaway user so detail screens have real, isolated data.
  const name = `e2e-a11y-${Date.now()}`;
  await gotoAndSettle(page, '');
  await page.getByTitle('add new user').getByRole('button').first().click();
  const nameInput = page.getByPlaceholder('add new user');
  await nameInput.fill(name);
  await nameInput.press('Enter');
  await expect(page).toHaveURL(/#\/user\/\d+/);
  // The detail header carries the user's balance as a heading; wait on it.
  await page.locator('h3[title="Balance"]').waitFor();
  await page.waitForLoadState('networkidle');
  const id = page.url().match(/#\/user\/(\d+)/)![1];

  expect((await scan(page)).violations).toEqual([]); // user detail

  await page.goto(`/#/user/${id}/edit`);
  await page.getByRole('textbox').first().waitFor();
  expect((await scan(page)).violations).toEqual([]); // edit user

  await page.goto(`/#/user/${id}/send_money_to_a_friend`);
  await page.getByRole('textbox').first().waitFor();
  expect((await scan(page)).violations).toEqual([]); // send money

  await page.goto('/#/articles/add');
  await page.getByRole('textbox').first().waitFor();
  expect((await scan(page)).violations).toEqual([]); // article form
});

test('dark theme has no detectable WCAG A/AA violations', async ({ page }) => {
  // Persist the dark theme preference before booting the SPA.
  await page.addInitScript(() =>
    window.localStorage.setItem('SELECTED_THEME', 'dark')
  );
  await gotoAndSettle(page, '#/user/active');
  expect((await scan(page)).violations).toEqual([]);
});

test('dark theme scans clean on the articles + metrics routes too', async ({ page }) => {
  await page.addInitScript(() =>
    window.localStorage.setItem('SELECTED_THEME', 'dark')
  );
  for (const hash of ['#/articles/active', '#/metrics']) {
    await gotoAndSettle(page, hash);
    expect((await scan(page)).violations).toEqual([]);
  }
});

test('each route renders exactly one <h1>', async ({ page }) => {
  for (const route of routes) {
    await gotoAndSettle(page, route.hash);
    const h1s = await page.getByRole('heading', { level: 1 }).count();
    expect(h1s, `${route.name} should have exactly one <h1>`).toBe(1);
  }
});

test('add-user modal traps focus and is axe-clean', async ({ page }) => {
  await gotoAndSettle(page, '#/user/active');
  await page.getByTitle('add new user').getByRole('button').first().click();
  const input = page.getByPlaceholder('add new user');
  await expect(input).toBeFocused();
  expect((await scan(page)).violations).toEqual([]);

  // The dialog has [input, submit]. Tab → submit, Tab again wraps to input.
  const submit = page
    .getByRole('dialog')
    .getByRole('button', { name: /create user/i });
  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();

  // Escape dismisses the dialog.
  await page.keyboard.press('Escape');
  await expect(input).toBeHidden();
});

test('skip link is reachable and focuses main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
