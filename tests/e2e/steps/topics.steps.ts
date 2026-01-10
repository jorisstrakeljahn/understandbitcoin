import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Topics Page Navigation ===

Given('I am on the topic {string}', async ({ page }, topic: string) => {
  await page.goto(`/en/topics/${topic}`);
  await page.waitForLoadState('networkidle');
});

// === Topics Overview Assertions ===

Then('I see the topics grid', async ({ page }) => {
  const grid = page.getByTestId('topics-grid');
  await expect(grid).toBeVisible();
});

Then('I see at least {int} topic cards', async ({ page }, count: number) => {
  const cards = page.locator('[data-testid^="topic-card-"]');
  await expect(cards).toHaveCount({ minimum: count });
});

// === Topic Detail Assertions ===

Then('I see the topic title', async ({ page }) => {
  const title = page.getByTestId('topic-title');
  await expect(title).toBeVisible();
});

Then('the topic title is not empty', async ({ page }) => {
  const title = page.getByTestId('topic-title');
  const text = await title.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

Then('I see the topic articles', async ({ page }) => {
  const articles = page.getByTestId('topic-articles');
  await expect(articles).toBeVisible();
});

Then('I see at least {int} article', async ({ page }, count: number) => {
  const articles = page.locator('[class*="articleItem"]');
  await expect(articles).toHaveCount({ minimum: count });
});

Then('I see the topic breadcrumb', async ({ page }) => {
  const breadcrumb = page.getByTestId('topic-breadcrumb');
  await expect(breadcrumb).toBeVisible();
});

Then('I should be on a topic detail page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/topics\/[a-z]+/);
});

// === Topics Actions ===

When('I click on a topic card', async ({ page }) => {
  const card = page.locator('[data-testid^="topic-card-"]').first();
  await card.click();
  await page.waitForLoadState('networkidle');
});

When('I click on the first article', async ({ page }) => {
  const article = page.locator('[class*="articleItem"]').first();
  await article.click();
  await page.waitForLoadState('networkidle');
});
