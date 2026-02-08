import { test, expect } from '@playwright/test';

test.describe('Contact Form Tests', () => {
    test.skip('should validate form submission', async ({ page }) => {
        // Mock fetch directly to simulate no-cors response
        await page.addInitScript(() => {
            const originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                if (url.toString().includes('formResponse')) {
                    // Return a mock opaque response
                    return {
                        ok: false,
                        status: 0,
                        type: 'opaque',
                        headers: new Headers(),
                        text: () => Promise.resolve(''),
                        json: () => Promise.reject(new Error('opaque')),
                    };
                }
                return originalFetch(url, options);
            };
        });

        await page.goto('/');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Fill out the form
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'test@example.com');
        await page.fill('#company', 'Test Company');
        await page.selectOption('#inquiry', 'Full-Time Employment (Remote)');
        await page.fill('#message', 'This is a test message');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for success message
        await expect(page.locator('.form-message.success')).toBeVisible({ timeout: 5000 });
    });

    test.skip('should display success message after valid submission', async ({ page }) => {
        // Mock fetch directly
        await page.addInitScript(() => {
            const originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                if (url.toString().includes('formResponse')) {
                    return {
                        ok: false,
                        status: 0,
                        type: 'opaque',
                        headers: new Headers(),
                        text: () => Promise.resolve(''),
                        json: () => Promise.reject(new Error('opaque')),
                    };
                }
                return originalFetch(url, options);
            };
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

        // Mock the Google Forms endpoint to fail
        await page.route('**/formResponse', route => {
            route.abort('failed');
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
