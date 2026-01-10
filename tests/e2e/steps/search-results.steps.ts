import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Search Results Page Navigation ===

Given('I am on the search results page with query {string}', async ({ page }, query: string) => {
  await page.goto(`/en/search?q=${encodeURIComponent(query)}`);
  await page.waitForLoadState('networkidle');
});

Given('I am on the search results page without query', async ({ page }) => {
  await page.goto('/en/search');
  await page.waitForLoadState('networkidle');
});

// === Search Results Page Assertions ===

Then('I see the search page', async ({ page }) => {
  const searchPage = page.getByTestId('search-page');
  await expect(searchPage).toBeVisible();
});

Then('I see the search results', async ({ page }) => {
  const results = page.getByTestId('search-results');
  await expect(results).toBeVisible();
});

Then('I see the results count', async ({ page }) => {
  const count = page.getByTestId('search-results-count');
  await expect(count).toBeVisible();
});

Then('I see the search page input', async ({ page }) => {
  const input = page.getByTestId('search-page-input');
  await expect(input).toBeVisible();
});

Then('the search input has value {string}', async ({ page }, value: string) => {
  const input = page.getByTestId('search-page-input');
  await expect(input).toHaveValue(value);
});

Then('I see the empty search state', async ({ page }) => {
  const emptyState = page.locator('[class*="emptyState"]');
  await expect(emptyState).toBeVisible();
});

Then('I see the no results message', async ({ page }) => {
  // Look for the main container with the no results text
  const noResults = page.getByText('No results found');
  await expect(noResults).toBeVisible();
});

// === Search Results Actions ===

When('I click on the first search page result', async ({ page }) => {
  const result = page.getByTestId('search-page-result-0');
  await result.click();
  await page.waitForLoadState('networkidle');
});
