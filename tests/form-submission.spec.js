import { test, expect } from '@playwright/test';

test.describe('Contact Form Tests', () => {
    test('should validate form submission response', async ({ page }) => {
        // Mock the /api/submit endpoint
        await page.route('**/api/submit', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true })
            });
        });

        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Fill out the form
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'test@example.com');
        await page.fill('#company', 'Test Company');
        await page.selectOption('#inquiry', 'Full-Time Employment (Remote)');
        await page.fill('#message', 'This is a test message');

        // Listen for network request to /api/submit
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/submit') && response.status() === 200
        );

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for response
        const response = await responsePromise;

        // Verify response is JSON
        const contentType = response.headers()['content-type'];
        expect(contentType).toContain('application/json');

        // Verify response body
        const body = await response.json();
        expect(body).toHaveProperty('success', true);
    });

    test('should display success message after valid submission', async ({ page }) => {
        // Mock the /api/submit endpoint
        await page.route('**/api/submit', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true })
            });
        });

        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Fill form with valid data
        await page.fill('#name', 'Jane Doe');
        await page.fill('#email', 'jane@company.com');
        await page.selectOption('#inquiry', 'Freelance / Contract Project');
        await page.fill('#message', 'Looking for Android development help');

        // Submit
        await page.click('button[type="submit"]');

        // Wait for success message
        await expect(page.locator('.form-message.success')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('.form-message.success')).toContainText('Message Sent!');
    });

    test('should handle form validation errors', async ({ page }) => {
        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Try to submit empty form
        await page.click('button[type="submit"]');

        // Browser should show validation errors (HTML5 validation)
        const nameInput = page.locator('#name');
        const isValid = await nameInput.evaluate(el => el.validity.valid);
        expect(isValid).toBe(false);
    });

    test('should log error to console on failed submission', async ({ page }) => {
        // Listen for console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Mock the /api/submit endpoint to return an error
        await page.route('**/api/submit', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ success: false, error: 'Test error' })
            });
        });

        // Fill and submit form
        await page.fill('#name', 'Test');
        await page.fill('#email', 'test@test.com');
        await page.selectOption('#inquiry', 'Android App Consultation');
        await page.fill('#message', 'Test');
        await page.click('button[type="submit"]');

        // Wait a bit for error handling
        await page.waitForTimeout(1000);

        // Should have logged an error
        expect(consoleErrors.length).toBeGreaterThan(0);
    });
});
