import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show sign-in page', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('text=Sign in')).toBeVisible();
  });

  test('should navigate to sign-up page', async ({ page }) => {
    await page.goto('/sign-in');
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/.*sign-up/);
  });
});

// Note: Full auth tests require Clerk test credentials
// These are placeholder tests showing the structure

