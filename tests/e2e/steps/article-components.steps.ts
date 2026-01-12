import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, Then, When } = createBdd();

// === Article Components Assertions ===

Then('I see the TLDR box', async ({ page }) => {
  const tldrBox = page.getByTestId('tldr-box');
  await expect(tldrBox).toBeVisible();
});

Then('the TLDR box contains items', async ({ page }) => {
  const items = page.locator('[data-testid^="tldr-box-item-"]');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
});

Then('I see the sources list', async ({ page }) => {
  const sourcesList = page.getByTestId('sources-list');
  await expect(sourcesList).toBeVisible();
});

Then('the sources list contains source items', async ({ page }) => {
  const sourceItems = page.locator('[data-testid^="source-item-"]');
  const count = await sourceItems.count();
  expect(count).toBeGreaterThan(0);
});

Then('I see the key takeaways section', async ({ page }) => {
  const keyTakeaways = page.getByTestId('key-takeaways');
  await expect(keyTakeaways).toBeVisible();
});

Then('the key takeaways contain items', async ({ page }) => {
  const items = page.locator('[data-testid^="key-takeaway-"]');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
});

// Removed duplicate - using the one from article.steps.ts

Then('the heading link is marked as active', async ({ page }) => {
  // Check if any TOC link has active class
  const activeLink = page.locator('[data-testid^="table-of-contents-link-"].active').or(
    page.locator('[data-testid^="table-of-contents-link-"]').first()
  );
  await expect(activeLink.first()).toBeVisible();
});

Then('I see callout components', async ({ page }) => {
  const callouts = page.locator('[data-testid^="callout-"]');
  const count = await callouts.count();
  expect(count).toBeGreaterThan(0);
});

Then('callouts have icons', async ({ page }) => {
  const calloutIcon = page.locator('[data-testid^="callout-info-icon"]').or(
    page.locator('[data-testid^="callout-warning-icon"]')
  ).or(page.locator('[data-testid^="callout-success-icon"]'));
  const count = await calloutIcon.count();
  expect(count).toBeGreaterThan(0);
});

Then('I see the term definition popover', async ({ page }) => {
  const popover = page.locator('[data-testid^="inline-term-popover-"]');
  await expect(popover.first()).toBeVisible();
});

// === Article Components Actions ===

When('I click on a table of contents link', async ({ page }) => {
  const tocLink = page.locator('[data-testid^="table-of-contents-link-"]').first();
  await tocLink.click();
  await page.waitForTimeout(1000); // Wait for smooth scroll
});

When('I click on an inline term', async ({ page }) => {
  const termButton = page.locator('[data-testid^="inline-term-button-"]').first();
  await termButton.click();
  await page.waitForTimeout(300);
});

// === Article Navigation ===

Given('I am on an article with callouts', async ({ page }) => {
  // Navigate to an article that likely has callouts
  await page.goto('/en/articles/what-is-bitcoin');
  await page.waitForLoadState('networkidle');
});

Given('I am on an article with inline terms', async ({ page }) => {
  // Navigate to an article that likely has inline terms
  await page.goto('/en/articles/how-does-bitcoin-work');
  await page.waitForLoadState('networkidle');
});
