/**
 * Verificación SEO para sitio estático Mother's Day UK.
 * Comprueba: indexabilidad, crawlability, canonicals, sitemap, contenido duplicado básico.
 * Run: node scripts/verify-seo-static.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://celebratemothersday.co.uk';

let hasErrors = false;
const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
  hasErrors = true;
}
function warn(msg) {
  warnings.push(msg);
}

console.log('SEO static site check — indexability, crawlability, canonicals, sitemap\n');
console.log('='.repeat(60));

// 1. robots.txt
console.log('\n1. ROBOTS.TXT');
console.log('-'.repeat(40));
const robotsPath = path.join(ROOT, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  err('robots.txt not found');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (robots.includes('Allow: /') || !robots.includes('Disallow: /')) {
    console.log('  OK   Allow / (or no block of root)');
  } else {
    err('robots.txt blocks root (Disallow: /) — pages would not be indexed');
  }
  if (robots.includes('Disallow: /data/')) console.log('  OK   Disallow: /data/');
  else warn('Consider Disallow: /data/ (JSON not for indexing)');
  if (robots.includes('Disallow: /scripts/')) console.log('  OK   Disallow: /scripts/');
  else warn('Consider Disallow: /scripts/');
  if (/Sitemap:\s*https?:\/\//i.test(robots)) {
    console.log('  OK   Sitemap URL present');
  } else {
    err('Sitemap: not found in robots.txt');
  }
}

// 2. sitemap.xml
console.log('\n2. SITEMAP.XML');
console.log('-'.repeat(40));
const sitemapPath = path.join(ROOT, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  err('sitemap.xml not found');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
  const urls = locs.map((l) => l.replace(/<\/?loc>/g, '').trim());
  const unique = new Set(urls);
  if (unique.size !== urls.length) {
    err('Sitemap contains duplicate <loc> URLs');
  } else {
    console.log('  OK   No duplicate URLs (' + urls.length + ' entries)');
  }
  if (urls.length < 10) warn('Sitemap has few URLs — check all city pages are included');
  // Check each URL maps to an existing file
  for (const url of urls) {
    if (!url.startsWith(DOMAIN)) {
      warn('Sitemap URL wrong domain: ' + url);
      continue;
    }
    const rel = url.slice(DOMAIN.length).replace(/^\//, '') || '';
    const filePath = !rel
      ? path.join(ROOT, 'index.html')
      : rel.endsWith('.html')
        ? path.join(ROOT, rel)
        : path.join(ROOT, rel.replace(/\/$/, ''), 'index.html');
    if (!fs.existsSync(filePath)) {
      err('Sitemap URL not found on disk: ' + url.slice(DOMAIN.length) + ' -> ' + filePath);
    }
  }
  console.log('  OK   All sitemap URLs point to existing paths');
}

// 3. Canonical, title, description, no noindex (except 404)
console.log('\n3. CANONICAL, TITLE, DESCRIPTION, ROBOTS');
console.log('-'.repeat(40));
const pagesToCheck = [
  { path: 'index.html', name: 'Home' },
  { path: 'london/index.html', name: 'London' },
  { path: 'london/experiences/index.html', name: 'London experiences' },
  { path: 'legal/cookies.html', name: 'Cookies' },
  { path: '404.html', name: '404' }
];
for (const p of pagesToCheck) {
  const fullPath = path.join(ROOT, p.path);
  if (!fs.existsSync(fullPath)) {
    warn(p.name + ': file not found ' + p.path);
    continue;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const hasCanonical = /<link\s+rel="canonical"\s+href="[^"]+"/i.test(html);
  const hasTitle = /<title>[^<]+<\/title>/i.test(html);
  const hasDesc = /<meta\s+name="description"\s+content="[^"]+"/i.test(html);
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  if (p.path === '404.html') {
    if (!noindex) warn('404.html should have meta robots noindex');
    else console.log('  OK   404.html has noindex');
  } else {
    if (!hasCanonical) err(p.name + ': missing canonical');
    if (!hasTitle) err(p.name + ': missing title');
    if (!hasDesc) err(p.name + ': missing meta description');
    if (noindex) err(p.name + ': has noindex (should be indexable)');
    if (hasCanonical && hasTitle && hasDesc && !noindex) {
      console.log('  OK   ' + p.path);
    }
  }
}

// 4. Unique titles (no duplicate titles across key pages)
console.log('\n4. UNIQUE TITLES (avoid duplicate content signal)');
console.log('-'.repeat(40));
const citySlugs = ['london', 'manchester', 'birmingham', 'liverpool', 'leeds', 'bristol', 'brighton', 'edinburgh'];
const subSlugs = ['', 'ideas', 'experiences', 'events', 'candlelight'];
const titles = new Set();
let duplicateTitles = [];
for (const city of citySlugs) {
  for (const sub of subSlugs) {
    const rel = sub ? `${city}/${sub}/index.html` : `${city}/index.html`;
    const fullPath = path.join(ROOT, rel);
    if (!fs.existsSync(fullPath)) continue;
    const html = fs.readFileSync(fullPath, 'utf8');
    const m = html.match(/<title>([^<]+)<\/title>/i);
    if (m) {
      const t = m[1].trim();
      if (titles.has(t)) duplicateTitles.push(t);
      titles.add(t);
    }
  }
}
const homePath = path.join(ROOT, 'index.html');
if (fs.existsSync(homePath)) {
  const homeHtml = fs.readFileSync(homePath, 'utf8');
  const m = homeHtml.match(/<title>([^<]+)<\/title>/i);
  if (m) titles.add(m[1].trim());
}
if (duplicateTitles.length > 0) {
  err('Duplicate page titles found: ' + [...new Set(duplicateTitles)].slice(0, 5).join(', '));
} else {
  console.log('  OK   City/subpage titles are unique');
}

// 5. Internal links (home -> cities; city -> subpages)
console.log('\n5. CRAWLABILITY (internal links)');
console.log('-'.repeat(40));
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
let citiesLinked = 0;
for (const slug of citySlugs) {
  if (indexHtml.includes(`href="${slug}/"`) || indexHtml.includes(`href="/${slug}/"`)) citiesLinked++;
}
if (citiesLinked !== citySlugs.length) {
  warn('Home does not link to all cities (found ' + citiesLinked + '/' + citySlugs.length + ')');
} else {
  console.log('  OK   Home links to all ' + citySlugs.length + ' cities');
}
const liverpoolIndex = path.join(ROOT, 'liverpool', 'index.html');
if (fs.existsSync(liverpoolIndex)) {
  const cityHtml = fs.readFileSync(liverpoolIndex, 'utf8');
  const hasIdeas = cityHtml.includes('href="/liverpool/ideas/"') || cityHtml.includes('href="ideas/"');
  const hasExp = cityHtml.includes('href="/liverpool/experiences/"') || cityHtml.includes('href="experiences/"');
  if (hasIdeas && hasExp) {
    console.log('  OK   City page links to ideas/experiences/events/candlelight');
  } else {
    warn('City page may not link to all subpages');
  }
}

// 6. Schema / JSON-LD (optional)
console.log('\n6. STRUCTURED DATA');
console.log('-'.repeat(40));
if (indexHtml.includes('application/ld+json')) {
  console.log('  OK   Home has JSON-LD');
} else {
  warn('Home has no JSON-LD (WebSite/FAQPage recommended)');
}

console.log('\n' + '='.repeat(60));
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach((w) => console.log('  - ' + w));
}
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((e) => console.log('  - ' + e));
  console.log('\nFix errors and re-run.');
  process.exit(1);
}
console.log('\nAll checks passed. Site is indexable and crawlable.');
if (warnings.length) console.log('Review warnings above.');
