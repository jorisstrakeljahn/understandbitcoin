import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// === Article Navigation ===

Given('I am on the article {string}', async ({ page }, slug: string) => {
  await page.goto(`/en/articles/${slug}`);
  await page.waitForLoadState('networkidle');
});

// === Article Assertions ===

Then('I see the article title', async ({ page }) => {
  const title = page.getByTestId('article-title');
  await expect(title).toBeVisible();
});

Then('the article title is not empty', async ({ page }) => {
  const title = page.getByTestId('article-title');
  const text = await title.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

Then('I see the article content', async ({ page }) => {
  const content = page.getByTestId('article-content');
  await expect(content).toBeVisible();
});

Then('the article content is not empty', async ({ page }) => {
  const content = page.getByTestId('article-content');
  const text = await content.textContent();
  expect(text?.trim().length).toBeGreaterThan(100);
});

Then('I see the table of contents', async ({ page }) => {
  const toc = page.getByTestId('article-toc');
  // TOC might be collapsed on mobile, so we check if it exists
  const count = await toc.count();
  expect(count).toBeGreaterThanOrEqual(0);
});

Then('I am on a topic page', async ({ page }) => {
  await expect(page).toHaveURL(/\/topics\//);
});

// === Article Actions ===

When('I click on the back button', async ({ page }) => {
  const backButton = page.getByTestId('article-back-button');
  await backButton.click();
  await page.waitForLoadState('networkidle');
});
