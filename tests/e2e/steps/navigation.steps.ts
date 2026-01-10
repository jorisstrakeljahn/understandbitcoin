import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

// === Header Assertions ===

Then('I see the header', async ({ page }) => {
  const header = page.getByTestId('header');
  await expect(header).toBeVisible();
});

Then('I see the search button in the header', async ({ page }) => {
  const searchButton = page.getByTestId('header-search-button');
  await expect(searchButton).toBeVisible();
});

Then('I see the navigation links', async ({ page }) => {
  const nav = page.getByTestId('header-nav');
  await expect(nav).toBeVisible();
  
  const topicsLink = page.getByTestId('header-nav-topics');
  const criticismLink = page.getByTestId('header-nav-criticism');
  const sourcesLink = page.getByTestId('header-nav-sources');
  
  await expect(topicsLink).toBeVisible();
  await expect(criticismLink).toBeVisible();
  await expect(sourcesLink).toBeVisible();
});

// === Header Navigation Actions ===

When('I click on the {string} link in the header', async ({ page }, linkText: string) => {
  const linkMap: Record<string, string> = {
    'Topics': 'header-nav-topics',
    'Themen': 'header-nav-topics',
    'Criticism': 'header-nav-criticism',
    'Kritik': 'header-nav-criticism',
    'Sources': 'header-nav-sources',
    'Quellen': 'header-nav-sources',
  };
  
  const testId = linkMap[linkText];
  if (!testId) {
    throw new Error(`Unknown navigation link: ${linkText}`);
  }
  
  const link = page.getByTestId(testId);
  await expect(link).toBeVisible({ timeout: 5000 });
  await link.click();
  await page.waitForURL(new RegExp(testId.replace('header-nav-', '')));
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
