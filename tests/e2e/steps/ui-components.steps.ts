import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then, When } = createBdd();

Then('I see the drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).toBeVisible();
});

Then('I no longer see the drawer', async ({ page }) => {
  const drawer = page.getByTestId('drawer');
  await expect(drawer).not.toBeVisible();
});

When('I click on the drawer close button', async ({ page }) => {
  const closeButton = page.getByTestId('drawer-close-button');
  await closeButton.click();
  await page.waitForTimeout(300);
});
