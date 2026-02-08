import { test, expect } from '@playwright/test';

test.describe('Tablet UI Tests', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should display hamburger menu at 768px breakpoint', async ({ page }) => {
        await page.goto('/');

        // At exactly 768px, mobile menu should appear
        const menuButton = page.locator('.menu-btn');
        await expect(menuButton).toBeVisible();
    });

    test('should maintain layout integrity on tablet', async ({ page }) => {
        await page.goto('/');

        // Check navbar is properly positioned
        const navbar = page.locator('.navbar');
        await expect(navbar).toBeVisible();

        // Hero section should be visible
        const hero = page.locator('.hero-section');
        await expect(hero).toBeVisible();
    });

    test('should display contact form in grid layout', async ({ page }) => {
        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Form grid should be visible
        const formGrid = page.locator('.form-grid');
        await expect(formGrid).toBeVisible();

        // Check grid layout (should be 2 columns on tablet)
        const gridColumns = await formGrid.evaluate(el =>
            window.getComputedStyle(el).gridTemplateColumns
        );

        // Should have multiple columns (check if it has a space, indicating multiple values)
        // computed style returns pixels like "372px 372px"
        expect(gridColumns).toMatch(/\d+px \d+px/);
    });

    test('should toggle theme on tablet', async ({ page }) => {
        await page.goto('/');

        // Find and click theme toggle
        const themeToggle = page.locator('.mobile-theme-btn');
        await themeToggle.click();

        // Verify theme changed
        const html = page.locator('html');
        await expect(html).toHaveAttribute('data-theme', 'light');

        // Toggle back
        await themeToggle.click();
        await expect(html).toHaveAttribute('data-theme', 'dark');
    });

    test('should display project cards in responsive grid', async ({ page }) => {
        await page.goto('/');
        await page.locator('#projects').scrollIntoViewIfNeeded();

        // Check project cards are visible
        const projectCards = page.locator('.project-card');
        const count = await projectCards.count();

        expect(count).toBeGreaterThan(0);

        // First card should be visible
        await expect(projectCards.first()).toBeVisible();
    });
});
