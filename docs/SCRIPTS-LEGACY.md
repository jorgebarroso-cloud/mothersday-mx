# Scripts – Build vs legacy/verification

This repo is a **static site** (HTML/CSS/JS). The following describes which scripts are part of the build and which are legacy or one-off verification tools.

## Essential for build and deploy

- **`build-static.ps1`** – Main build: bundle CSS, minify JS, regenerate city pages, write sitemap. Run before deploy.
- **`generate-city-pages.js`** – Generates all city HTML from `data/fever-plans-uk.json` and campaign config. Called by `build-static.ps1`.
- **`fetch-fever-plans.js`** – Fetches Mother's Day plans from Fever (wrapper around `fetch-fever-category.js`). Optional; run with `build-static.ps1 -RefreshFever` or `npm run fetch-fever-plans`.
- **`fetch-fever-category.js`** – Config-driven fetcher for campaign data from Fever (used by `fetch-fever-plans.js`). Use `--campaign=<slug>` for other campaigns/countries; `--enrich-only` to fill missing plan images without re-scraping.

## Optional / utilities

- **`verify-seo-static.js`** – SEO check for this static site: robots.txt, sitemap, canonicals, unique titles, internal links, JSON-LD. Run: `node scripts/verify-seo-static.js`. Use before deploy to ensure indexability and crawlability.
- **`verify-robots-seo.js`** – Legacy: checks robots + sitemap for Next.js (public/robots.txt, middleware).
- **`verify-seo-2026.js`** – Legacy: SEO checks for Valentines (src/lib/seo).
- **`compare-cities-selectors.js`**, **`verify-city-selectors.js`** – Compare cities in sitemap vs selectors.
- **`test-nginx-config.js`** – Nginx config tests if you use Nginx to serve the static site.

## Legacy / other projects

These scripts reference **Next.js**, **Valentines**, or **celebratevalentines.com** and are **not** used by the Mother's Day UK static build. They are kept for reference or for use in other repos.

- **`verify-seo-complete-audit.js`** – Valentines/Next.js (sitemap.ts, locales).
- **`debug-all-urls-https-crawlers.js`** – References `src/app/sitemap.ts`, `public/robots.txt`, Next.js.
- **`verify-seo-url-routing.js`** – Next.js (`_next/static`, `api/public`).
- **`test-sitemap-duplicates.js`** – Reads `src/app/sitemap.ts` (Next.js).
- **`verify-absolute-urls-no-redirects.js`** – Next.js paths.
- **`verify-utm-*.js`**, **`verify-all-plans-utm.js`** – UTM verification (can be adapted for static if needed).

If you only work on the Mother's Day UK static site, you can ignore the legacy scripts and use **`build-static.ps1`** and **`generate-city-pages.js`** as the source of truth.
