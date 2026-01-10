import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Homepage Assertions ===

Then('I see the title {string}', async ({ page }, title: string) => {
  const heading = page.locator('h1').first();
  await expect(heading).toContainText(title);
});

Then('I see the search field in the hero section', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input');
  await expect(searchInput).toBeVisible();
});

Then('I see the CTA buttons', async ({ page }) => {
  const topicsButton = page.getByTestId('hero-cta-topics');
  const criticismButton = page.getByTestId('hero-cta-criticism');
  await expect(topicsButton).toBeVisible();
  await expect(criticismButton).toBeVisible();
});

Then('I see the hero title', async ({ page }) => {
  const heroTitle = page.getByTestId('hero-title');
  await expect(heroTitle).toBeVisible();
});

Then('I see the hero search field', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input');
  await expect(searchInput).toBeVisible();
});

Then('I see the {string} button', async ({ page }, buttonText: string) => {
  const button = page.getByRole('button', { name: buttonText }).or(
    page.getByRole('link', { name: buttonText })
  );
  await expect(button).toBeVisible();
});

// === Homepage Actions ===

When('I click on {string}', async ({ page }, buttonText: string) => {
  const button = page.getByRole('button', { name: buttonText }).or(
    page.getByRole('link', { name: buttonText })
  );
  await button.click();
  await page.waitForLoadState('networkidle');
});
