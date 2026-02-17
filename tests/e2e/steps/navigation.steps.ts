import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

Then('I see the header', async ({ page }) => {
  const header = page.getByTestId('header');
  await expect(header).toBeVisible();
});

Then('I see the search button in the header', async ({ page }) => {
  const searchButton = page.getByTestId('header-search-button');
  await expect(searchButton).toBeVisible();
});

When('I click on the logo', async ({ page }) => {
  const logo = page.getByTestId('header-logo');
  await logo.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the search button in the header', async ({ page }) => {
  const searchButton = page.getByTestId('header-search-button');
  await searchButton.click();
});
