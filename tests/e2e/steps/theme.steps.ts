import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Theme Toggle Assertions ===

Then('I see the theme toggle', async ({ page }) => {
  const toggle = page.getByTestId('theme-toggle');
  await expect(toggle).toBeVisible();
});

Then('the theme should be {string}', async ({ page }, theme: string) => {
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', theme);
});

// === Theme Setup ===

Given('the current theme is {string}', async ({ page }, theme: string) => {
  // Set the theme via localStorage before the page loads
  await page.evaluate((t) => {
    localStorage.setItem('theme', t);
  }, theme);
  // Reload to apply the theme
  await page.reload();
  await page.waitForLoadState('networkidle');
});

// === Theme Toggle Actions ===

When('I click on the theme toggle', async ({ page }) => {
  const toggle = page.getByTestId('theme-toggle');
  await toggle.click();
  // Wait for theme transition
  await page.waitForTimeout(100);
});
