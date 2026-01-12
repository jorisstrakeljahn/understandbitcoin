import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then } = createBdd();

// === Responsive Design Assertions ===

Then('I see the header navigation links', async ({ page }) => {
  const nav = page.getByTestId('header-nav');
  await expect(nav).toBeVisible();
});

Then('navigation links are horizontally arranged', async ({ page }) => {
  const nav = page.getByTestId('header-nav');
  await expect(nav).toBeVisible();
  
  const computedStyle = await nav.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return {
      display: style.display,
      flexDirection: style.flexDirection,
    };
  });
  
  // Check if navigation is horizontal (flex-row or inline or grid with row direction)
  const isHorizontal = 
    (computedStyle.display === 'flex' && 
     (computedStyle.flexDirection === 'row' || computedStyle.flexDirection === '')) ||
    (computedStyle.display === 'grid');
  
  expect(isHorizontal).toBeTruthy();
});

Then('I see the resizable sidebar', async ({ page }) => {
  const sidebar = page.getByTestId('resizable-sidebar');
  await expect(sidebar).toBeVisible();
});

Then('I can toggle the sidebar collapse', async ({ page }) => {
  const toggle = page.getByTestId('resizable-sidebar-toggle');
  await expect(toggle).toBeVisible();
  
  // Click to collapse
  await toggle.click();
  await page.waitForTimeout(300);
  
  // Click to expand
  await toggle.click();
  await page.waitForTimeout(300);
});

Then('the page layout is mobile-friendly', async ({ page }) => {
  // Check viewport meta tag
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('width=device-width');
});

Then('touch targets are appropriately sized', async ({ page }) => {
  // Check that buttons have minimum touch target size (44x44px recommended)
  const buttons = page.getByRole('button');
  const count = await buttons.count();
  
  if (count > 0) {
    const firstButton = buttons.first();
    const box = await firstButton.boundingBox();
    if (box) {
      // Check minimum size (at least 24x24px, ideally 44x44px)
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
  }
});
