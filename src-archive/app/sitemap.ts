import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

// City slugs - must match CITY_NAMES in [locale]/[city]/page.tsx
// Complete list of all cities available in the application
const CITIES = [
  'madrid', 'barcelona', 'valencia', 'london', 'paris', 'lyon',
  'new-york', 'los-angeles', 'chicago', 'miami', 'san-francisco',
  'washington-dc', 'san-diego', 'atlanta', 'austin', 'lisbon',
  'sao-paulo', 'mexico-city', 'berlin', 'hamburg', 'vienna',
  'dublin', 'sydney', 'melbourne', 'brisbane',
  'toronto', 'buenos-aires', 'montreal', 'munchen', 'roma', 'milano'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://celebratemothersday.com';
  
  const routes: MetadataRoute.Sitemap = [];
  
  // Home page for each locale - use /en/ for English too to avoid redirect chain (root redirects to /en/)
  // All URLs absolute with trailing slash for Google consistency
  for (const locale of locales) {
    routes.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Since it's a seasonal event site
      priority: 1.0, // Highest priority for homepage
    });
  }
  
  // City pages for each locale (all language variants)
  for (const locale of locales) {
    for (const city of CITIES) {
      routes.push({
        url: `${baseUrl}/${locale}/${city}/`,
        lastModified: new Date(),
        changeFrequency: 'daily', // Since it's a seasonal event site
        priority: 0.9, // High priority for city pages
      });
    }
  }
  
  // Category-specific pages for each city and locale
  const PAGE_TYPES = [
    'gifts',
    'restaurants',
    'valentines-day/ideas',
    'valentines-day/last-minute'
  ];
  
  for (const locale of locales) {
    for (const city of CITIES) {
      for (const pageType of PAGE_TYPES) {
        routes.push({
          url: `${baseUrl}/${locale}/${city}/${pageType}/`,
          lastModified: new Date(),
          changeFrequency: 'daily', // Since it's a seasonal event site
          priority: 0.8, // Slightly lower than main city page but still high
        });
      }
    }
  }

  // Legal: Cookie Policy (GDPR/CCPA)
  for (const locale of locales) {
    routes.push({
      url: `${baseUrl}/${locale}/legal/cookies/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    });
  }
  
  return routes;
}
