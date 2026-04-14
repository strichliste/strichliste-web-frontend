import { test, expect } from '@playwright/test';
import { uniqueName, createUser, goToUser, expectBalance, disableUser, selectUserFromModal, clickTransactionButton, clickUndoButton, clickSendMoneyTab, clickAllTransactionsButton } from './fixtures/test-helpers';

test.describe('Transaction Management', () => {
  const testUserPrefix = 'e2eTxUser';
  let user1: string;
  let user2: string;
  let user3: string;

  test.beforeEach(() => {
    user1 = uniqueName(testUserPrefix + '1');
    user2 = uniqueName(testUserPrefix + '2');
    user3 = uniqueName(testUserPrefix + '3');
  });

  test('transaction history shows all transactions', async ({ page }) => {
    await page.goto('/');
    await createUser(page, user1);

    // Create multiple transactions using helper
    await clickTransactionButton(page, 100);  // +€1.00
    await clickTransactionButton(page, 200);  // +€2.00
    await clickTransactionButton(page, -50);  // -€0.50

    // Check balance
    await expectBalance(page, '+€2.50');

    // View all transactions using helper
    await clickAllTransactionsButton(page);

    // Verify transactions are listed
    await expect(page.getByText('€1.00')).toBeVisible();
    await expect(page.getByText('€2.00')).toBeVisible();
    await expect(page.getByText('€0.50')).toBeVisible();

    // Clean up
    await disableUser(page, user1);
  });

  test('undo recent transaction', async ({ page }) => {
    await page.goto('/');
    await createUser(page, user1);

    // Add balance
    await clickTransactionButton(page, 500);  // +€5.00
    await expectBalance(page, '+€5.00');

    // Undo using helper
    await clickUndoButton(page);
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, user1);
  });

  test('send money with comment', async ({ page }) => {
    const comment = 'Pizza money';

    await page.goto('/');

    // Create users
    await createUser(page, user1);
    await page.goto('/');
    await createUser(page, user2);

    // Add balance to user2
    await clickTransactionButton(page, 1000);  // +€10.00

    // Send money to user1 using helper
    await clickSendMoneyTab(page);
    // Use .first() because there are two inputs - one for send money "Amount" and one for "CUSTOM AMOUNT"
    await page.getByPlaceholder('Amount').first().fill('300');
    await page.getByText('Username').click();
    await selectUserFromModal(page, user1);
    await page.getByPlaceholder('Add notes').fill(comment);
    await page.getByTitle('Submit to send this amount to a friend').click();

    // Verify success
    await expect(page.getByText(/You sent User/)).toBeVisible();

    // Verify user1 received the money
    await goToUser(page, user1);
    await expectBalance(page, '+€3.00');

    // Clean up
    await disableUser(page, user1);
    await disableUser(page, user2);
  });

  test('split invoice between participants', async ({ page }) => {
    await page.goto('/');

    // Create 3 users
    await createUser(page, user1);
    await page.goto('/');
    await createUser(page, user2);
    await page.goto('/');
    await createUser(page, user3);

    // Start split invoice (this link is in the header, not a tab, so use text)
    await page.getByText('Split Invoice').click();

    // Set amount
    await page.getByPlaceholder('amount').fill('900');

    // Select recipient (who paid)
    await page.getByText('select recipient').click();
    await selectUserFromModal(page, user1);

    // Add comment
    await page.getByPlaceholder('comment').fill('Dinner split');

    // Add participants
    await page.getByText('add participant').click();
    await selectUserFromModal(page, user2);

    await page.getByText('add participant').click();
    await selectUserFromModal(page, user3);

    // Verify split calculation
    await expect(page.getByText('3 participants split +€9.00')).toBeVisible();
    await expect(page.getByText(/everybody has to pay \+€3\.00/)).toBeVisible();

    // Submit
    await page.getByTitle('submit the split invoice').click();

    // Clean up
    await disableUser(page, user1);
    await disableUser(page, user2);
    await disableUser(page, user3);
  });

  test('transaction with negative balance allowed', async ({ page }) => {
    await page.goto('/');
    await createUser(page, user1);

    // Create negative transaction (dispense without balance)
    await clickTransactionButton(page, -500);  // -€5.00
    await expectBalance(page, '-€5.00');

    // Add more negative
    await clickTransactionButton(page, -500);  // -€5.00
    await expectBalance(page, '-€10.00');

    // Clean up
    await disableUser(page, user1);
  });

  test('quick deposit buttons work', async ({ page }) => {
    await page.goto('/');
    await createUser(page, user1);

    // Test each quick deposit button
    await clickTransactionButton(page, 50);   // +€0.50
    await expectBalance(page, '+€0.50');

    await clickTransactionButton(page, 100);  // +€1.00
    await expectBalance(page, '+€1.50');

    await clickTransactionButton(page, 200);  // +€2.00
    await expectBalance(page, '+€3.50');

    // Clean up
    await disableUser(page, user1);
  });

  test('quick dispense buttons work', async ({ page }) => {
    await page.goto('/');
    await createUser(page, user1);

    // Add initial balance
    await clickTransactionButton(page, 1000);  // +€10.00

    // Test dispense buttons
    await clickTransactionButton(page, -50);   // -€0.50
    await expectBalance(page, '+€9.50');

    await clickTransactionButton(page, -100);  // -€1.00
    await expectBalance(page, '+€8.50');

    await clickTransactionButton(page, -200);  // -€2.00
    await expectBalance(page, '+€6.50');

    // Clean up
    await disableUser(page, user1);
  });
});
