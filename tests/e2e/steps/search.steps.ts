import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

// === Search Modal Assertions ===

Then('I see the search modal', async ({ page }) => {
  const modal = page.getByTestId('search-modal');
  await expect(modal).toBeVisible();
});

Then('I no longer see the search modal', async ({ page }) => {
  const modal = page.getByTestId('search-modal');
  await expect(modal).not.toBeVisible();
});

Then('the modal search field is focused', async ({ page }) => {
  const input = page.getByTestId('search-modal-input');
  await expect(input).toBeFocused();
});

Then('I see search results in the modal', async ({ page }) => {
  const results = page.locator('[data-testid^="search-result-"]');
  await expect(results.first()).toBeVisible({ timeout: 5000 });
});

Then('the article title contains {string}', async ({ page }, text: string) => {
  const title = page.getByTestId('article-title');
  await expect(title).toContainText(text, { ignoreCase: true });
});

Then('I am on the search results page', async ({ page }) => {
  await expect(page).toHaveURL(/\/search/);
});

// === Search Modal Actions ===

When('I click on the close button', async ({ page }) => {
  const closeButton = page.getByTestId('search-modal-close');
  await closeButton.click();
});

When('I type {string} in the modal search field', async ({ page }, query: string) => {
  const searchInput = page.getByTestId('search-modal-input');
  await searchInput.fill(query);
  await page.waitForTimeout(600);
});

When('I click on the first modal search result', async ({ page }) => {
  const firstResult = page.getByTestId('search-result-0');
  await firstResult.click();
  await page.waitForLoadState('networkidle');
});
