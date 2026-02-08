import { test, expect } from '@playwright/test';

test.describe('Mobile UI Tests', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display hamburger menu on mobile', async ({ page }) => {
        await page.goto('/');

        // Check hamburger menu button is visible
        const menuButton = page.locator('.menu-btn');
        await expect(menuButton).toBeVisible();

        // Desktop nav should be hidden
        const desktopNav = page.locator('.desktop-nav');
        await expect(desktopNav).toBeHidden();
    });

    test('should toggle mobile menu', async ({ page }) => {
        await page.goto('/');

        // Click hamburger menu
        await page.click('.menu-btn');

        // Mobile menu should appear
        const mobileMenu = page.locator('.mobile-menu');
        await expect(mobileMenu).toBeVisible();

        // Should show navigation links
        await expect(page.locator('.mobile-link').first()).toBeVisible();

        // Click a link to close menu
        await page.click('.mobile-link:first-child');

        // Menu should close
        await expect(mobileMenu).toBeHidden();
    });

    test('should have accessible theme toggle on mobile', async ({ page }) => {
        await page.goto('/');

        // Theme toggle should be visible
        const themeToggle = page.locator('.mobile-theme-btn');
        await expect(themeToggle).toBeVisible();

        // Click to toggle theme
        await themeToggle.click();

        // Check theme changed (data-theme attribute)
        const html = page.locator('html');
        const theme = await html.getAttribute('data-theme');
        expect(theme).toBe('light');
    });

    test('should render contact form properly on mobile', async ({ page }) => {
        await page.goto('/');

        // Scroll to contact section
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Check form fields are visible
        await expect(page.locator('input[type="text"]').first()).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('textarea')).toBeVisible();
        await expect(page.locator('select')).toBeVisible();

        // Check submit button
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate form inputs have proper styling', async ({ page }) => {
        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        const input = page.locator('input[type="text"]').first();

        // Check input has background color (not white in dark mode)
        const bgColor = await input.evaluate(el =>
            window.getComputedStyle(el).backgroundColor
        );

        // Should not be pure white (rgb(255, 255, 255))
        expect(bgColor).not.toBe('rgb(255, 255, 255)');
    });

    test('should scroll through all sections', async ({ page }) => {
        await page.goto('/');

        // Check all major sections exist and are visible
        const sections = ['#experience', '#projects', '#certifications', '#skills', '#contact'];

        for (const selector of sections) {
            await page.locator(selector).scrollIntoViewIfNeeded();
            await expect(page.locator(selector)).toBeVisible();
        }
    });
});
