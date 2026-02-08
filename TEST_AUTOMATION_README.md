# Test Automation (Optional - For Developers)

The test files are included in the repository, but Playwright is **not installed by default** to keep production builds lean.

## Setup Testing (One-Time)

If you want to run automated tests locally:

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Add test scripts back to package.json (or run directly with npx)
```

## Running Tests

After installing Playwright:

```bash
# Run all tests
npx playwright test

# Interactive UI mode
npx playwright test --ui

# Specific test files
npx playwright test tests/mobile-ui.spec.js
npx playwright test tests/tablet-ui.spec.js
npx playwright test tests/form-submission.spec.js

# View report
npx playwright show-report
```

## Quick Test Script  

Use the included helper script:

```bash
./run-tests.sh
```

This will:
1. Stop old preview servers
2. Build fresh code
3. Run all tests
4. Open the HTML report

## Test Files

- `tests/mobile-ui.spec.js` - Mobile viewport tests (6 tests)
- `tests/tablet-ui.spec.js` - Tablet viewport tests (5 tests)  
- `tests/form-submission.spec.js` - Form functionality tests (4 tests)

**Total: 60 test cases** across 4 device profiles (Mobile Chrome, Mobile Safari, iPadPro, Desktop Chrome)

## Manual Testing Alternative

You don't need Playwright for basic testing. Use browser DevTools:

1. Open http://localhost:4173 (after running `npm run preview`)
2. Press **F12** to open DevTools
3. Click **Device Toolbar** (Cmd+Shift+M on Mac)
4. Select device size (iPhone 12, iPad Pro, etc.)
5. Test the UI manually

## Why Playwright is Optional

- **Production builds don't need it** - Reduces deployment size and avoids dependency conflicts
- **Local testing only** - Playwright is for development/QA, not runtime
- **Large package** - Playwright + browsers = ~500MB
- **CI/CD flexibility** - Can use different tools in CI pipeline

## CI/CD Integration

For automated testing in CI/CD, add this to your workflow:

```yaml
# Example GitHub Actions
- name: Install Playwright
  run: npm install -D @playwright/test && npx playwright install
  
- name: Run tests
  run: npx playwright test
```

## What's Tested

### Mobile UI (6 tests)
- ✅ Hamburger menu visibility on mobile
- ✅ Mobile menu toggle functionality
- ✅ Theme toggle accessibility
- ✅ Contact form rendering
- ✅ Input field styling validation
- ✅ Section scrolling

### Tablet UI (5 tests)
- ✅ Hamburger menu at 768px breakpoint
- ✅ Layout integrity on tablet
- ✅ Form grid layout (2-column)
- ✅ Theme switching
- ✅ Project cards responsive grid

### Form Submission (4 tests)
- ✅ JSON response validation
- ✅ Success message display
- ✅ HTML5 form validation
- ✅ Error logging on failures
