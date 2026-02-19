import { Page, expect } from '@playwright/test';

/**
 * Generate a unique test name with timestamp to avoid collisions
 */
export function uniqueName(prefix: string): string {
  return `${prefix}${Date.now()}`;
}

/**
 * Create a new article via the article form
 * @param priceCents - price in cents (e.g., 500 for €5.00)
 */
export async function createArticle(page: Page, name: string, priceCents: string): Promise<void> {
  await page.goto('#!/articles/active');
  await page.getByTitle('add new articles').click();
  // Use type selectors since getByLabel can be unreliable with react-intl async rendering
  // Name input is type="text", Price input is type="tel"
  await page.locator('input[type="text"]').first().fill(name);
  await page.locator('input[type="tel"]').fill(priceCents);
  await page.getByTitle('save changes').click();
  // Wait for navigation to article details - use role-based selector
  await expect(page.getByRole('heading', { name: /details/i }).or(page.getByText('details'))).toBeVisible();
}

/**
 * Create a new user via the inline form on the home page
 */
export async function createUser(page: Page, username: string): Promise<void> {
  // Click the FAB button (+ icon) to open the modal
  await page.getByTitle('add new user').click();
  // Fill in the username in the modal input
  await page.getByPlaceholder('add new user').fill(username);
  await page.getByPlaceholder('add new user').press('Enter');
  // Wait for navigation to user details page - wait for balance to appear
  await expect(page.getByTestId('user-balance')).toBeVisible();
}

/**
 * Navigate to user details via search
 */
export async function goToUser(page: Page, username: string): Promise<void> {
  await page.goto('/');
  await page.getByRole('link', { name: /search/i }).click();
  await page.getByPlaceholder('Search').fill(username);
  await page.getByText(username).click();
  // Wait for user page to load
  await expect(page.getByTestId('user-balance')).toBeVisible();
}

/**
 * Get the current balance displayed on user details page
 */
export async function getBalance(page: Page): Promise<string> {
  const balanceElement = page.getByTestId('user-balance');
  return balanceElement.textContent() ?? '€0.00';
}

/**
 * Disable a user (for cleanup)
 */
export async function disableUser(page: Page, username: string): Promise<void> {
  await goToUser(page, username);
  await page.getByTestId('tab-edit-user').click();
  await page.getByLabel('User is inactive').click();
  await page.getByTitle('save changes').click();
}

/**
 * Select a user from the modal selection dialog
 */
export async function selectUserFromModal(page: Page, username: string): Promise<void> {
  await page.getByPlaceholder('Search').fill(username);
  await page.getByText(username).click();
}

/**
 * Wait for balance to update to expected value
 */
export async function expectBalance(page: Page, expected: string): Promise<void> {
  // Balance updates after API call
  await expect(page.getByTestId('user-balance')).toContainText(expected, { timeout: 15000 });
}

/**
 * Click a quick transaction button by amount (e.g., 100 for €1.00)
 */
export async function clickTransactionButton(page: Page, amountCents: number): Promise<void> {
  // Use button role with exact text match for reliability
  const buttonText = amountCents > 0
    ? `+€${(amountCents / 100).toFixed(2)}`
    : `-€${(Math.abs(amountCents) / 100).toFixed(2)}`;
  await page.getByRole('button', { name: buttonText, exact: true }).click();
  // Wait for the transaction API call to complete and UI to update
  // The balance should change after a successful transaction
  await page.waitForTimeout(500);
}

/**
 * Click the undo button for the most recent transaction
 */
export async function clickUndoButton(page: Page): Promise<void> {
  await page.getByTestId('undo-transaction-btn').click();
}

/**
 * Click tab to send money
 */
export async function clickSendMoneyTab(page: Page): Promise<void> {
  await page.getByTestId('tab-send-money').click();
}

/**
 * Click tab to buy article
 */
export async function clickBuyArticleTab(page: Page): Promise<void> {
  await page.getByTestId('tab-buy-article').click();
}

/**
 * Click tab to edit user
 */
export async function clickEditUserTab(page: Page): Promise<void> {
  await page.getByTestId('tab-edit-user').click();
}

/**
 * Click button to view all transactions
 */
export async function clickAllTransactionsButton(page: Page): Promise<void> {
  await page.getByTestId('all-transactions-btn').click();
}
