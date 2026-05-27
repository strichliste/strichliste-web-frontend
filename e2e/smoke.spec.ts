import { test, expect, Page } from '@playwright/test';

/**
 * Smoke suite: drives the real app in a browser against the live demo API
 * (https://demo.strichliste.org/api/, configured via VITE_API).
 *
 * The demo backend is shared and stateful, so each run creates its own uniquely
 * named user and only mutates that user's balance — never any pre-existing data.
 */

function uniqueUserName(): string {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function createUser(page: Page, name: string): Promise<void> {
  // The add-user FAB lives inside a wrapper carrying the "add new user" title.
  await page.getByTitle('add new user').getByRole('button').first().click();
  const nameInput = page.getByPlaceholder('add new user');
  await expect(nameInput).toBeVisible();
  await nameInput.fill(name);
  await nameInput.press('Enter');
}

test('loads and redirects to the active users list', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/#\/user\/active/);
  // Header navigation is present.
  await expect(page.getByRole('link', { name: 'Strichliste' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Article List' })).toBeVisible();
});

test('navigates between the main sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Article List' }).click();
  await expect(page).toHaveURL(/#\/articles/);

  await page.getByRole('link', { name: 'Metrics' }).click();
  await expect(page).toHaveURL(/#\/metrics/);
});

test('creates a user and deposits to their balance', async ({ page }) => {
  const name = uniqueUserName();
  await page.goto('/');

  await createUser(page, name);

  // Landed on the freshly created user's detail page.
  await expect(page).toHaveURL(/#\/user\/\d+/);
  await expect(page.getByText(name).first()).toBeVisible();

  // New users start at a zero balance.
  const balance = page.locator('h3[title="Balance"]');
  await expect(balance).toContainText(/0[.,]00/);

  // Deposit via the preset 5.00 step button (deposit buttons render first).
  await page.getByRole('button', { name: /5[.,]00/ }).first().click();

  // Balance reflects the deposit.
  await expect(balance).toContainText(/5[.,]00/);
});
