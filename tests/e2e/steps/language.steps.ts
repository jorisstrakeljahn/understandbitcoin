import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Language Switcher Assertions ===

Then('I see the language switcher', async ({ page }) => {
  const switcher = page.getByTestId('language-switcher');
  await expect(switcher).toBeVisible();
});

Then('I see the language dropdown', async ({ page }) => {
  const dropdown = page.getByTestId('language-dropdown');
  await expect(dropdown).toBeVisible();
});

// === Language Switcher Actions ===

When('I click on the language toggle', async ({ page }) => {
  const toggle = page.getByTestId('language-toggle');
  await toggle.click();
});

When('I click on the German language option', async ({ page }) => {
  const option = page.getByTestId('language-option-de');
  await option.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the English language option', async ({ page }) => {
  const option = page.getByTestId('language-option-en');
  await option.click();
  await page.waitForLoadState('networkidle');
});
