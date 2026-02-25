/**
 * Generate static HTML city pages for a campaign (config-driven).
 * Run: node scripts/generate-city-pages.js [--campaign=mothers-day]
 * Or: CAMPAIGN=mothers-day node scripts/generate-city-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'uk-cities.json');
const CAMPAIGNS_DIR = path.join(ROOT, 'data', 'campaigns');

let FEVER_PLANS_PATH = path.join(ROOT, 'data', 'fever-plans-uk.json');
let DOMAIN = 'https://celebratemothersday.co.uk';

/** Easter Sunday (Gregorian) for given year. Returns Date at noon UTC. */
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Mother's Day UK = 4th Sunday of Lent = 2 weeks before Easter (Mothering Sunday). */
function getMothersDayUK(year) {
  const easter = getEasterSunday(year);
  const d = new Date(easter);
  d.setDate(d.getDate() - 14);
  return d;
}

/** Days from today until next Mother's Day UK (this year or next if already passed). */
function getDaysUntilMothersDayUK() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let md = getMothersDayUK(today.getFullYear());
  if (md < today) md = getMothersDayUK(today.getFullYear() + 1);
  md.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((md - today) / (24 * 60 * 60 * 1000)));
}

/** Days from today until next Valentine's Day (14 Feb). */
function getDaysUntilValentines() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let v = new Date(today.getFullYear(), 1, 14);
  if (v < today) v = new Date(today.getFullYear() + 1, 1, 14);
  v.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((v - today) / (24 * 60 * 60 * 1000)));
}

/**
 * Get countdown days for campaign (any seasonality/country). Returns number or null if no countdown.
 * countdownType: "mothers-day-uk" | "valentines" | "none" (or omit)
 */
function getCountdownDays(config) {
  const t = (config && config.countdownType) || 'mothers-day-uk';
  if (t === 'none' || t === false) return null;
  if (t === 'valentines') return getDaysUntilValentines();
  if (t === 'mothers-day-uk') return getDaysUntilMothersDayUK();
  return null;
}

/**
 * Build copy/labels from campaign config for any seasonality and locale. Defaults for backward compat.
 */
function buildCampaignCopy(config) {
  const copy = config.copy || {};
  return {
    campaignName: config.campaignName || "Mother's Day",
    countryLabel: config.countryLabel || 'UK',
    siteName: config.siteName || "Celebrate Mother's Day",
    locale: config.locale || 'en-GB',
    copy: {
      countdownMessage: copy.countdownMessage || "Hurry! {campaignName} is in {days} days.",
      heroCta: copy.heroCta || 'See {campaignName} experiences',
      seeAllOnFever: copy.seeAllOnFever || 'See all on Fever',
      breadcrumbHome: copy.breadcrumbHome != null ? copy.breadcrumbHome : (config.countryLabel || 'UK'),
      heroTitleHome: copy.heroTitleHome || 'Unforgettable {campaignName} 2026: Gifts, Ideas & Experiences',
      heroTitleCity: copy.heroTitleCity || 'Unforgettable {campaignName} in {city}: Gifts, Ideas & Experiences',
      heroImageAltHome: copy.heroImageAltHome || "Mother and daughter laughing having afternoon tea in a garden, Mother's Day experience gift",
      heroImageAltCity: copy.heroImageAltCity || "Mother and daughter laughing having afternoon tea in a garden, Mother's Day {city} experience gift",
      heroImageAltSubpage: copy.heroImageAltSubpage || "Mother and daughter laughing having afternoon tea in a garden, Mother's Day {topic} in {city} experience gift"
    }
  };
}

/**
 * @typedef {{ name: string, url?: string, priceText?: string, image?: string }} FeverPlan
 * @typedef {{ experiences: FeverPlan[], giftCards: FeverPlan[], candlelightExperiences?: FeverPlan[] }} CityPlans
 * @typedef {{ [citySlug: string]: CityPlans }} FeverPlansData
 */

function getCampaignId() {
  const arg = process.argv.find((a) => a.startsWith('--campaign='));
  if (arg) return arg.split('=')[1];
  return process.env.CAMPAIGN || 'mothers-day';
}

