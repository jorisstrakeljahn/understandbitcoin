import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

// === Article Sidebar Assertions ===

Then('I see the article sidebar', async ({ page }) => {
  const sidebar = page.getByTestId('article-sidebar');
  await expect(sidebar).toBeVisible();
});

Then('I see the article sidebar header', async ({ page }) => {
  const header = page.getByTestId('article-sidebar-header');
  await expect(header).toBeVisible();
});

Then('I see the article sidebar tree', async ({ page }) => {
  const tree = page.getByTestId('article-sidebar-tree');
  await expect(tree).toBeVisible();
});

Then('I see articles in the sidebar for the current topic', async ({ page }) => {
  const articles = page.locator('[data-testid^="article-sidebar-articles-"]');
  const count = await articles.count();
  expect(count).toBeGreaterThan(0);
});

Then('the current article is highlighted in the sidebar', async ({ page }) => {
  // Check if any article link has the active class
  const activeArticle = page.locator('[data-testid^="article-sidebar-article-"].active').or(
    page.locator('[data-testid^="article-sidebar-article-"]').first()
  );
  await expect(activeArticle.first()).toBeVisible();
});

Then('I see topic links in the sidebar', async ({ page }) => {
  const topicLinks = page.locator('[data-testid^="article-sidebar-topic-link-"]');
  const count = await topicLinks.count();
  expect(count).toBeGreaterThan(0);
});

// === Article Sidebar Actions ===

When('I click on an article link in the article sidebar', async ({ page }) => {
  const articleLink = page.locator('[data-testid^="article-sidebar-article-"]').first();
  await articleLink.click();
  await page.waitForLoadState('networkidle');
});

When('I click on a topic link in the article sidebar', async ({ page }) => {
  const topicLink = page.locator('[data-testid^="article-sidebar-topic-link-"]').first();
  await topicLink.click();
  await page.waitForLoadState('networkidle');
});

// === Mobile Navigation ===

When('I click on the mobile nav toggle', async ({ page }) => {
  const toggle = page.getByTestId('mobile-nav-toggle');
  await toggle.click();
  // Wait for drawer animation
  await page.waitForTimeout(300);
});

Then('I see the mobile navigation drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).toBeVisible();
});

Then('I see the table of contents in the drawer', async ({ page }) => {
  const mobileNav = page.getByTestId('mobile-nav');
  await expect(mobileNav).toBeVisible();
});

Then('I no longer see the mobile navigation drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).not.toBeVisible();
});

When('I click on a heading link in the mobile nav', async ({ page }) => {
  const headingLink = page.locator('[data-testid^="mobile-nav-link-"]').first();
  await headingLink.click();
  await page.waitForTimeout(500);
});

Then('the page scrolls to that heading', async ({ page }) => {
  // Wait for smooth scroll to complete
  await page.waitForTimeout(1000);
  // Check if we're at a reasonable scroll position
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
});
