import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Hero Search Assertions ===

Then('the search field has placeholder {string}', async ({ page }, placeholder: string) => {
  const searchInput = page.getByTestId('hero-search-input');
  await expect(searchInput).toHaveAttribute('placeholder', placeholder);
});

Then('I see the search dropdown', async ({ page }) => {
  const dropdown = page.getByTestId('hero-search-dropdown');
  await expect(dropdown).toBeVisible();
});

Then('I see {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text).first()).toBeVisible();
});

Then('I see search results in the dropdown', async ({ page }) => {
  const results = page.locator('[data-testid^="hero-search-result-"]');
  await expect(results.first()).toBeVisible({ timeout: 5000 });
});

Then('the first result contains {string}', async ({ page }, text: string) => {
  const firstResult = page.getByTestId('hero-search-result-0').or(
    page.getByTestId('search-result-0')
  );
  await expect(firstResult).toContainText(text, { ignoreCase: true });
});

Then('I am on the search results page', async ({ page }) => {
  await expect(page).toHaveURL(/\/search/);
});

// === Hero Search Actions ===

When('I click on the hero search field', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input');
  await searchInput.click();
});

When('I type {string} in the hero search field', async ({ page }, query: string) => {
  const searchInput = page.getByTestId('hero-search-input');
  await searchInput.click();
  await searchInput.fill(query);
  // Wait for debounce and API response
  await page.waitForTimeout(600);
});

When('I click on the first search result', async ({ page }) => {
  const firstResult = page.getByTestId('hero-search-result-0');
  await firstResult.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the link {string}', async ({ page }, buttonText: string) => {
  const button = page.getByRole('link', { name: buttonText }).or(
    page.getByRole('button', { name: buttonText })
  ).or(page.getByText(buttonText));
  await button.first().click();
  await page.waitForLoadState('networkidle');
});

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

// === Search Modal Actions ===

When('I click on the close button', async ({ page }) => {
  const closeButton = page.getByTestId('search-modal-close');
  await closeButton.click();
});

When('I type {string} in the modal search field', async ({ page }, query: string) => {
  const searchInput = page.getByTestId('search-modal-input');
  await searchInput.fill(query);
  // Wait for debounce and API response
  await page.waitForTimeout(600);
});

When('I click on the first modal search result', async ({ page }) => {
  const firstResult = page.getByTestId('search-result-0');
  await firstResult.click();
  await page.waitForLoadState('networkidle');
});
