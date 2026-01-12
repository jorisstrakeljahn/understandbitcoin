import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

// === Mobile Navigation Assertions ===

Then('I see the mobile navigation menu', async ({ page }) => {
  // Check for drawer or mobile menu
  const drawer = page.getByTestId('drawer');
  const nav = page.getByRole('navigation');
  await expect(drawer.or(nav).first()).toBeVisible();
});

Then('I no longer see the mobile navigation menu', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).not.toBeVisible();
});

Then('I can type in the modal search field', async ({ page }) => {
  const searchInput = page.getByTestId('search-modal-input');
  await searchInput.fill('test');
  const value = await searchInput.inputValue();
  expect(value).toBe('test');
  // Clear for next test
  await searchInput.clear();
});

// === Mobile Navigation Actions ===

When('I click on the hamburger menu button', async ({ page }) => {
  // Use the specific testid for mobile menu button
  const hamburger = page.getByTestId('mobile-menu-button');
  await hamburger.click();
  await page.waitForTimeout(300);
});

When('I click on {string} in the mobile menu', async ({ page }, linkText: string) => {
  const link = page.getByRole('link', { name: linkText }).or(
    page.getByText(linkText)
  );
  await link.first().click();
  await page.waitForLoadState('networkidle');
});

When('I click on a navigation link in the mobile menu', async ({ page }) => {
  const link = page.locator('[data-testid^="header-nav-"]').or(
    page.getByRole('link').filter({ hasText: /topics|criticism|sources/i })
  ).first();
  await link.click();
  await page.waitForLoadState('networkidle');
});
