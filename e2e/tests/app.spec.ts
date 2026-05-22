import { test, expect } from '@playwright/test';

test.describe('PricePulse E2E', () => {
  test('should allow a user to add a tracked product', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Ensure page loaded
    await expect(page.locator('h1')).toContainText('PricePulse');
    
    const uniqueUrl = `https://example.com/product-${Date.now()}`;
    const initialPrice = '299.99';
    const productName = 'Test Headphone E2E';

    // Fill the form
    await page.fill('input[placeholder="e.g. Sony WH-1000XM5"]', productName);
    await page.fill('input[placeholder="https://example.com/product"]', uniqueUrl);
    await page.fill('input[placeholder="299.99"]', initialPrice);
    
    // Submit
    await page.click('button:has-text("Start Tracking")');

    // Wait for the product to appear in the list
    await expect(page.locator(`text=${productName}`)).toBeVisible();
    await expect(page.locator(`text=$${initialPrice}`)).toBeVisible();
  });
});