function loadCampaignConfig(campaignId) {
  const configPath = path.join(CAMPAIGNS_DIR, campaignId + '.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Campaign config not found: ' + configPath);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Logo and favicon path (light green SVG, same as home images/logo.svg)
const LOGO_PATH = 'images/logo.svg';

// Fallback when fever-plans-uk.json is missing or empty (link to city listing)
const TOP_PICKS_FALLBACK = [
  { name: 'Afternoon Tea & Dining', url: null, priceText: 'See on Fever' },
  { name: 'Candlelight Concerts', url: null, priceText: 'See on Fever' },
  { name: 'Experience Gifts', url: null, priceText: 'See on Fever' }
];

// Fallback Gift Cards cuando no hay datos de Fever (solo nombres y precio genérico)
const GIFT_CARDS_FALLBACK = [
  { name: 'Candlelight Gift Card', priceText: 'From £25.00' },
  { name: 'Ballet of Lights - Gift Card', priceText: 'From £30.00' },
  { name: 'Experience Gifts - Gift Card', priceText: 'From £30.00' },
  { name: 'Themed Gift Cards', priceText: 'From £25.00' }
];

/**
 * Load Fever plans JSON. Returns object keyed by city slug with { experiences, giftCards, candlelightExperiences }.
 * @returns {FeverPlansData}
 */
function loadFeverPlans() {
  try {
    if (fs.existsSync(FEVER_PLANS_PATH)) {
      const data = JSON.parse(fs.readFileSync(FEVER_PLANS_PATH, 'utf8'));
      if (data && typeof data === 'object' && !Array.isArray(data)) return data;
      console.warn('Fever plans invalid structure: expected object keyed by city slug');
    } else {
      console.warn('Fever plans missing:', FEVER_PLANS_PATH);
    }
  } catch (e) {
    console.warn('Fever plans invalid or unreadable:', FEVER_PLANS_PATH, e.message);
  }
  return {};
}

/** Normaliza datos por ciudad: soporta formato antiguo (array) y nuevo ({ experiences, giftCards, candlelightExperiences }). */
function getCityPlans(feverPlans, citySlug) {
  const raw = feverPlans[citySlug];
  if (!raw) return { experiences: [], giftCards: [], candlelightExperiences: [] };
  if (Array.isArray(raw)) return { experiences: raw, giftCards: [], candlelightExperiences: [] };
  return {
    experiences: raw.experiences || [],
    giftCards: raw.giftCards || [],
    candlelightExperiences: raw.candlelightExperiences || []
  };
}

/** Meses para calcular días en rango (año no disponible, se usa mes relativo). */
const MONTH_DAYS = { Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31 };
const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthToDays(mon) {
  const i = MONTH_ORDER.indexOf(mon);
  return i >= 0 ? i * 31 : 0;
}

/** Aproximación de días entre "DD Mon" y "DD Mon" (sin año). */
function approxDaysBetween(d1, mon1, d2, mon2) {
  const start = monthToDays(mon1) + (d1 | 0);
  const end = monthToDays(mon2) + (d2 | 0);
  return Math.abs(end - start);
}

/**
 * Clasifica planes en events, experiences e ideas según heurísticas sobre name/priceText.
 * - Events: fecha única ("DD Mon From") o rango corto (≤45 días).
 * - Experiences: rango largo o sin fecha reconocible.
 * - Ideas: giftCards + planes "idea de regalo" (Gift, Package) o selección curada.
 * Un mismo plan puede estar en events y experiences.
 */
function classifyPlans(experiences, giftCards, candlelightExperiences) {
  const events = [];
  const experiencesList = [];
  const ideas = [...(giftCards || [])];

  const singleDateRe = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+From/i;
  const rangeRe = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*-\s*(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
  const openRangeRe = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*-\s*(?=\s|From|$)/i;
  const SHORT_RANGE_DAYS = 45;

  for (const p of experiences || []) {
    if (!p || !p.name) continue;
    const text = (p.name + ' ' + (p.priceText || '')).trim();
    const rangeMatch = text.match(rangeRe);
    const openMatch = text.match(openRangeRe);
    const singleMatch = !rangeMatch ? text.match(singleDateRe) : null;

    let isEvent = false;
    let isExperience = false;
    if (singleMatch) {
      isEvent = true;
    } else if (rangeMatch) {
      const days = approxDaysBetween(
        parseInt(rangeMatch[1], 10), rangeMatch[2],
        parseInt(rangeMatch[3], 10), rangeMatch[4]
      );
      if (days <= SHORT_RANGE_DAYS) {
        isEvent = true;
        isExperience = true;
      } else {
        isExperience = true;
      }
    } else if (openMatch) {
      isExperience = true;
    } else {
      isExperience = true;
    }

    if (isEvent) events.push(p);
    if (isExperience) experiencesList.push(p);
  }

  for (const p of experiences || []) {
    if (!p || !p.name) continue;
    const name = p.name.toLowerCase();
    const isGiftLike = /gift|package|experience\s*gift/i.test(name);
    if (isGiftLike && !ideas.some((i) => i.url === p.url && i.name === p.name)) ideas.push(p);
  }
  const ideaUrls = new Set(ideas.map((i) => i.url || i.name));
  let added = 0;
  const maxIdeasExtra = 8;
  for (const p of experiences || []) {
    if (!p || !p.name || ideaUrls.has(p.url) || ideaUrls.has(p.name)) continue;
    if (added >= maxIdeasExtra) break;
    ideas.push(p);
    ideaUrls.add(p.url || p.name);
    added++;
  }

  return { events, experiences: experiencesList, ideas };
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJson(s) {
  if (!s) return '';
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

/** Build ItemList JSON-LD for plans (experiences/events). Items need name and url. */
function buildItemListLdJson(name, slug, items, listName) {
  if (!items || items.length === 0) return '';
  const itemListElement = items.map((item, i) => {
    const url = (item.url && item.url.startsWith('http')) ? item.url : '';
    return '{"@type":"ListItem","position":' + (i + 1) + ',"name":"' + escapeJson(item.name || '') + '"' + (url ? ',"url":"' + escapeJson(url) + '"' : '') + '}';
  }).join(',');
  const ld = '{"@context":"https://schema.org","@type":"ItemList","name":"' + escapeJson(listName) + '","numberOfItems":' + items.length + ',"itemListElement":[' + itemListElement + ']}';
  return '\n  <script type="application/ld+json">\n  ' + ld + '\n  </script>';
}

/** Build CollectionPage JSON-LD for city pages (reinforces event listing page signal). */
function buildCollectionPageLdJson(name, canonical, description, campaignName) {
  const cn = campaignName || "Mother's Day";
  const ld = '{"@context":"https://schema.org","@type":"CollectionPage","name":"' + escapeJson(cn) + ' events and experiences in ' + escapeJson(name) + '","url":"' + escapeJson(canonical) + '","description":"' + escapeJson(description || '') + '"}';
  return '\n  <script type="application/ld+json">\n  ' + ld + '\n  </script>';
}

function layout(opts) {
  const { pageTitle, metaDescription, keywords, canonical, mainContent, assetDepth, city, cities, stickyCtaUrl, stickyCtaText, breadcrumbList, itemListLdJson, heroPreloadUrl, countdownDays, campaignCopy } = opts;
  const name = city.name;
  const slug = city.slug;
  const copy = campaignCopy || buildCampaignCopy({});
  const hasCountdown = countdownDays != null && typeof countdownDays === 'number';
  const countdownBarHtml = hasCountdown
    ? `<div class="top-bar" role="complementary" aria-label="Limited availability notice">
    <p class="top-bar__text">Hurry! ${escapeHtml(copy.campaignName)} is in <span id="countdown-live" aria-live="polite">—</span></p>
  </div>
  `
    : '';
  const footerCityLinks = (cities && cities.length > 0)
    ? cities.map((c) => `<a href="/${c.slug}/" title="${escapeHtml(copy.campaignName)} ${escapeHtml(c.name)} — ideas, gifts and things to do">${escapeHtml(copy.campaignName)} ${escapeHtml(c.name)}</a>`).join('\n            ')
    : '';
  const stickyCtaHtml = (stickyCtaUrl && stickyCtaText) ? `
  <div class="sticky-cta sticky-cta--city" aria-label="Book on Fever">
    <a href="${escapeHtml(stickyCtaUrl)}" class="sticky-cta__button cta-button" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(stickyCtaText)}">${escapeHtml(stickyCtaText)}</a>
  </div>` : '';
  const breadcrumbLdJson = (breadcrumbList && breadcrumbList.length > 0) ? `
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${breadcrumbList.map((item, i) => `{"@type":"ListItem","position":${i + 1},"name":"${escapeJson(item.name)}","item":"${escapeJson(item.item || item.url || '')}"}`).join(',')}]}
  </script>` : '';
  const htmlLang = (copy.locale || 'en-GB').replace(/_/g, '-');
  const ogLocale = (copy.locale || 'en_GB').replace(/-/g, '_');
  const siteNameFull = copy.siteName + (copy.countryLabel ? ' ' + copy.countryLabel : '');
  return `<!DOCTYPE html>
<html lang="${escapeHtml(htmlLang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <link rel="canonical" href="${canonical}">
  <link rel="dns-prefetch" href="https://feverup.com">
  <link rel="dns-prefetch" href="https://applications-media.feverup.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Lato:wght@400;600;700&display=optional" rel="stylesheet">
  <link rel="preload" href="${assetDepth}css/bundle.min.css" as="style">
  ${heroPreloadUrl ? `<link rel="preload" href="${escapeHtml(heroPreloadUrl)}" as="image">` : ''}
  <link rel="stylesheet" href="${assetDepth}css/bundle.min.css">
  <link rel="icon" type="image/svg+xml" href="${assetDepth}${LOGO_PATH}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:image" content="${DOMAIN}/images/${slug}.png">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${escapeHtml(ogLocale)}">
  <meta property="og:site_name" content="${escapeHtml(siteNameFull)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <meta name="twitter:image" content="${DOMAIN}/images/${slug}.png">
  <meta name="theme-color" content="#3d7a5a">${breadcrumbLdJson}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${countdownBarHtml}
  <header class="site-header" id="site-header" role="banner">
    <div class="container site-header__inner">
      <a href="/" class="site-header__logo" aria-label="${escapeHtml(copy.siteName)} home">
        <img src="${assetDepth}${LOGO_PATH}" alt="" class="site-header__logo-img" width="36" height="36">
        <span class="site-header__logo-text">${escapeHtml(copy.siteName)}</span>
      </a>
      <nav class="site-header__nav" aria-label="Main navigation">
        <a href="/">Home</a>
        ${stickyCtaUrl && stickyCtaText ? `<a href="${escapeHtml(stickyCtaUrl)}" class="site-header__cta cta-button" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(stickyCtaText)}">${escapeHtml(stickyCtaText)}</a>` : ''}
      </nav>
    </div>
  </header>

  <main id="main-content" role="main">
    ${mainContent}
  </main>
${stickyCtaHtml}

  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="site-footer__top">
        <a href="/" class="site-footer__brand" aria-label="${escapeHtml(copy.siteName)} home">
          <img src="${assetDepth}${LOGO_PATH}" alt="" class="site-footer__logo" width="40" height="40">
          <span class="site-footer__name">${escapeHtml(copy.siteName)}</span>
        </a>
        <nav class="site-footer__nav" aria-label="Footer navigation">
          <div class="site-footer__col">
            <span class="site-footer__label">Cities</span>
            ${footerCityLinks}
          </div>
          <div class="site-footer__col">
            <span class="site-footer__label">Legal</span>
            <a href="/legal/cookies.html">Cookie Policy</a>
          </div>
        </nav>
      </div>
      <div class="site-footer__bottom">
        <p class="site-footer__copy">&copy; 2026 ${escapeHtml(copy.siteName)}. Operated by Fever Up Entertainment.</p>
      </div>
    </div>
  </footer>

  <div id="cookie-consent-banner" class="cookie-banner cookie-banner--hidden" role="dialog" aria-label="Cookie consent">
    <div class="cookie-banner__inner">
      <p class="cookie-banner__text">We use cookies to measure site usage. <a href="/legal/cookies.html">Cookie Policy</a></p>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn cookie-banner__btn--reject">Reject</button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--accept cta-button">Accept</button>
      </div>
    </div>
  </div>

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"LocalBusiness","name":"Mother's Day ${escapeHtml(name)} | Celebrate Mother's Day UK","url":"${canonical}","description":"Mother's Day ${escapeHtml(name)}: gift ideas, things to do and experiences for Mum. Afternoon tea, Candlelight concerts & events. Book on Fever.","image":"${DOMAIN}/images/${slug}.png","address":{"@type":"PostalAddress","addressLocality":"${escapeHtml(name)}","addressCountry":"GB"},"areaServed":{"@type":"City","name":"${escapeHtml(name)}"}}
  </script>${buildCollectionPageLdJson(name, canonical, metaDescription)}${itemListLdJson || ''}
  <script src="${assetDepth}js/glide.min.js" defer></script>
  <script src="${assetDepth}js/main.min.js" defer></script>
</body>
</html>
`;
}

/** Separa precio y valoración cuando priceText termina en " X.X" (ej. "From £22.05 4.8" → price + rating). */
function parsePriceAndRating(priceText) {
  if (!priceText || typeof priceText !== 'string') return { price: priceText || '', rating: null };
  const trimmed = priceText.trim();
  const ratingMatch = trimmed.match(/\s+(\d\.\d)\s*$/);
  if (ratingMatch) {
    return {
      price: trimmed.slice(0, -ratingMatch[0].length).trim(),
      rating: ratingMatch[1]
    };
  }
  return { price: trimmed, rating: null };
}

function planCardHtml(pick, opts) {
  const { url, priceText, imgSrc, imgAlt, title, badge, ctaText } = opts;
  const { price, rating } = parsePriceAndRating(priceText);
  const ratingHtml = rating
    ? `<span class="pick-card__rating" aria-label="Rating ${rating} out of 5">★ ${rating}</span>`
    : '';
  return `
    <article class="pick-card">
      <a href="${escapeHtml(url)}" class="pick-card__link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(pick.name)} — Get tickets on Fever">
        <span class="pick-card__img-wrap">
          <img src="${escapeHtml(imgSrc)}" alt="${imgAlt}" width="400" height="300" loading="lazy" class="pick-card__img">
        </span>
        <div class="pick-card__body">
          <span class="pick-card__badge">${escapeHtml(badge)}</span>
          <h3 class="pick-card__title">${escapeHtml(title || pick.name)}</h3>
          <span class="pick-card__price">${escapeHtml(price)}</span>${ratingHtml ? '\n          ' + ratingHtml : ''}
          <span class="pick-card__cta cta-button cta-button--card">${escapeHtml(ctaText || 'Get Tickets →')}</span>
        </div>
      </a>
    </article>`;
}

function cityMainPage(city, feverPlans, cities, campaignConfig) {
  const copy = buildCampaignCopy(campaignConfig || {});
  const countdownDays = getCountdownDays(campaignConfig);
  const name = city.name;
  const slug = city.slug;
  const feverUrl = city.feverUrl || `https://feverup.com/en/${slug}/mothers-day`;
  const imgBase = '../images/' + slug;
  const cityUrl = `${DOMAIN}/${slug}/`;

  const { experiences, giftCards } = getCityPlans(feverPlans, slug);
  const plans = experiences.filter((p) => p && p.name && (p.url || feverUrl));
  const picks = plans.length > 0 ? plans.slice(0, 6) : TOP_PICKS_FALLBACK.map((p) => ({ ...p, url: p.url || feverUrl }));
  const sectionTitle = plans.length > 0 ? copy.campaignName + ' plans in ' + name : 'Top picks for ' + copy.campaignName;

  const topPicksHtml = picks.map(
    (pick, i) => {
      const url = pick.url || feverUrl;
      const priceText = pick.priceText || 'Get tickets';
      const imgSrc = (pick.image && pick.image.startsWith('http')) ? pick.image : (imgBase + '.png');
      const imgAlt = escapeHtml(pick.name) + ' — ' + copy.campaignName + ' experience in ' + escapeHtml(name);
      return planCardHtml(pick, {
        url,
        priceText,
        imgSrc,
        imgAlt,
        title: pick.name,
        badge: '#' + (i + 1) + ' ' + (plans.length > 0 ? 'PLAN' : 'TOP PICK'),
        ctaText: 'Get Tickets →'
      });
    }
  ).join('\n');

  const heroCtaText = (copy.copy.heroCta || 'See {campaignName} experiences').replace(/\{campaignName\}/g, copy.campaignName);
  const heroTitleCityRaw = copy.copy.heroTitleCity || 'Unforgettable {campaignName} in {city}: Gifts, Ideas & Experiences';
  const heroTitleCity = heroTitleCityRaw.replace(/\{campaignName\}/g, copy.campaignName).replace(/\{city\}/g, name);
  const mainContent = `
    <div class="container container--breadcrumb">
      <nav class="breadcrumb breadcrumb--hero" aria-label="Breadcrumb">
        <a href="/">${escapeHtml(copy.copy.breadcrumbHome)}</a> <span class="breadcrumb__sep" aria-hidden="true">›</span> <span class="breadcrumb__current">${escapeHtml(name)}</span>
      </nav>
    </div>
    <section class="hero hero--city hero--${slug}" aria-labelledby="hero-heading">
      <div class="hero__background">
        <img src="${imgBase}.png" alt="${escapeHtml((copy.copy.heroImageAltCity || "Mother's Day {city} experience gift").replace(/\{city\}/g, name))}" width="1920" height="1080" loading="eager" fetchpriority="high" class="hero__img">
      </div>
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="hero__content">
        <span class="hero__badge" aria-hidden="true">${escapeHtml(copy.campaignName)} 2026</span>
        <h1 id="hero-heading" class="hero__title">${escapeHtml(heroTitleCity)}</h1>
        <p class="hero__subtitle">Discover the best ${escapeHtml(copy.campaignName)} ideas, gifts and experiences in ${escapeHtml(name)}</p>
        <a href="${feverUrl}" class="hero__cta cta-button" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(heroCtaText)}">${escapeHtml(heroCtaText)}</a>
      </div>
    </section>

    <section class="section section--picks" aria-labelledby="picks-heading">
      <div class="container">
        <h2 id="picks-heading" class="section__title">${escapeHtml(sectionTitle)}</h2>
        <p class="section__intro">Most loved experiences for ${escapeHtml(copy.campaignName)} in ${escapeHtml(name)}. Book directly on Fever.</p>
        <div class="picks-grid picks-grid--stagger">
          ${topPicksHtml}
        </div>
      </div>
    </section>

    <section class="section section--gift-cards" aria-labelledby="gift-cards-heading">
      <div class="container">
        <div class="gift-cards-header">
          <h2 id="gift-cards-heading" class="section__title section__title--inline">Gift Cards</h2>
          <a href="${escapeHtml(feverUrl)}" class="gift-cards-see-all" target="_blank" rel="noopener noreferrer">See all</a>
        </div>
        <div class="gift-cards-scroll" role="list">
          ${(giftCards.length > 0 ? giftCards : GIFT_CARDS_FALLBACK.map((c) => ({ name: c.name, priceText: c.priceText, url: null, image: null }))).map((card) => {
            const cardUrl = card.url || feverUrl;
            const cardImg = (card.image && card.image.startsWith('http')) ? card.image : (imgBase + '.png');
            return `
          <article class="gift-card" role="listitem">
            <a href="${escapeHtml(cardUrl)}" class="gift-card__link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(card.name)} — ${escapeHtml(card.priceText || '')} on Fever">
              <span class="gift-card__img-wrap">
                <img src="${escapeHtml(cardImg)}" alt="${escapeHtml(card.name)} — ${escapeHtml(copy.campaignName)} gift card ${escapeHtml(name)}" width="280" height="180" loading="lazy" class="gift-card__img">
              </span>
              <span class="gift-card__title">${escapeHtml(card.name)}</span>
              <span class="gift-card__price">${escapeHtml(card.priceText || '')}</span>
            </a>
          </article>`;
          }).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section--why" aria-labelledby="why-heading">
      <div class="container">
        <h2 id="why-heading" class="section__title">Why ${escapeHtml(name)} is perfect for ${escapeHtml(copy.campaignName)}</h2>
        <div class="why-grid">
          <div class="why-block">
            <h3 class="why-block__title">Iconic experiences</h3>
            <p class="why-block__text">From afternoon tea to Candlelight concerts, ${escapeHtml(name)} offers memorable ${escapeHtml(copy.campaignName)} experiences. Find gift ideas and things to do.</p>
          </div>
          <div class="why-block">
            <h3 class="why-block__title">Afternoon tea &amp; dining</h3>
            <p class="why-block__text">Treat someone special to afternoon tea or a special meal. Restaurants and experiences for ${escapeHtml(copy.campaignName)} in ${escapeHtml(name)} — book ahead on Fever.</p>
          </div>
          <div class="why-block">
            <h3 class="why-block__title">Candlelight &amp; events</h3>
            <p class="why-block__text">Candlelight concerts and ${escapeHtml(copy.campaignName)} events in ${escapeHtml(name)}. Experience gifts to remember.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--ideas" aria-labelledby="ideas-heading">
      <div class="container">
        <h2 id="ideas-heading" class="section__title">${escapeHtml(copy.campaignName)} ideas in ${escapeHtml(name)}</h2>
        <p class="section__intro">Explore the best options to celebrate ${escapeHtml(copy.campaignName)}</p>
        <div class="ideas-grid ideas-grid--stagger">
          <a href="/${slug}/ideas/" class="idea-card">
            <span class="idea-card__title">${escapeHtml(copy.campaignName)} Gifts</span>
            <span class="idea-card__desc">Find the best ${escapeHtml(copy.campaignName)} gifts in ${escapeHtml(name)}</span>
          </a>
          <a href="/${slug}/experiences/" class="idea-card">
            <span class="idea-card__title">${escapeHtml(copy.campaignName)} Experiences</span>
            <span class="idea-card__desc">Experiences and gift ideas in ${escapeHtml(name)}</span>
          </a>
          <a href="/${slug}/events/" class="idea-card">
            <span class="idea-card__title">${escapeHtml(copy.campaignName)} Events</span>
            <span class="idea-card__desc">Events for ${escapeHtml(copy.campaignName)} in ${escapeHtml(name)}</span>
          </a>
          <a href="/${slug}/candlelight/" class="idea-card">
            <span class="idea-card__title">Candlelight ${escapeHtml(copy.campaignName)}</span>
            <span class="idea-card__desc">Candlelight concerts for ${escapeHtml(copy.campaignName)} in ${escapeHtml(name)}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section section--cta-fever">
      <div class="container">
        <p class="section__intro">See all ${escapeHtml(copy.campaignName)} experiences, gift ideas and events in ${escapeHtml(name)} on Fever.</p>
        <p><a href="${feverUrl}" class="cta-button" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(copy.copy.seeAllOnFever)}">${escapeHtml(copy.copy.seeAllOnFever)} &rarr;</a></p>
      </div>
    </section>

    <section class="section section--seo" aria-labelledby="seo-city-heading">
      <div class="container">
        <h2 id="seo-city-heading" class="section__title section__title--seo">${escapeHtml(copy.campaignName)} ${escapeHtml(name)}: things to do, gifts and experiences</h2>
        <div class="seo-content">
          <p>Looking for <strong>${escapeHtml(copy.campaignName)} ideas in ${escapeHtml(name)}</strong> or <strong>things to do for ${escapeHtml(copy.campaignName)}</strong>? We've got <strong>${escapeHtml(copy.campaignName)} plans</strong>, <strong>experience gifts</strong> and <strong>${escapeHtml(copy.campaignName)} events</strong> in ${escapeHtml(name)} — from afternoon tea to <a href="/${slug}/candlelight/">Candlelight ${escapeHtml(copy.campaignName)} ${escapeHtml(name)}</a>, <a href="/${slug}/experiences/">${escapeHtml(copy.campaignName)} experiences in ${escapeHtml(name)}</a> and <a href="/${slug}/ideas/">${escapeHtml(copy.campaignName)} gift ideas ${escapeHtml(name)}</a>. <a href="/${slug}/events/">${escapeHtml(copy.campaignName)} events ${escapeHtml(name)}</a> are bookable on Fever. <a href="/">${escapeHtml(copy.campaignName)} ${escapeHtml(copy.countryLabel)}</a> — pick your city and book.</p>
        </div>
      </div>
    </section>`;

  const breadcrumbList = [
    { name: copy.copy.breadcrumbHome, item: DOMAIN + '/' },
    { name: name, item: cityUrl }
  ];
  const itemListLdJson = plans.length > 0
    ? buildItemListLdJson(name, slug, plans.slice(0, 12), copy.campaignName + ' plans in ' + name)
    : '';
  return layout({
    pageTitle: `${copy.campaignName} ${name} 2026 | Things to Do, Gifts & Experiences for Mum`,
    metaDescription: `${copy.campaignName} ${name}: gift ideas, things to do and experiences for Mum. Afternoon tea, Candlelight concerts & events. Book on Fever.`,
    keywords: `${(copy.campaignName || '').toLowerCase().replace(/\s+/g, ' ')} ${slug}, ${(copy.campaignName || '').toLowerCase()} ${name}, things to do ${slug}, plans ${slug}, gifts ${slug}`,
    canonical: cityUrl,
    mainContent,
    assetDepth: '../',
    heroPreloadUrl: '../images/' + slug + '.png',
    city,
    cities,
    feverUrl,
    stickyCtaUrl: feverUrl,
    stickyCtaText: copy.copy.seeAllOnFever,
    breadcrumbList,
    itemListLdJson,
    countdownDays,
    campaignCopy: copy
  });
}

const FEATURED_PLANS_MAX = 6;

function citySubPage(city, type, feverPlans, cities, campaignConfig) {
  const copy = buildCampaignCopy(campaignConfig || {});
  const countdownDays = getCountdownDays(campaignConfig);
  const name = city.name;
  const slug = city.slug;
  const feverUrl = city.feverUrl || `https://feverup.com/en/${slug}/mothers-day`;
  const feverCandlelightUrl = `https://feverup.com/en/${slug}/candlelight-${slug}`;
  const imgBase = '../../images/' + slug;
  const assetDepth = '../../';
  const { experiences, giftCards, candlelightExperiences } = getCityPlans(feverPlans, slug);
  const classified = classifyPlans(experiences, giftCards, candlelightExperiences);

  let plansForFeatured;
  if (type === 'candlelight' && candlelightExperiences.length > 0) {
    plansForFeatured = candlelightExperiences;
  } else if (type === 'ideas') {
    plansForFeatured = classified.ideas.length > 0
      ? classified.ideas
      : [...(giftCards || []), ...(experiences || []).slice(0, FEATURED_PLANS_MAX)];
  } else if (type === 'experiences') {
    plansForFeatured = classified.experiences.length > 0
      ? classified.experiences
      : (experiences || []).slice(0, FEATURED_PLANS_MAX);
  } else if (type === 'events') {
    plansForFeatured = classified.events.length > 0
      ? classified.events
      : (experiences || []).slice(0, FEATURED_PLANS_MAX);
  } else {
    plansForFeatured = experiences || [];
  }

  const featuredPlans = plansForFeatured.filter((p) => p && p.name && (p.url || feverUrl)).slice(0, FEATURED_PLANS_MAX);
  const pageFeverUrl = type === 'candlelight' ? feverCandlelightUrl : feverUrl;
  const sectionTitles = {
    candlelight: 'Candlelight concerts in ' + name,
    ideas: copy.campaignName + ' ideas in ' + name,
    experiences: copy.campaignName + ' experiences in ' + name,
    events: copy.campaignName + ' events in ' + name
  };
  const featuredSectionTitle = sectionTitles[type] || copy.campaignName + ' experiences in ' + name;
  const featuredSectionIntro = type === 'candlelight'
    ? 'Candlelight concerts in ' + name + '. Book on Fever.'
    : "From Fever's " + copy.campaignName + " page — book directly below.";
  const emptyStateIntro = type === 'candlelight'
    ? 'No Candlelight plans in ' + name + ' right now. Check Fever for the latest concerts and experiences.'
    : "No plans in this category right now. Check back soon or see what's on Fever.";
  const featuredHtml = featuredPlans.length > 0
    ? `
    <section class="section section--picks" aria-labelledby="featured-heading">
      <div class="container">
        <h2 id="featured-heading" class="section__title">Plans to book</h2>
        <p class="section__intro">${escapeHtml(featuredSectionIntro)}</p>
        <div class="picks-grid picks-grid--stagger">
          ${featuredPlans.map((pick, i) => {
            const url = pick.url || pageFeverUrl;
            const priceText = pick.priceText || 'Get tickets';
            const imgSrc = (pick.image && pick.image.startsWith('http')) ? pick.image : (imgBase + '.png');
            const imgAlt = escapeHtml(pick.name) + ' — ' + (type === 'candlelight' ? 'Candlelight ' : copy.campaignName + ' ') + escapeHtml(name);
            return planCardHtml(pick, {
              url,
              priceText,
              imgSrc,
              imgAlt,
              title: pick.name,
              badge: 'PLAN',
              ctaText: 'Get Tickets →'
            });
          }).join('\n          ')}
        </div>
        <p><a href="${escapeHtml(pageFeverUrl)}" class="cta-button" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.copy.seeAllOnFever)} &rarr;</a></p>
      </div>
    </section>`
    : `
    <section class="section section--picks section--empty-state" aria-labelledby="featured-heading">
      <div class="container">
        <h2 id="featured-heading" class="section__title">Plans to book</h2>
        <p class="section__intro">${escapeHtml(emptyStateIntro)}</p>
        <p><a href="${escapeHtml(pageFeverUrl)}" class="cta-button" target="_blank" rel="noopener noreferrer">${type === 'candlelight' ? 'See Candlelight on Fever' : escapeHtml(copy.copy.seeAllOnFever)}</a></p>
      </div>
    </section>`;
  const cn = copy.campaignName;
  const kw = (cn || '').toLowerCase().replace(/\s+/g, ' ');
  const configs = {
    ideas: {
      path: 'ideas',
      title: `${cn} Gift Ideas ${name} 2026 | Best Gifts for Mum`,
      description: `${cn} gift ideas in ${name}: inspiration and best experiences for Mum. Book experience gifts and plans on Fever.`,
      keywords: `${kw} ideas ${slug}, gift ideas ${kw} ${slug}, ${kw} gifts ${slug}`,
      h1: `${cn} gift ideas in ${name}`,
      intro: `Find the best ${cn} gift ideas and inspiration in ${name}. Experiences, dinners and unique plans. Book ${cn} gifts on Fever.`
    },
    experiences: {
      path: 'experiences',
      title: `${cn} Experiences ${name} 2026 | Afternoon Tea & More`,
      description: `${cn} experiences in ${name}: afternoon tea, workshops and experience gifts. Things to do for Mum — book on Fever.`,
      keywords: `${kw} experiences ${slug}, experience gifts ${kw} ${slug}, things to do ${kw} ${slug}`,
      h1: `${cn} experiences in ${name}`,
      intro: `Discover ${cn} experience gifts in ${name}. Afternoon tea, workshops and unforgettable plans. Book ${cn} experiences on Fever.`
    },
    events: {
      path: 'events',
      title: `${cn} Events ${name} 2026 | Things to Do & What's On`,
      description: `${cn} events in ${name}: concerts, dinners and things to do. See what's on and book on Fever.`,
      keywords: `${kw} events ${slug}, events for ${kw} ${slug}, ${kw} ${slug} events`,
      h1: `${cn} events in ${name}`,
      intro: `Find ${cn} events in ${name}. Concerts, dinners and special events. Book ${cn} events on Fever.`
    },
    candlelight: {
      path: 'candlelight',
      title: `Candlelight ${cn} ${name} 2026 | Concerts & Tickets`,
      description: `Candlelight ${cn} in ${name}: intimate concerts and experience gifts. Book Candlelight tickets on Fever.`,
      keywords: `${kw} candlelight ${slug}, candlelight ${kw} ${slug}, candlelight concert ${slug}`,
      h1: `Candlelight ${cn} in ${name}`,
      intro: `Candlelight ${cn} experiences in ${name}. Intimate concerts and unique gifts. Book Candlelight ${cn} on Fever.`
    }
  };
  const c = configs[type];
  if (!c) return '';
  const canonical = `${DOMAIN}/${slug}/${c.path}/`;
  const mainContent = `
    <section class="hero hero--subpage hero--subpage-${slug}" aria-labelledby="subpage-heading">
      <div class="hero__background">
        <img src="${imgBase}.png" alt="${escapeHtml((copy.copy.heroImageAltSubpage || "Mother's Day {topic} in {city} experience gift").replace(/\{topic\}/g, type === 'candlelight' ? 'Candlelight' : type).replace(/\{city\}/g, name))}" width="1920" height="1080" loading="eager" fetchpriority="high" class="hero__img">
      </div>
      <div class="hero__overlay hero__overlay--subpage" aria-hidden="true"></div>
      <div class="hero__content hero__content--subpage">
        <div class="container">
          <nav class="breadcrumb breadcrumb--subpage breadcrumb--hero" aria-label="Breadcrumb">
            <a href="/">${escapeHtml(copy.copy.breadcrumbHome)}</a><span class="breadcrumb__sep" aria-hidden="true">›</span><a href="/${slug}/">${escapeHtml(name)}</a><span class="breadcrumb__sep" aria-hidden="true">›</span><span class="breadcrumb__current">${escapeHtml(c.h1)}</span>
          </nav>
          <h1 id="subpage-heading" class="hero__title hero__title--subpage">${escapeHtml(c.h1)}</h1>
          <p class="hero__subtitle hero__subtitle--subpage">${escapeHtml(c.intro)}</p>
          <a href="${escapeHtml(pageFeverUrl)}" class="cta-button hero__cta" target="_blank" rel="noopener noreferrer">${type === 'candlelight' ? 'See Candlelight in ' + escapeHtml(name) + ' on Fever' : escapeHtml(copy.copy.seeAllOnFever) + ' — ' + escapeHtml(name)}</a>
        </div>
      </div>
    </section>
    <section class="section section--subpage-actions">
      <div class="container">
        <a href="/${slug}/" class="link--back">Back to ${escapeHtml(copy.campaignName)} ${escapeHtml(name)}</a>
      </div>
    </section>${featuredHtml}
    <section class="section section--seo" aria-labelledby="seo-subpage-heading">
      <div class="container">
        <h2 id="seo-subpage-heading" class="section__title section__title--seo">${escapeHtml(c.h1)} — book on Fever</h2>
        <div class="seo-content">
          <p>Looking for <strong>${escapeHtml(c.h1)}</strong>? Book <strong>${escapeHtml(copy.campaignName)} plans</strong> and <strong>experience gifts</strong> in ${escapeHtml(name)} on Fever. See also <a href="/${slug}/">${escapeHtml(copy.campaignName)} ${escapeHtml(name)}</a>, <a href="/${slug}/ideas/">${escapeHtml(copy.campaignName)} ideas ${escapeHtml(name)}</a>, <a href="/${slug}/experiences/">${escapeHtml(copy.campaignName)} experiences ${escapeHtml(name)}</a>, <a href="/${slug}/events/">${escapeHtml(copy.campaignName)} events ${escapeHtml(name)}</a> and <a href="/${slug}/candlelight/">Candlelight ${escapeHtml(copy.campaignName)} ${escapeHtml(name)}</a>. <a href="/">${escapeHtml(copy.campaignName)} ${escapeHtml(copy.countryLabel)}</a> — pick your city and book.</p>
        </div>
      </div>
    </section>`;
  const breadcrumbList = [
    { name: copy.copy.breadcrumbHome, item: DOMAIN + '/' },
    { name: name, item: DOMAIN + '/' + slug + '/' },
    { name: c.h1, item: canonical }
  ];
  const itemListLdJson = featuredPlans.length > 0
    ? buildItemListLdJson(name, slug, featuredPlans, featuredSectionTitle)
    : '';
  return layout({
    pageTitle: c.title,
    metaDescription: c.description,
    keywords: c.keywords,
    canonical,
    mainContent,
    assetDepth,
    heroPreloadUrl: imgBase + '.png',
    city,
    cities,
    feverUrl: pageFeverUrl,
    stickyCtaUrl: pageFeverUrl,
    stickyCtaText: type === 'candlelight' ? 'See Candlelight on Fever' : copy.copy.seeAllOnFever,
    breadcrumbList,
    itemListLdJson,
    countdownDays,
    campaignCopy: copy
  });
}

/** Generate sitemap.xml from campaign domain and cities (called after pages are generated). */
function writeSitemap(domain, cities) {
  const base = domain.replace(/\/$/, '');
  const lastmod = new Date().toISOString().slice(0, 10);
  const subTypes = ['ideas', 'experiences', 'events', 'candlelight'];

  const urls = [
    { loc: base + '/', changefreq: 'weekly', priority: '1.0' },
    { loc: base + '/legal/cookies.html', changefreq: 'monthly', priority: '0.3' }
  ];
  for (const city of cities) {
    urls.push({ loc: base + '/' + city.slug + '/', changefreq: 'weekly', priority: '0.9' });
    for (const type of subTypes) {
      urls.push({ loc: base + '/' + city.slug + '/' + type + '/', changefreq: 'weekly', priority: '0.8' });
    }
  }

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n' +
    urls.map((u) => '  <url>\n    <loc>' + u.loc + '</loc>\n    <lastmod>' + lastmod + '</lastmod>\n    <changefreq>' + u.changefreq + '</changefreq>\n    <priority>' + u.priority + '</priority>\n  </url>').join('\n') +
    '\n</urlset>\n';

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  console.log('Generated: sitemap.xml');
}

function main() {
  const campaignId = getCampaignId();
  const campaignConfig = loadCampaignConfig(campaignId);

  FEVER_PLANS_PATH = path.isAbsolute(campaignConfig.outputDataFile)
    ? campaignConfig.outputDataFile
    : path.join(ROOT, campaignConfig.outputDataFile);
  DOMAIN = campaignConfig.domain || DOMAIN;

  let cities = campaignConfig.cities || [];
  if (cities.length === 0 && fs.existsSync(DATA_PATH)) {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    cities = data.cities || [];
  }
  const feverPathTemplate = campaignConfig.feverPathTemplate || 'https://feverup.com/en/{city}/mothers-day';
  cities = cities.map((c) => ({
    ...c,
    feverUrl: c.feverUrl || (feverPathTemplate.replace('{city}', c.slug))
  }));

  let count = 0;
  const feverPlans = loadFeverPlans();
  cities.forEach(function (city) {
    const dir = path.join(ROOT, city.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, 'index.html'), cityMainPage(city, feverPlans, cities, campaignConfig), 'utf8');
    console.log('Generated:', city.slug + '/index.html');
    count++;

    ['ideas', 'experiences', 'events', 'candlelight'].forEach(function (type) {
      const subDir = path.join(dir, type);
      if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
      const html = citySubPage(city, type, feverPlans, cities, campaignConfig);
      fs.writeFileSync(path.join(subDir, 'index.html'), html, 'utf8');
      console.log('Generated:', city.slug + '/' + type + '/index.html');
      count++;
    });
  });

  writeSitemap(DOMAIN, cities);
  console.log('Done. Generated', count, 'pages.');
}

main();
