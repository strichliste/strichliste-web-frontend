import { test, expect } from '@playwright/test';
import { uniqueName, createUser, createArticle, expectBalance, disableUser, clickBuyArticleTab, clickUndoButton } from './fixtures/test-helpers';

test.describe('Article Management', () => {
  const testArticlePrefix = 'e2eArticle';
  let testArticleName: string;
  let testUsername: string;
  let testBarcode: string;
  let testTag: string;

  test.beforeEach(() => {
    testArticleName = uniqueName(testArticlePrefix);
    testUsername = uniqueName('articleUser');
    testBarcode = uniqueName('barcode');
    testTag = uniqueName('tag');
  });

  test('create article with name and price', async ({ page }) => {
    // Navigate to articles
    await page.goto('#!/articles/active');

    // Click add new article
    await page.getByTitle('add new articles').click();

    // Fill in article details - use type selectors since getByLabel can be unreliable with react-intl
    // The form has Name input (type="text"), then Price input (type="tel")
    await page.locator('input[type="text"]').first().fill(testArticleName);
    await page.locator('input[type="tel"]').fill('500');
    await page.getByTitle('save changes').click();

    // Verify article was created (should see details tab)
    await expect(page.getByText('details')).toBeVisible();
  });

  test('add tag and barcode to article', async ({ page }) => {
    // Create article first
    await createArticle(page, testArticleName, '500');

    // Add tag - click "add tag" button then fill the input
    await page.getByRole('button', { name: /add tag/i }).click();
    await page.getByPlaceholder('new tag').fill(testTag);
    // Click the accept/save button next to the input (checkmark icon)
    await page.locator('form').filter({ has: page.getByPlaceholder('new tag') }).getByRole('button').click();
    // After save, the tag appears in an input field with the value set - use CSS attribute selector
    await expect(page.locator(`input[value="${testTag}"]`)).toBeVisible({ timeout: 10000 });

    // Add barcode
    await page.getByRole('button', { name: /add barcode/i }).click();
    await page.getByPlaceholder('add barcode').fill(testBarcode);
    // Click the accept/save button
    await page.locator('form').filter({ has: page.getByPlaceholder('add barcode') }).getByRole('button').click();
  });

  test('buy article as user', async ({ page }) => {
    // Create article
    await createArticle(page, testArticleName, '500');

    // Create user
    await page.goto('/');
    await createUser(page, testUsername);
    await expectBalance(page, '€0.00');

    // Buy article using tab helper
    await clickBuyArticleTab(page);
    await page.getByPlaceholder('search for article').fill(testArticleName);
    // Article name is displayed with original casing, click the first button containing the article name
    // Use .first() because article versioning can create multiple articles with same name
    await page.getByRole('button', { name: new RegExp(testArticleName, 'i') }).first().click();

    // Verify balance decreased
    await expectBalance(page, '-€5.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('undo article purchase', async ({ page }) => {
    // Create article
    await createArticle(page, testArticleName, '500');

    // Create user
    await page.goto('/');
    await createUser(page, testUsername);

    // Buy article using tab helper
    await clickBuyArticleTab(page);
    await page.getByPlaceholder('search for article').fill(testArticleName);
    // Use .first() because article versioning can create multiple articles with same name
    await page.getByRole('button', { name: new RegExp(testArticleName, 'i') }).first().click();
    await expectBalance(page, '-€5.00');

    // Undo transaction using helper
    await clickUndoButton(page);
    await expectBalance(page, '€0.00');

    // Clean up
    await disableUser(page, testUsername);
  });

  test('edit article price', async ({ page }) => {
    const editedName = uniqueName('edited');

    // Create article
    await createArticle(page, testArticleName, '500');

    // Edit article - clear first then fill to ensure the value is replaced
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.click();
    await nameInput.fill(''); // Clear first
    await nameInput.fill(editedName);

    const priceInput = page.locator('input[type="tel"]').first();
    await priceInput.click();
    await priceInput.fill(''); // Clear first
    await priceInput.fill('800');

    await page.getByTitle('save changes').click();

    // Wait for navigation/save to complete - the new article should appear
    // After editing, article versioning creates a new article and redirects to it
    await page.waitForURL(/\/articles\/\d+\/edit/, { timeout: 10000 });

    // Verify new article name appears in heading
    await expect(page.getByRole('heading', { name: editedName })).toBeVisible({ timeout: 10000 });
  });

  test('delete article', async ({ page }) => {
    // Create article
    await createArticle(page, testArticleName, '500');

    // Delete article
    await page.getByText('delete article').click();

    // After delete, the app calls history.goBack() which may navigate to:
    // - articles list (if we came from there)
    // - add new article page (if we came from there after creating)
    // Verify we're no longer on the article edit page by checking the article name is gone
    await expect(page.getByRole('heading', { name: testArticleName })).not.toBeVisible({ timeout: 5000 });
  });

  test.skip('filter articles by tag', async ({ page }) => {
    // SKIP: Backend /api/tag endpoint doesn't exist - feature not fully implemented
    // Create article
    await createArticle(page, testArticleName, '500');

    // Add tag using data-testid button (this is the "add tag" button)
    await page.getByTestId('add-item-btn').first().click();
    await page.getByPlaceholder('new tag').fill(testTag);
    // Click the accept/save button next to the input
    await page.locator('form').filter({ has: page.getByPlaceholder('new tag') }).getByRole('button').click();
    // Wait for tag to be saved (input will have the value) - use CSS attribute selector
    await expect(page.locator(`input[value="${testTag}"]`)).toBeVisible({ timeout: 10000 });

    // Wait a moment for the tag to be persisted to the backend
    await page.waitForTimeout(1000);

    // Go to articles list via fresh page load to avoid cached tag data
    // The ArticleTagFilter component has module-level caching, so we need a fresh page
    await page.goto('/');
    await page.goto('#!/articles/active');

    // Wait for the article list to load (search box appears)
    await expect(page.getByPlaceholder('Search')).toBeVisible({ timeout: 10000 });

    // Wait for tag filter to load - the tag should appear as a button in the filter area
    // Tags are rendered by ArticleTagFilter component which fetches from /api/tag
    await expect(page.getByRole('button', { name: testTag })).toBeVisible({ timeout: 5000 });

    // Click on the tag button to filter articles
    await page.getByRole('button', { name: testTag }).click();

    // Verify the article with this tag is shown in the list
    await expect(page.getByText(testArticleName)).toBeVisible();
  });
});
