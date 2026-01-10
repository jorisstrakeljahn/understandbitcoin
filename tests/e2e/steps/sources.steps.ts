import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Sources Page Navigation ===

Given('I am on the sources page', async ({ page }) => {
  await page.goto('/en/sources');
  await page.waitForLoadState('networkidle');
});

// === Sources Page Assertions ===

Then('I see the sources page', async ({ page }) => {
  const sourcesPage = page.getByTestId('sources-page');
  await expect(sourcesPage).toBeVisible();
});

Then('I see the sources title', async ({ page }) => {
  const title = page.getByTestId('sources-title');
  await expect(title).toBeVisible();
});

Then('I see the sources filters', async ({ page }) => {
  const filters = page.getByTestId('sources-filters');
  await expect(filters).toBeVisible();
});

Then('I see the sources grid', async ({ page }) => {
  const grid = page.getByTestId('sources-grid');
  await expect(grid).toBeVisible();
});

Then('I see at least {int} source card', async ({ page }, count: number) => {
  const cards = page.locator('[class*="sourceCard"]');
  await expect(cards).toHaveCount({ minimum: count });
});

// === Sources Filter Actions ===

When('I click on the books filter', async ({ page }) => {
  const filter = page.getByTestId('sources-filter-book');
  await filter.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the videos filter', async ({ page }) => {
  const filter = page.getByTestId('sources-filter-video');
  await filter.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the articles filter', async ({ page }) => {
  const filter = page.getByTestId('sources-filter-article');
  await filter.click();
  await page.waitForLoadState('networkidle');
});
