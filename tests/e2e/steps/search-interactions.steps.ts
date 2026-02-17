import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When } = createBdd();

When('I press {string} key', async ({ page }, key: string) => {
  const keyMap: Record<string, string> = {
    'ArrowDown': 'ArrowDown',
    'Enter': 'Enter',
    'Escape': 'Escape',
  };
  
  const keyToPress = keyMap[key] || key;
  await page.keyboard.press(keyToPress);
  await page.waitForTimeout(200);
});
