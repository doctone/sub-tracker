import { test, expect } from '@playwright/test';

test.describe('Sub Tracker App', () => {
  test('should load the homepage and display correct content', async ({ page }) => {
    await page.goto('/');

    // Check that the title is correct
    await expect(page).toHaveTitle(/Sub Tracker/);

    // Check for the main heading
    await expect(page.getByRole('heading', { name: 'Sub Tracker' })).toBeVisible();

    // Check for the subtitle
    await expect(page.getByText('Track your subscriptions by connecting to YNAB')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();

    // When not authenticated, should show YNAB auth component
    await expect(page.getByText(/connect.*YNAB/i)).toBeVisible();
  });

  test('should navigate to privacy policy page', async ({ page }) => {
    await page.goto('/');

    // Click on Privacy Policy link
    await page.getByRole('link', { name: 'Privacy Policy' }).click();

    // Should navigate to privacy policy page
    await expect(page).toHaveURL('/policy');

    // Check for privacy policy content
    await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeVisible();
  });

  test('should navigate back to home from privacy policy', async ({ page }) => {
    await page.goto('/policy');

    // Click on Home link
    await page.getByRole('link', { name: 'Home' }).click();

    // Should navigate back to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Sub Tracker' })).toBeVisible();
  });
});