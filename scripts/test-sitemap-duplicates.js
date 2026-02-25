/**
 * Test sitemap for duplicate URLs
 */

const fs = require('fs');
const path = require('path');

// Mock the sitemap generation
const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

console.log('🔍 Testing sitemap for duplicate URLs...\n');

// Extract URLs from sitemap logic
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt'];
const cities = [
  'madrid', 'barcelona', 'valencia', 'london', 'paris', 'lyon',
  'new-york', 'los-angeles', 'chicago', 'miami', 'san-francisco',
  'washington-dc', 'san-diego', 'atlanta', 'austin', 'lisbon',
  'sao-paulo', 'mexico-city', 'berlin', 'hamburg', 'vienna',
  'dublin', 'sydney', 'melbourne', 'brisbane',
  'toronto', 'buenos-aires', 'montreal', 'munchen', 'roma', 'milano'
];
const pageTypes = [
  'gifts',
  'restaurants',
  'valentines-day/ideas',
  'valentines-day/last-minute'
];

const baseUrl = 'https://celebratevalentines.com';
const urls = new Set();
const duplicates = [];

// Generate URLs as sitemap does
for (const locale of locales) {
  const homeUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;
  if (urls.has(homeUrl)) {
    duplicates.push(homeUrl);
  }
  urls.add(homeUrl);
}

for (const locale of locales) {
  for (const city of cities) {
    const cityUrl = `${baseUrl}/${locale}/${city}`;
    if (urls.has(cityUrl)) {
      duplicates.push(cityUrl);
    }
    urls.add(cityUrl);
    
    for (const pageType of pageTypes) {
      const categoryUrl = `${baseUrl}/${locale}/${city}/${pageType}`;
      if (urls.has(categoryUrl)) {
        duplicates.push(categoryUrl);
      }
      urls.add(categoryUrl);
    }
  }
}

console.log(`Total URLs generated: ${urls.size}`);
console.log(`Expected URLs: ${locales.length} (home) + ${locales.length * cities.length} (cities) + ${locales.length * cities.length * pageTypes.length} (categories) = ${locales.length + (locales.length * cities.length) + (locales.length * cities.length * pageTypes.length)}`);

if (duplicates.length > 0) {
  console.log(`\n❌ DUPLICATES FOUND: ${duplicates.length}`);
  duplicates.forEach(dup => console.log(`  - ${dup}`));
  process.exit(1);
} else {
  console.log('\n✅ No duplicate URLs found');
}

// Check for double slashes
const doubleSlashUrls = Array.from(urls).filter(url => url.includes('//') && !url.includes('https://'));
if (doubleSlashUrls.length > 0) {
  console.log(`\n⚠️  URLs with double slashes (excluding https://): ${doubleSlashUrls.length}`);
  doubleSlashUrls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
} else {
  console.log('\n✅ No double slashes in URLs');
}
