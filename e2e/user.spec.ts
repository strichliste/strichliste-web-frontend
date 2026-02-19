import { test, expect } from '@playwright/test';
import { uniqueName, createUser, goToUser, expectBalance, disableUser, selectUserFromModal, clickTransactionButton, clickUndoButton, clickSendMoneyTab, clickEditUserTab, clickAllTransactionsButton } from './fixtures/test-helpers';

test.describe('User Management', () => {
  const testUserPrefix = 'e2eUser';
  let testUsername: string;
  let sendToUsername: string;

  test.beforeEach(() => {
    testUsername = uniqueName(testUserPrefix);
    sendToUsername = uniqueName('sendTo');
  });

  test('create user and view details', async ({ page }) => {
    await page.goto('/');

    // Create a new user
    await createUser(page, testUsername);

    // Verify user details page
    await expect(page.getByText(testUsername)).toBeVisible();
    await expect(page.getByText('You have no transactions yet')).toBeVisible();
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('add and remove balance with quick buttons', async ({ page }) => {
    await page.goto('/');
    await createUser(page, testUsername);

    // Add €1.00 (100 cents)
    await clickTransactionButton(page, 100);
    await expectBalance(page, '+€1.00');

    // Remove €1.00 (-100 cents)
    await clickTransactionButton(page, -100);
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('custom amount deposit and dispense', async ({ page }) => {
    await page.goto('/');
    await createUser(page, testUsername);

    // Verify buttons are disabled without amount
    const depositBtn = page.getByTestId('custom-deposit-btn').or(page.getByTitle('deposit'));
    const dispenseBtn = page.getByTestId('custom-dispense-btn').or(page.getByTitle('dispense'));
    await expect(depositBtn).toBeDisabled();
    await expect(dispenseBtn).toBeDisabled();

    // Enter custom amount and deposit
    await page.getByPlaceholder('CUSTOM AMOUNT').fill('500');
    await expect(depositBtn).toBeEnabled();
    await depositBtn.click();
    await expectBalance(page, '+€5.00');

    // Dispense the same amount
    await page.getByPlaceholder('CUSTOM AMOUNT').fill('500');
    await dispenseBtn.click();
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('search for user', async ({ page }) => {
    await page.goto('/');
    await createUser(page, testUsername);

    // Go back home and search using goToUser helper
    await goToUser(page, testUsername);

    // Verify we're on the user details page
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('edit user name and email', async ({ page }) => {
    const editedUsername = uniqueName('edited');
    const testEmail = 'test@example.com';

    await page.goto('/');
    await createUser(page, testUsername);

    // Edit user using helper
    await clickEditUserTab(page);
    await page.getByPlaceholder('name').clear();
    await page.getByPlaceholder('name').fill(editedUsername);
    await page.getByPlaceholder('e-mail').fill(testEmail);
    await page.getByTitle('save changes').click();

    // Verify changes by searching for edited name
    await goToUser(page, editedUsername);
    await clickEditUserTab(page);
    await expect(page.getByPlaceholder('e-mail')).toHaveValue(testEmail);

    // Clean up
    await disableUser(page, editedUsername);
  });

  test('send money to another user', async ({ page }) => {
    await page.goto('/');

    // Create sender with balance
    await createUser(page, testUsername);
    await clickTransactionButton(page, 500); // +€5.00
    await expectBalance(page, '+€5.00');

    // Create recipient
    await page.goto('/');
    await createUser(page, sendToUsername);

    // Send money from recipient to sender using helper
    await clickSendMoneyTab(page);
    // Use .first() because there are two inputs - one for send money "Amount" and one for "CUSTOM AMOUNT"
    await page.getByPlaceholder('Amount').first().fill('200');
    await page.getByText('Username').click();
    await selectUserFromModal(page, testUsername);
    await page.getByPlaceholder('Add notes').fill('Test transfer');
    await page.getByTitle('Submit to send this amount to a friend').click();

    // Verify success message
    await expect(page.getByText(/You sent User/)).toBeVisible();

    // Clean up
    await disableUser(page, testUsername);
    await disableUser(page, sendToUsername);
  });

  test('view all transactions link', async ({ page }) => {
    await page.goto('/');
    await createUser(page, testUsername);

    // Create a transaction first
    await clickTransactionButton(page, 100); // +€1.00

    // Click all transactions using helper
    await clickAllTransactionsButton(page);

    // Verify we can see transaction history
    await expect(page.getByText('€1.00')).toBeVisible();

    // Clean up
    await disableUser(page, testUsername);
  });
});
