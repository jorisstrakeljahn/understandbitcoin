import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

// === Footer Assertions ===

Then('I see the footer', async ({ page }) => {
  const footer = page.getByTestId('footer');
  await expect(footer).toBeVisible();
});

Then('I see the footer logo', async ({ page }) => {
  const logo = page.getByTestId('footer-logo');
  await expect(logo).toBeVisible();
});

Then('I see the footer tagline', async ({ page }) => {
  const tagline = page.getByTestId('footer-tagline');
  await expect(tagline).toBeVisible();
});

Then('I see the footer copyright', async ({ page }) => {
  const copyright = page.getByTestId('footer-copyright');
  await expect(copyright).toBeVisible();
});

Then('I see the footer links section', async ({ page }) => {
  const links = page.getByTestId('footer-links');
  await expect(links).toBeVisible();
});

Then('I see footer link groups', async ({ page }) => {
  // Check that at least one footer link group exists
  const linkGroups = page.locator('[data-testid^="footer-link-group-"]');
  const count = await linkGroups.count();
  expect(count).toBeGreaterThan(0);
  // Verify the first one is visible
  await expect(linkGroups.first()).toBeVisible();
});

Then('I see the footer disclaimer', async ({ page }) => {
  const disclaimer = page.getByTestId('footer-disclaimer');
  await expect(disclaimer).toBeVisible();
});

Then('the footer disclaimer contains {string}', async ({ page }, text: string) => {
  const disclaimer = page.getByTestId('footer-disclaimer');
  await expect(disclaimer).toContainText(text, { ignoreCase: true });
});

// === Footer Actions ===

When('I click on a footer link that contains {string}', async ({ page }, linkText: string) => {
  // Footer links use dynamic testids based on href
  // e.g. footer-link-topics, footer-link-sources
  // First scroll footer into view
  const footer = page.getByTestId('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Map link text to testid suffix
  const testIdSuffix = linkText.toLowerCase();
  const link = page.getByTestId(`footer-link-${testIdSuffix}`);
  
  // If specific testid doesn't exist, try to find by text
  const linkCount = await link.count();
  if (linkCount > 0) {
    await link.click();
  } else {
    // Fallback: find any footer link containing the text
    const fallbackLink = page.locator('[data-testid^="footer-link-"]').filter({ hasText: new RegExp(linkText, 'i') }).first();
    await fallbackLink.click();
  }
  
  await page.waitForLoadState('networkidle');
});
