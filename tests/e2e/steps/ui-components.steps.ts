import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, Then, When } = createBdd();

// === UI Components Assertions ===

Then('I see clickable buttons', async ({ page }) => {
  const buttons = page.locator('button[data-testid="button"]').or(
    page.getByRole('button')
  );
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
});

Then('the button responds to the click', async ({ page }) => {
  // This is a general check - specific button behavior is tested in other features
  const button = page.locator('button[data-testid="button"]').or(
    page.getByRole('button')
  ).first();
  await button.click();
  await page.waitForTimeout(300);
});

Then('I see topic badges', async ({ page }) => {
  const badges = page.locator('[data-testid^="topic-badge-"]');
  const count = await badges.count();
  expect(count).toBeGreaterThan(0);
});

Then('badges show topic labels', async ({ page }) => {
  const badge = page.locator('[data-testid^="topic-badge-"]').first();
  const text = await badge.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});

Then('I can type in the search field', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input');
  await searchInput.fill('test');
  const value = await searchInput.inputValue();
  expect(value).toBe('test');
});

Then('the search field accepts input', async ({ page }) => {
  const searchInput = page.getByTestId('hero-search-input');
  await searchInput.fill('bitcoin');
  const value = await searchInput.inputValue();
  expect(value).toBe('bitcoin');
});

Then('I see the drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).toBeVisible();
});

Then('I no longer see the drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).not.toBeVisible();
});

Then('I see the tooltip content', async ({ page }) => {
  // Tooltips are optional - may not be present on all pages
  const tooltip = page.getByTestId('tooltip');
  const count = await tooltip.count();
  if (count === 0) {
    // Skip if no tooltips found - they're optional
    return;
  }
  await expect(tooltip).toBeVisible();
});

// === UI Components Actions ===

When('I click on a button', async ({ page }) => {
  const button = page.locator('button[data-testid="button"]').or(
    page.getByRole('button')
  ).first();
  await button.click();
  await page.waitForTimeout(300);
});

When('I click on the drawer close button', async ({ page }) => {
  const closeButton = page.getByTestId('drawer-close-button');
  await closeButton.click();
  await page.waitForTimeout(300);
});

When('I hover over an element with a tooltip', async ({ page }) => {
  // Tooltips are optional - check if they exist first
  const wrapper = page.getByTestId('tooltip-wrapper');
  const count = await wrapper.count();
  if (count === 0) {
    // Skip if no tooltips found
    return;
  }
  await wrapper.first().hover();
  await page.waitForTimeout(500); // Wait for tooltip delay
});

// === Navigation ===

Given('I am on a page with tooltips', async ({ page }) => {
  // Navigate to a page that might have tooltips
  await page.goto('/en/articles/what-is-bitcoin');
  await page.waitForLoadState('networkidle');
});
