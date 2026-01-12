import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

// === Search Interactions Assertions ===

Then('I see the search clear button', async ({ page }) => {
  const clearButton = page.getByTestId('search-input-clear-button');
  await expect(clearButton).toBeVisible();
});

Then('the search field is empty', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input').or(
    page.getByTestId('search-input-field')
  );
  const value = await searchInput.inputValue();
  expect(value).toBe('');
});

Then('a search result is selected', async ({ page }) => {
  // Check if any result has selected class or is focused
  const selectedResult = page.locator('[data-testid^="hero-search-result-"].selected').or(
    page.locator('[data-testid^="search-result-"].selected')
  );
  const count = await selectedResult.count();
  expect(count).toBeGreaterThan(0);
});

Then('I see trending search items', async ({ page }) => {
  const trendingList = page.getByTestId('search-trending-list');
  await expect(trendingList).toBeVisible();
});

Then('I see {string} in the dropdown', async ({ page }, text: string) => {
  const dropdown = page.getByTestId('hero-search-dropdown').or(
    page.getByTestId('search-input-dropdown')
  );
  await expect(dropdown.getByText(text).first()).toBeVisible();
});

Then('each result has a title', async ({ page }) => {
  const results = page.locator('[data-testid^="hero-search-result-"]').or(
    page.locator('[data-testid^="search-result-"]')
  );
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
  
  // Check first result has content
  const firstResult = results.first();
  const text = await firstResult.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

Then('each result has a summary', async ({ page }) => {
  const results = page.locator('[data-testid^="hero-search-result-"]').or(
    page.locator('[data-testid^="search-result-"]')
  );
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
  
  // Results should have some text content
  const firstResult = results.first();
  const text = await firstResult.textContent();
  expect(text?.trim().length).toBeGreaterThan(10);
});

// === Search Interactions Actions ===

When('I click on the search clear button', async ({ page }) => {
  const clearButton = page.getByTestId('search-input-clear-button');
  await clearButton.click();
  await page.waitForTimeout(300);
});

When('I press {string} key', async ({ page }, key: string) => {
  const keyMap: Record<string, string> = {
    'ArrowDown': 'ArrowDown',
    'Enter': 'Enter',
    'Escape': 'Escape',
  };
  
  const keyToPress = keyMap[key] || key;
  await page.keyboard.press(keyToPress);
  await page.waitForTimeout(200);
});

When('I click on the first trending item', async ({ page }) => {
  const trendingItem = page.getByTestId('search-trending-item-0');
  await trendingItem.click();
  await page.waitForLoadState('networkidle');
});
