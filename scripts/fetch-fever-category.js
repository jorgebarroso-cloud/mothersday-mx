/**
 * Fetch plans from a Fever category/landing for a campaign (config-driven).
 * Requires: npm install playwright && npx playwright install chromium
 * Run: node scripts/fetch-fever-category.js [--campaign=mothers-day]
 * Or: CAMPAIGN=mothers-day node scripts/fetch-fever-category.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CAMPAIGNS_DIR = path.join(ROOT, 'data', 'campaigns');

function getCampaignId() {
  const arg = process.argv.find((a) => a.startsWith('--campaign='));
  if (arg) return arg.split('=')[1];
  return process.env.CAMPAIGN || 'mothers-day';
}

function hasEnrichOnly() {
  return process.argv.includes('--enrich-only');
}

function loadCampaignConfig(campaignId) {
  const configPath = path.join(CAMPAIGNS_DIR, campaignId + '.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Campaign config not found: ' + configPath);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

async function fetchPlansForCity(page, city, config) {
  const url = (config.feverPathTemplate || '').replace(/\{city\}/g, city.slug);
  const base = config.feverBase || 'https://feverup.com';
  const categorySlug = config.slug || 'mothers-day';
  const categoryPathRegex = new RegExp('/en/[^/]+/' + categorySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/?$');

  console.log('Fetching:', url);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForSelector('a[href*="/m/"], a[href*="/en/' + city.slug + '/"]', { timeout: 15000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 2000));
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
    await new Promise((r) => setTimeout(r, 2500));
    await page.evaluate(() => { window.scrollTo(0, 0); });
    await new Promise((r) => setTimeout(r, 1500));
    await page.waitForSelector('img[src^="http"]', { timeout: 8000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 1000));
  } catch (e) {
    console.warn('Timeout or error loading', url, e.message);
    return { experiences: [], giftCards: [] };
  }

  const data = await page.evaluate(
    (opts) => {
      const base = opts.base;
      const citySlug = opts.citySlug;
      const categoryPathRegex = new RegExp(opts.categoryPathRegexSource || '');

      const experiences = [];
      const giftCards = [];
      const seenExp = new Set();
      const seenGift = new Set();

      function extractCard(a) {
        const href = (a.getAttribute('href') || '').trim();
        if (!href) return null;
        const fullUrl = a.href || (href.startsWith('http') ? href : base + (href.startsWith('/') ? href : '/' + href));
        if (!fullUrl.includes('feverup.com')) return null;
        if (fullUrl.endsWith(opts.categorySlug) || categoryPathRegex.test(fullUrl)) return null;
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
        if (name.length < 4) return null;
        if (/^(get tickets|book|see all|see more|log in|sign up|menu|search|fever|home|explore)$/i.test(name)) return null;
        let priceText = null;
        let image = null;
        const card = a.closest('article') || a.closest('[class*="card"]') || a.closest('li') || a.parentElement;
        if (card) {
          const priceEl = card.querySelector('[class*="price"], [class*="Price"], [data-testid*="price"]');
          if (priceEl) priceText = (priceEl.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
          const img = a.querySelector('img') || card.querySelector('img');
          if (img) {
            let imgSrc = (img.getAttribute('data-src') || img.getAttribute('src') || '').trim();
            if (!imgSrc && img.getAttribute('data-srcset')) {
              const raw = img.getAttribute('data-srcset').trim().split(',')[0].trim().split(/\s+/)[0];
              if (raw) imgSrc = raw;
            }
            if (!imgSrc && img.getAttribute('srcset')) {
              const raw = img.getAttribute('srcset').trim().split(',')[0].trim().split(/\s+/)[0];
              if (raw) imgSrc = raw;
            }
            if (imgSrc && !imgSrc.startsWith('data:')) image = imgSrc.startsWith('http') ? imgSrc : base + (imgSrc.startsWith('/') ? imgSrc : '/' + imgSrc);
          }
        }
        return { name, url: fullUrl, priceText: priceText || undefined, image: image || undefined };
      }

      let giftCardsContainer = null;
      const headings = Array.from(document.querySelectorAll('h2, h3, [class*="title"]'));
      for (const h of headings) {
        const text = (h.textContent || '').trim();
        if (/gift\s*cards/i.test(text)) {
          giftCardsContainer = h.closest('section') || h.closest('div[class*="section"]') || h.parentElement;
          break;
        }
      }

      const sel = 'a[href*="/m/"], a[href*="/en/' + citySlug + '/"]';
      const links = Array.from(document.querySelectorAll(sel));
      for (const a of links) {
        const card = extractCard(a);
        if (!card) continue;
        const inGiftSection = giftCardsContainer && giftCardsContainer.contains(a);
        const isGiftByName = /gift\s*card/i.test(card.name);
        if (inGiftSection || (isGiftByName && !inGiftSection)) {
          if (!card.url.includes('/m/')) continue;
          if (seenGift.has(card.url)) continue;
          seenGift.add(card.url);
          giftCards.push(card);
        } else {
          if (!card.url.includes('/m/')) continue;
          if (seenExp.has(card.url)) continue;
          seenExp.add(card.url);
          experiences.push(card);
        }
      }

      if (giftCards.length === 0 && experiences.length > 0) {
        const exp = [];
        for (const c of experiences) {
          if (/gift\s*card/i.test(c.name)) giftCards.push(c);
          else exp.push(c);
        }
        return { experiences: exp, giftCards };
      }
      return { experiences, giftCards };
    },
    {
      base,
      citySlug: city.slug,
      categorySlug,
      categoryPathRegexSource: categoryPathRegex.source
    }
  );

  return data;
}

async function fetchOgImageForPlan(page, planUrl) {
  try {
    await page.goto(planUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const ogImage = await page.evaluate(() => {
      const m = document.querySelector('meta[property="og:image"]');
      return m ? (m.getAttribute('content') || '').trim() : null;
    });
    return ogImage && ogImage.startsWith('http') ? ogImage : null;
  } catch (e) {
    return null;
  }
}

async function enrichPlansWithOgImages(page, out, config) {
  const fetchImages = config.fetchPlanImages !== false;
  if (!fetchImages) return;
  let total = 0;
  let fetched = 0;
  for (const citySlug of Object.keys(out)) {
    for (const list of ['experiences', 'giftCards', 'candlelightExperiences']) {
      for (let i = 0; i < (out[citySlug][list] || []).length; i++) {
        const plan = out[citySlug][list][i];
        if (!plan || !plan.url || plan.url.indexOf('/m/') === -1) continue;
        total++;
        if (plan.image) continue;
        const ogImage = await fetchOgImageForPlan(page, plan.url);
        if (ogImage) {
          out[citySlug][list][i].image = ogImage;
          fetched++;
        }
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }
  if (fetched) console.log('Enriched', fetched, 'plans with og:image');
}

async function runEnrichOnly(config) {
  const outputPath = path.isAbsolute(config.outputDataFile) ? config.outputDataFile : path.join(ROOT, config.outputDataFile);
  if (!fs.existsSync(outputPath)) {
    console.error('JSON not found:', outputPath, '- run fetch first.');
    process.exit(1);
  }
  const out = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  let browser;
  try {
    const { chromium } = require('playwright');
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error('Playwright not found. Install with: npm install -D playwright && npx playwright install chromium');
    process.exit(1);
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': (config.locale || 'en-GB') + ',en;q=0.9' });
  await page.setViewportSize({ width: 1280, height: 800 });
  console.log('Enriching plans without image (og:image)...');
  await enrichPlansWithOgImages(page, out, config);
  await browser.close();
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Saved (with images):', outputPath);
}

async function runFetch(config) {
  const cities = config.cities || [];
  const outputPath = path.isAbsolute(config.outputDataFile) ? config.outputDataFile : path.join(ROOT, config.outputDataFile);
  const outputDir = path.dirname(outputPath);
  const maxExp = config.maxExperiencesPerCity ?? 24;
  const maxGift = config.maxGiftCardsPerCity ?? 12;

  let browser;
  try {
    const { chromium } = require('playwright');
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error('Playwright not found. Install with: npm install -D playwright && npx playwright install chromium');
    process.exit(1);
  }

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': (config.locale || 'en-GB') + ',en;q=0.9' });
  await page.setViewportSize({ width: 1280, height: 800 });

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const out = {};
  for (const city of cities) {
    const data = await fetchPlansForCity(page, city, config);
    out[city.slug] = {
      experiences: (data.experiences || []).slice(0, maxExp),
      giftCards: (data.giftCards || []).slice(0, maxGift)
    };
    console.log(city.slug + ':', (data.experiences || []).length, 'experiences,', (data.giftCards || []).length, 'gift cards');

    if (config.feverCandlelightPathTemplate) {
      const configCandlelight = {
        ...config,
        feverPathTemplate: config.feverCandlelightPathTemplate,
        slug: 'candlelight-' + city.slug
      };
      const candlelightData = await fetchPlansForCity(page, city, configCandlelight);
      out[city.slug].candlelightExperiences = (candlelightData.experiences || []).slice(0, maxExp);
      console.log(city.slug + ': candlelight', (candlelightData.experiences || []).length, 'plans');
    }
    fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8');
  }

  const citiesWithData = Object.keys(out).filter(
    (slug) => (out[slug].experiences && out[slug].experiences.length > 0) ||
      (out[slug].giftCards && out[slug].giftCards.length > 0)
  );
  if (citiesWithData.length === 0) {
    console.warn('No plans fetched for any city; output may be empty. Check Fever URLs and network.');
    process.exitCode = 1;
  }

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Saved (raw):', outputPath);

  await enrichPlansWithOgImages(page, out, config);

  await browser.close();

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Saved (with images):', outputPath);
}

function main() {
  const campaignId = getCampaignId();
  const config = loadCampaignConfig(campaignId);
  if (hasEnrichOnly()) {
    runEnrichOnly(config).catch((e) => {
      console.error(e);
      process.exit(1);
    });
    return;
  }
  runFetch(config).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

module.exports = { runFetch, loadCampaignConfig, getCampaignId };
