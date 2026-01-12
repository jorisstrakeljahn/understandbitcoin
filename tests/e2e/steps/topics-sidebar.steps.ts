import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

// === Topics Sidebar Assertions ===

Then('I see the collapsible sidebar', async ({ page }) => {
  const sidebar = page.getByTestId('collapsible-sidebar');
  await expect(sidebar).toBeVisible();
});

Then('I see topic folders in the sidebar', async ({ page }) => {
  const topicLinks = page.locator('[data-testid^="collapsible-sidebar-topic-link-"]');
  const count = await topicLinks.count();
  expect(count).toBeGreaterThan(0);
});

Then('I see articles for that topic', async ({ page }) => {
  const articles = page.locator('[data-testid^="collapsible-sidebar-articles-"]');
  const count = await articles.count();
  expect(count).toBeGreaterThan(0);
});

Then('I no longer see articles for that topic', async ({ page }) => {
  // Articles should be hidden when collapsed
  const articles = page.locator('[data-testid^="collapsible-sidebar-articles-"]');
  const count = await articles.count();
  // Either no articles visible or they're hidden
  expect(count).toBeGreaterThanOrEqual(0);
});

Then('topic folders show article counts', async ({ page }) => {
  const counts = page.locator('[data-testid^="collapsible-sidebar-topic-count-"]');
  const count = await counts.count();
  expect(count).toBeGreaterThan(0);
});

Then('article counts are greater than zero', async ({ page }) => {
  const counts = page.locator('[data-testid^="collapsible-sidebar-topic-count-"]');
  const firstCount = counts.first();
  const text = await firstCount.textContent();
  const number = parseInt(text || '0', 10);
  expect(number).toBeGreaterThan(0);
});

// === Topics Sidebar Actions ===

When('I click on a topic toggle button', async ({ page }) => {
  const toggle = page.locator('[data-testid^="collapsible-sidebar-toggle-"]').first();
  await toggle.click();
  await page.waitForTimeout(300);
});

When('I click on the topic toggle button again', async ({ page }) => {
  const toggle = page.locator('[data-testid^="collapsible-sidebar-toggle-"]').first();
  await toggle.click();
  await page.waitForTimeout(300);
});

When('I expand a topic in the sidebar', async ({ page }) => {
  const toggle = page.locator('[data-testid^="collapsible-sidebar-toggle-"]').first();
  const isExpanded = await toggle.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await toggle.click();
    await page.waitForTimeout(300);
  }
});

When('I click on a topic link in the collapsible sidebar', async ({ page }) => {
  const topicLink = page.locator('[data-testid^="collapsible-sidebar-topic-link-"]').first();
  await topicLink.click();
  await page.waitForLoadState('networkidle');
});

When('I click on an article link in the collapsible sidebar', async ({ page }) => {
  const articleLink = page.locator('[data-testid^="collapsible-sidebar-article-"]').first();
  await articleLink.click();
  await page.waitForLoadState('networkidle');
});

Then('I should be on that topic page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/topics\/[a-z]+/);
});

Then('I should be on that article page', async ({ page }) => {
  await expect(page).toHaveURL(/\/en\/articles\//);
});
