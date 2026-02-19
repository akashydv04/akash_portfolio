<!-- Copilot / AI agent instructions for the AkashPortfolio repo -->

# Quick context

This is a React + Vite portfolio site that is built and deployed as a static site served by a Cloudflare Worker. Key runtimes:

- Local dev: Vite (`npm run dev`).
- Production: Cloudflare Worker (`wrangler.json` -> `src/worker.js`) serving `./dist` via `ASSETS`.

# Important files to reference

- `package.json` — Node >= 20, scripts: `dev`, `build`, `preview`, `lint`.
- `vite.config.js` — uses `vite-plugin-javascript-obfuscator` and disables source maps for production.
- `wrangler.json` — Cloudflare worker entry (`main: src/worker.js`) and `ASSETS` binding.
- `src/worker.js` — production request handler (Cloudflare-style `fetch`), expects `POST /api/submit` as form data and uses `env.GMAIL_*`.
- `src/api/submit.js` — Node-style API handler that expects JSON body (used for server runtimes or local Node-based servers).
- `src/components/Contact.jsx` — client form implementation: converts form → JSON and POSTs to `/api/submit`.
- `src/config.js` — canonical `formEntries` keys used across client & API.
- `tests/` & `playwright.config.js` — Playwright end-to-end tests. Base URL: `http://localhost:4173`.

# What an AI coding agent should know (actionable)

- Two server implementations exist: `src/worker.js` (Cloudflare Worker, production) and `src/api/submit.js` (Node-style). Review both before changing API contract — they expect different payload shapes (`formData()` vs JSON).

- Environment variables required:
  - `GMAIL_USER`, `GMAIL_APP_PASSWORD` (both used by worker and Node handler). Optional: `GMAIL_RECEIVER`.
  - `VITE_FORM_URL` exists in repo for Google Forms fallback.

- Build and test flow (exact commands you can run):
  - Install: `npm install`
  - Dev: `npm run dev`
  - Build: `npm run build` (this removes `dist` then builds)
  - Preview (serves `dist` on port 4173 by default): `npm run preview`
  - Tests (Playwright): prefer `npx playwright test` (Playwright will run the `preview` webServer configured in `playwright.config.js`).
  - Quick full test flow (manual):
    ```bash
    npm install
    npm run build
    npm run preview &
    npx playwright test
    npx playwright show-report
    ```
  - Note: `./run-tests.sh` exists and intends to orchestrate build + tests + report, but it calls `npm test` — `package.json` currently has no `test` script. Use `npx playwright test` or add a `test` script if automating.

- Tests use these selectors and mocks frequently: `#contact`, `#name`, `#email`, `#inquiry`, `.form-message.success`. They also mock external `formResponse` endpoints via `page.route` and `page.addInitScript` — follow those patterns when modifying tests.

- Production bundles are obfuscated and sourcemaps are disabled (`vite.config.js`). Avoid relying on production sourcemaps or predictable stack traces when debugging; prefer local dev build + `vite preview` for reproduction.

- The contact form uses `src/config.js` keys (e.g., `config.formEntries.name`) — if you rename form fields, update `config.js`, `Contact.jsx`, worker, and Node API to keep the mapping consistent.

- Deploy notes: `wrangler.json` points to `src/worker.js` and binds `ASSETS` to `./dist` — the worker handles SPA routing (serves index.html on 404 for non-API requests).

# Small, concrete examples for edits

- To change email behavior in production, edit `src/worker.js` and reference credentials via `env.GMAIL_USER` / `env.GMAIL_APP_PASSWORD`.

- To change client-side form payload, edit `src/components/Contact.jsx` — it currently serializes to JSON and sets `Content-Type: application/json`.

- To run or extend tests that assert the success UI, target `.form-message.success` and ensure the preview server is running on `4173` (the Playwright config baseURL).

# When to ask the human

- If you plan to change the API contract (JSON ↔ form-data), ask which runtime should be the source of truth (Cloudflare Worker vs Node/API file).
- If you need SMTP credentials or want test email plumbing, request secure environment variables (do not hardcode secrets).

---

If you'd like, I can (A) add a `test` script that runs Playwright, (B) align the `worker.js` and `src/api/submit.js` payload parsing, or (C) add example `.env.example` with the required env vars. Which should I do next?
