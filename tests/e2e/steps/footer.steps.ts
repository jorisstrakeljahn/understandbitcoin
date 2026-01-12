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
  const learnGroup = page.getByTestId('footer-link-group-learn');
  const topicsGroup = page.getByTestId('footer-link-group-topics');
  const aboutGroup = page.getByTestId('footer-link-group-about');
  
  await expect(learnGroup.or(topicsGroup).or(aboutGroup)).toBeVisible();
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
  const link = page.locator(`[data-testid^="footer-link-"]`).filter({ hasText: linkText });
  await link.first().click();
  await page.waitForLoadState('networkidle');
});
