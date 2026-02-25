# Seasonality campaigns – standard process

This document describes the standard process for Fever landing → static site campaigns (Mother's Day, Father's Day, Valentines, etc.). Plans are recovered from Fever's category/landing and the site stays in sync via automation.

## Pipeline (all campaigns)

1. **Fetch:** Run the fetch script with the campaign config → updates `data/<campaign>-plans.json` (e.g. `data/fever-plans-uk.json` for Mother's Day).
2. **Generate:** Run the generator with the same campaign → updates static HTML (city folders).
3. **Build:** Bundle CSS/JS if applicable (e.g. `.\scripts\build-static.ps1`).
4. **Deploy:** Same as today (Docker + Cloud Run or static host). Trigger on push to `main` runs Cloud Build.

## Adding a new campaign

1. **Create campaign config** in `data/campaigns/<slug>.json`:
   - `slug`: e.g. `mothers-day`, `fathers-day`, `valentines`.
   - `locale`: e.g. `en-GB`, `en`.
   - `domain`: site canonical domain (e.g. `https://celebratemothersday.co.uk`).
   - `feverBase`: `https://feverup.com`.
   - `feverPathTemplate`: Fever landing URL with `{city}` placeholder (e.g. `https://feverup.com/en/{city}/mothers-day`).
   - `outputDataFile`: path to the plans JSON (e.g. `data/fever-plans-uk.json` or `data/fathers-day-uk.json`).
   - `cities`: array of `{ slug, name }` (optional `feverUrl` per city).
   - `maxExperiencesPerCity`, `maxGiftCardsPerCity`: optional limits (default 24 / 12).

2. **Fetch plans:**
   ```bash
   node scripts/fetch-fever-category.js --campaign=<slug>
   # Or: CAMPAIGN=<slug> node scripts/fetch-fever-category.js
   ```
   Requires Playwright: `npx playwright install chromium`.  
   If the fetch stops before the image-enrich step (e.g. timeout), run **enrich only** (no re-scrape):  
   `node scripts/fetch-fever-category.js --campaign=<slug> --enrich-only`

3. **Generate pages:**
   ```bash
   node scripts/generate-city-pages.js --campaign=<slug>
   # Or: CAMPAIGN=<slug> node scripts/generate-city-pages.js
   ```

4. **Optional: GitHub Actions**  
   Add a workflow (or reuse `.github/workflows/sync-fever-plans.yml` with an input) that runs fetch + generate for this campaign on a schedule and commits/pushes. A push to `main` triggers the existing Cloud Build deploy.

## Mother's Day (current)

- **Config:** `data/campaigns/mothers-day.json`.
- **Plans data:** `data/fever-plans-uk.json`.
- **Fetch:** `node scripts/fetch-fever-plans.js` (wrapper that calls fetch-fever-category with campaign `mothers-day`) or `node scripts/fetch-fever-category.js --campaign=mothers-day`.
- **Generate:** `node scripts/generate-city-pages.js` (default campaign is `mothers-day`).
- **Full build (with refresh):** `.\scripts\build-static.ps1 -RefreshFever` (PowerShell).
- **Automation:** `.github/workflows/sync-fever-plans.yml` runs on a schedule (e.g. twice daily) and on `workflow_dispatch`. It runs fetch + generate, then commits and pushes; Cloud Build deploys on push to `main`.

## Exceptions (manual data)

Some cities may have no Fever landing or may use manual/curated plans (e.g. as in the old Valentines CSV or manual-data files). Document those in the campaign config or in a separate `data/campaigns/<slug>-overrides.json` and extend the generator to merge manual data when present.
