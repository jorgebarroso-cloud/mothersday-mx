/**
 * Fetch plans from Fever for any seasonality campaign (wrapper around fetch-fever-category.js).
 * Campaign is read from --campaign=<id> or CAMPAIGN env; default: mothers-day.
 * Source URLs come from data/campaigns/<id>.json (feverPathTemplate, locale).
 * Requires: npm install playwright && npx playwright install chromium
 * Run: node scripts/fetch-fever-plans.js [--campaign=mothers-day]
 *      CAMPAIGN=valentines node scripts/fetch-fever-plans.js
 */
const { runFetch, loadCampaignConfig, getCampaignId } = require('./fetch-fever-category.js');

const campaignId = getCampaignId();
const config = loadCampaignConfig(campaignId);
runFetch(config).catch((e) => {
  console.error(e);
  process.exit(1);
});
