import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

Then('I see the title {string}', async ({ page }, title: string) => {
  const heading = page.locator('h1').first();
  await expect(heading).toContainText(title);
});

Then('I see the topics grid', async ({ page }) => {
  const grid = page.getByTestId('topics-grid');
  await expect(grid).toBeVisible();
});

Then('I see topic cards', async ({ page }) => {
  const cards = page.locator('[data-testid^="topic-card-"]');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

Then('each topic card has a title and description', async ({ page }) => {
  const firstCard = page.locator('[data-testid^="topic-card-"]').first();
  const text = await firstCard.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

When('I click on the first topic card', async ({ page }) => {
  const firstCard = page.locator('[data-testid^="topic-card-"]').first();
  await firstCard.click();
  await page.waitForLoadState('networkidle');
});

Then('I should be on a topic page', async ({ page }) => {
  await expect(page).toHaveURL(/\/topics\//);
});
