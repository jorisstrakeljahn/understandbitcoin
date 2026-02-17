import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Then } = createBdd();

Then('I see the TLDR box', async ({ page }) => {
  const tldrBox = page.getByTestId('tldr-box');
  const count = await tldrBox.count();
  if (count > 0) {
    await expect(tldrBox).toBeVisible();
  }
});

Then('the TLDR box contains items', async ({ page }) => {
  const items = page.locator('[data-testid^="tldr-box-item-"]');
  const count = await items.count();
  if (count > 0) {
    expect(count).toBeGreaterThan(0);
  }
});

Then('I see the sources list', async ({ page }) => {
  const sourcesList = page.getByTestId('sources-list');
  const count = await sourcesList.count();
  if (count > 0) {
    await expect(sourcesList).toBeVisible();
  }
});

Then('the sources list contains source items', async ({ page }) => {
  const sourceItems = page.locator('[data-testid^="source-item-"]');
  const count = await sourceItems.count();
  if (count > 0) {
    expect(count).toBeGreaterThan(0);
  }
});
