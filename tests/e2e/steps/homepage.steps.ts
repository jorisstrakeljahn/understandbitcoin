import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

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
  // Use specific testids for CTA buttons
  const buttonMap: Record<string, string> = {
    'Browse Topics': 'hero-cta-topics',
    'Themen durchsuchen': 'hero-cta-topics',
    'Read Criticism': 'hero-cta-criticism',
    'Kritik lesen': 'hero-cta-criticism',
  };
  
  const testId = buttonMap[buttonText];
  if (testId) {
    const button = page.getByTestId(testId);
    await expect(button).toBeVisible();
  } else {
    const button = page.getByRole('button', { name: buttonText }).first();
    await expect(button).toBeVisible();
  }
});

// === Homepage Actions ===

When('I click on {string}', async ({ page }, buttonText: string) => {
  // Use specific testids for CTA buttons - these are Links wrapping Buttons
  const buttonMap: Record<string, { testId: string; urlPattern: RegExp }> = {
    'Browse Topics': { testId: 'hero-cta-topics', urlPattern: /\/topics\/?$/ },
    'Themen durchsuchen': { testId: 'hero-cta-topics', urlPattern: /\/topics\/?$/ },
    'Read Criticism': { testId: 'hero-cta-criticism', urlPattern: /\/topics\/criticism/ },
    'Kritik lesen': { testId: 'hero-cta-criticism', urlPattern: /\/topics\/criticism/ },
  };
  
  const mapping = buttonMap[buttonText];
  if (mapping) {
    const link = page.getByTestId(mapping.testId);
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL(mapping.urlPattern);
  } else {
    const button = page.getByRole('button', { name: buttonText }).or(
      page.getByRole('link', { name: buttonText })
    ).first();
    await button.click();
    await page.waitForLoadState('networkidle');
  }
});
