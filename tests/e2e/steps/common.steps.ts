import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Common Navigation Steps (Given) ===

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
});

Given('I am on the German homepage', async ({ page }) => {
  await page.goto('/de');
  await page.waitForLoadState('networkidle');
});

Given('I am on the topics page', async ({ page }) => {
  await page.goto('/en/topics');
  await page.waitForLoadState('networkidle');
});

// === Common URL Assertions (Then) ===

Then('the URL contains {string}', async ({ page }, urlPart: string) => {
  // Escape special regex characters in the URL part
  const escapedUrlPart = urlPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(escapedUrlPart));
});

Then('I should be on the homepage', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/?$/);
});

Then('I should be on the topics page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/topics\/?$/);
});

Then('I should be on the criticism page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/topics\/criticism/);
});

Then('I should be on the sources page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/sources/);
});

Then('I should be on an article page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/articles\//);
});
