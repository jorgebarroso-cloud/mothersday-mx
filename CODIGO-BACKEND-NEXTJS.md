# 📦 Código Backend de Next.js - Celebrate Valentine's

Este documento contiene todo el código backend/Server-Side de Next.js del proyecto.

---

## 1. 🔧 Middleware (`middleware.ts`)

Middleware de internacionalización con detección por geolocalización.

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, type Locale } from './src/i18n';
import { NextRequest, NextResponse } from 'next/server';

// Mapeo de países (códigos ISO 3166-1) a idiomas
const countryToLocale: Record<string, Locale> = {
  // Países de habla hispana
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
  'VE': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
  'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es',
  'UY': 'es', 'PR': 'es',
  
  // Países de habla francesa
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', 'LU': 'fr', 'MC': 'fr',
  
  // Países de habla alemana
  'DE': 'de', 'AT': 'de', 'LI': 'de',
  
  // Países de habla italiana
  'IT': 'it', 'SM': 'it', 'VA': 'it',
  
  // Países de habla portuguesa
  'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt',
};

// Mapeo de idiomas del navegador a locales
const browserLanguageMap: Record<string, Locale> = {
  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es',
  'fr': 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr',
  'de': 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de',
  'it': 'it', 'it-IT': 'it',
  'pt': 'pt', 'pt-PT': 'pt', 'pt-BR': 'pt',
  'en': 'en', 'en-US': 'en', 'en-GB': 'en',
};

/**
 * Detecta el país del usuario desde headers de geolocalización
 * Soporta: Vercel, Cloudflare, y otros servicios comunes
 */
function detectCountryFromHeaders(request: NextRequest): string | null {
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry;

  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry) return cfCountry;

  const gcpCountry = request.headers.get('x-country-code');
  if (gcpCountry) return gcpCountry;

  const country = request.headers.get('x-country') || 
                  request.headers.get('x-geoip-country') ||
                  request.headers.get('cloudfront-viewer-country');
  
  return country;
}

/**
 * Detecta el idioma del navegador desde Accept-Language header
 */
function detectLocaleFromBrowser(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) {
    return 'en';
  }

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', '')) || 1;
      return { code: code.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (browserLanguageMap[code]) {
      return browserLanguageMap[code];
    }
    
    const langCode = code.split('-')[0];
    if (browserLanguageMap[langCode]) {
      return browserLanguageMap[langCode];
    }
  }

  return 'en';
}

/**
 * Detecta el locale basado en geolocalización o navegador
 */
function detectPreferredLocale(request: NextRequest): Locale {
  const country = detectCountryFromHeaders(request);
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }

  return detectLocaleFromBrowser(request);
}

const intlMiddleware = createMiddleware({
  locales: locales as string[],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname === '/') {
      const preferredLocale = detectPreferredLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}`;
      // Use 301 (Permanent) redirect for SEO
      return NextResponse.redirect(url, { status: 301 });
    }

    return intlMiddleware(request);
  } catch (error) {
    console.warn('Middleware error (non-blocking):', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
```

---

## 2. 🗺️ Sitemap (`src/app/sitemap.ts`)

Generación dinámica del sitemap XML.

```typescript
import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const CITIES = [
  'madrid', 'barcelona', 'valencia', 'london', 'paris', 'lyon',
  'new-york', 'los-angeles', 'chicago', 'miami', 'san-francisco',
  'washington-dc', 'san-diego', 'atlanta', 'austin', 'lisbon',
  'sao-paulo', 'mexico-city', 'berlin', 'hamburg', 'vienna',
  'dublin', 'sydney', 'melbourne', 'brisbane',
  'toronto', 'buenos-aires', 'montreal', 'munchen', 'roma', 'milano'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://celebratevalentines.com';
  
  const routes: MetadataRoute.Sitemap = [];
  
  // Home page for each locale
  for (const locale of locales) {
    routes.push({
      url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }
  
  // City pages for each locale
  for (const locale of locales) {
    for (const city of CITIES) {
      routes.push({
        url: `${baseUrl}/${locale}/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }
  
  // Category-specific pages
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
          url: `${baseUrl}/${locale}/${city}/${pageType}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
  }
  
  return routes;
}
```

---

## 3. 🤖 Robots (`src/app/robots.ts`)

Generación dinámica de robots.txt.

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://celebratevalentines.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      // Explicitly allow AI bots
      {
        userAgent: 'GPTBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 4. 📊 Servicio de Datos (`src/lib/valentines/service.ts`)

Servicio principal para obtener datos de planes de Valentine's desde Google Sheets.

```typescript
import Papa from 'papaparse';
import { TORONTO_MANUAL_PLANS } from './toronto-manual-data';
import { BUENOS_AIRES_MANUAL_PLANS } from './buenos-aires-manual-data';
import { MEXICO_CITY_MANUAL_PLANS } from './mexico-city-manual-data';
import { MONTREAL_MANUAL_PLANS } from './montreal-manual-data';
import { MUENCHEN_MANUAL_PLANS } from './munchen-manual-data';
import { ROMA_MANUAL_PLANS } from './roma-manual-data';
import { MILANO_MANUAL_PLANS } from './milano-manual-data';

const VALENTINES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy4RXQSf-fbha0HGpXaM3qAfaomLcUCHRoQ-qWGG4OCZfRH3zOrXDLcmn1yOeMnnik2yMujklPqYTK/pub?gid=43890264&single=true&output=csv';
const CATEGORY_TRANSLATIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy4RXQSf-fbha0HGpXaM3qAfaomLcUCHRoQ-qWGG4OCZfRH3zOrXDLcmn1yOeMnnik2yMujklPqYTK/pub?gid=546673371&single=true&output=csv';

// City slug to ID mapping
const CITY_ID_MAP: Record<string, string> = {
  'madrid': '5',
  'new-york': '6',
  'barcelona': '7',
  'valencia': '8',
  'london': '11',
  'paris': '15',
  'los-angeles': '16',
  'lisbon': '17',
  'chicago': '21',
  'lyon': '22',
  'sao-paulo': '28',
  'miami': '30',
  'sydney': '32',
  'san-francisco': '37',
  'washington-dc': '41',
  'dublin': '43',
  'san-diego': '51',
  'atlanta': '55',
  'berlin': '56',
  'hamburg': '57',
  'vienna': '64',
  'melbourne': '72',
  'brisbane': '74',
  'austin': '85',
  'toronto': '99',
  'buenos-aires': '100',
  'mexico-city': '101',
  'montreal': '102',
  'munchen': '103',
  'roma': '104',
  'milano': '105',
};

// Currency by city
const CITY_CURRENCY: Record<string, string> = {
  'madrid': '€', 'barcelona': '€', 'valencia': '€',
  'london': '£',
  'paris': '€', 'lyon': '€', 'lisbon': '€',
  'berlin': '€', 'hamburg': '€', 'vienna': '€', 'dublin': '€',
  'new-york': '$', 'los-angeles': '$', 'chicago': '$', 'miami': '$',
  'san-francisco': '$', 'washington-dc': '$', 'san-diego': '$',
  'atlanta': '$', 'austin': '$',
  'sao-paulo': 'R$',
  'mexico-city': 'MX$',
  'sydney': 'A$', 'melbourne': 'A$', 'brisbane': 'A$',
  'toronto': 'CA$', 'montreal': 'CA$',
  'buenos-aires': 'ARS$',
  'munchen': '€', 'roma': '€', 'milano': '€',
};

export interface ValentinePlan {
  id: string;
  title: string;
  venue: string;
  price: string;
  priceValue: number;
  link: string;
  imageUrl: string;
  rank: number;
  categories: string[];
  city: string;
  isCandlelight: boolean;
  eventDates: Date[];
}

export interface ValentinesData {
  top3: ValentinePlan[];
  categories: Record<string, ValentinePlan[]>;
  candlelight: ValentinePlan[];
  all: ValentinePlan[];
}

// Helper to clean price string
const extractPrice = (sessionStr: string): { formatted: string; value: number } => {
  if (!sessionStr) return { formatted: '', value: 0 };
  
  const priceStrings = sessionStr.split(',').map(s => s.trim()).filter(s => s);
  const prices: number[] = [];
  
  for (const priceStr of priceStrings) {
    const parsed = parseFloat(priceStr.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      prices.push(parsed);
    }
  }
  
  if (prices.length === 0) return { formatted: '', value: 0 };
  
  const minPrice = Math.min(...prices);
  return { formatted: Math.round(minPrice).toString(), value: minPrice };
};

const VALID_CATEGORIES = [
  'concerts-musicals-theater',
  'valentines-related-events',
  'food',
  'workshops-and-activities',
  'wellness-and-relaxation'
];

const extractCategoryKeys = (categoryStr: string): string[] => {
  if (!categoryStr) return [];
  const tags = categoryStr.split(',').map(s => s.trim().toLowerCase());
  return tags.filter(tag => VALID_CATEGORIES.includes(tag));
};

const parseEventDates = (datesStr: string): Date[] => {
  if (!datesStr) return [];
  
  const dateStrings = datesStr.split(',').map(s => s.trim()).filter(s => s);
  const dates: Date[] = [];
  
  for (const dateStr of dateStrings) {
    if (dateStr.length === 8) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      }
    }
  }
  
  return dates;
};

function cleanPlanIdForManual(rawId: string): string {
  if (!rawId) return '';
  let cleaned = rawId.toString();
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {}
  cleaned = cleaned.replace(/[^\d]/g, '');
  return cleaned;
}

async function processManualData(plans: ValentinePlan[]): Promise<ValentinesData> {
  let translations: Record<string, Record<string, string>> = {};
  try {
    translations = await fetchTranslations();
  } catch (error) {
    console.warn('Failed to fetch translations, using defaults');
  }

  const cleanedPlans = plans.map(plan => ({
    ...plan,
    id: cleanPlanIdForManual(plan.id)
  }));

  const sortedPlans = [...cleanedPlans].sort((a, b) => a.rank - b.rank);

  const top3: ValentinePlan[] = [];
  const usedIds = new Set<string>();
  let candlelightInTop3 = false;
  
  for (const plan of sortedPlans) {
    if (top3.length >= 3) break;
    
    if (plan.isCandlelight) {
      if (!candlelightInTop3) {
        top3.push(plan);
        usedIds.add(plan.id);
        candlelightInTop3 = true;
      }
    } else {
      top3.push(plan);
      usedIds.add(plan.id);
    }
  }
  
  for (const plan of sortedPlans) {
    if (top3.length >= 3) break;
    if (!usedIds.has(plan.id)) {
      top3.push(plan);
      usedIds.add(plan.id);
    }
  }
  
  top3.sort((a, b) => a.rank - b.rank);

  const remaining = sortedPlans.filter(p => !usedIds.has(p.id));
  const candlelightPlans = remaining.filter(p => p.isCandlelight);
  
  const categories: Record<string, ValentinePlan[]> = {};
  remaining.forEach(plan => {
      plan.categories.forEach(categoryKey => {
          if (plan.isCandlelight && categoryKey !== 'valentines-related-events') {
              return;
          }
          
          const translatedCategory = translations[categoryKey]?.['en'] 
            || categoryKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(' And ', ' & ');
          
          if (!categories[translatedCategory]) {
              categories[translatedCategory] = [];
          }
          categories[translatedCategory].push(plan);
      });
  });

  return {
      top3,
      categories,
      candlelight: candlelightPlans,
      all: sortedPlans
  };
}

async function fetchTranslations(): Promise<Record<string, Record<string, string>>> {
  const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || process.env.STATIC_EXPORT === 'true';
  const cacheOption = isStaticExport ? 'force-cache' : 'no-store';
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(CATEGORY_TRANSLATIONS_CSV_URL, { 
        cache: cacheOption as RequestCache,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Translations fetch attempt ${attempt + 1}/3 failed with status ${response.status}`);
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      
      const text = await response.text();
      const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
      
      const translations: Record<string, Record<string, string>> = {};
      
      (data as any[]).forEach(row => {
        const key = row['Tag'] || row['Category / Key'] || row['Category'];
        const lang = row['CD_LOCALE'] || row['Language'];
        const trans = row['translation'] || row['Translation'];
        
        if (key && lang && trans) {
          if (!translations[key]) translations[key] = {};
          translations[key][lang] = trans;
        }
      });
      
      return translations;
    } catch (e) {
      console.warn(`Translations fetch attempt ${attempt + 1}/3 error:`, e);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
    }
  }
  return {};
}

const findImageColumn = (row: any): string => {
  const keys = Object.keys(row);
  for (const key of keys) {
    if (['id_plan', 'ds_plan', 'ds_venue', 'ds_session', 'link_to_plan', 'rank', 'category'].includes(key)) continue;
    
    const value = String(row[key] || '');
    if (value.startsWith('http') && (
      value.match(/\.(jpg|jpeg|png|webp|gif)/i) || 
      value.includes('cloudinary') || 
      value.includes('image')
    )) {
      return value;
    }
  }
  const imageKey = keys.find(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('img'));
  return imageKey ? row[imageKey] : '';
};

export async function getValentinesData(citySlug: string, language: string): Promise<ValentinesData> {
  try {
    // Check manual data first
    if (citySlug.toLowerCase() === 'toronto') {
      return processManualData(TORONTO_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'buenos-aires') {
      return processManualData(BUENOS_AIRES_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'mexico-city') {
      return processManualData(MEXICO_CITY_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'montreal') {
      return processManualData(MONTREAL_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'munchen') {
      return processManualData(MUENCHEN_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'roma') {
      return processManualData(ROMA_MANUAL_PLANS);
    }
    if (citySlug.toLowerCase() === 'milano') {
      return processManualData(MILANO_MANUAL_PLANS);
    }
    
    const targetCityId = CITY_ID_MAP[citySlug.toLowerCase()] || CITY_ID_MAP['madrid'];
    const currency = CITY_CURRENCY[citySlug.toLowerCase()] || '€';
    
    const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || 
                          process.env.STATIC_EXPORT === 'true' || 
                          process.env.DOCKER === 'true' ||
                          process.env.NODE_ENV === 'production';
    const cacheOption = isStaticExport ? 'force-cache' : 'no-store';
    
    const fetchWithRetry = async (url: string, retries = 3, timeout = 30000): Promise<Response | null> => {
      for (let i = 0; i < retries; i++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          const response = await fetch(url, { 
            cache: cacheOption as RequestCache,
            signal: controller.signal 
          });
          clearTimeout(timeoutId);
          if (response.ok) return response;
        } catch (e) {
          console.warn(`Fetch attempt ${i + 1}/${retries} failed for ${url}`);
          if (i < retries - 1) await new Promise(r => setTimeout(r, 1000));
        }
      }
      return null;
    };

    const [response, translations] = await Promise.all([
      fetchWithRetry(VALENTINES_CSV_URL),
      fetchTranslations().catch(() => ({}))
    ]);

    if (!response || !response.ok) {
      console.error(`❌ Failed to fetch Valentines CSV for ${citySlug}`);
      return { top3: [], categories: {}, candlelight: [], all: [] };
    }
    
    const csvText = await response.text();
    
    if (csvText.trim().toLowerCase().startsWith('<!doctype html') || csvText.trim().toLowerCase().startsWith('<html')) {
      console.error('❌ Error: The Google Sheet URL returned HTML instead of CSV.');
      return { top3: [], categories: {}, candlelight: [], all: [] };
    }

    const { data } = Papa.parse(csvText, { 
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    const cleanPlanId = (rawId: string): string => {
      if (!rawId) return '';
      let cleaned = rawId.toString();
      try {
        cleaned = decodeURIComponent(cleaned);
      } catch {}
      cleaned = cleaned.replace(/[^\d]/g, '');
      return cleaned;
    };

    const plans: ValentinePlan[] = (data as any[]).map((row) => {
        const rawId = row['id_plan'] || '';
        const id = cleanPlanId(rawId);
        const title = row['ds_plan'] || '';
        const venue = row['ds_venue'] || '';
        const link = row['link_to_plan'] || '';
        const rank = parseInt(row['rank'] || '999', 10);

        const cityId = row['id_city'] || '';
        if (cityId !== targetCityId) {
          return null;
        }

        const rawCategory = row['category'] || '';
        const categoryKeys = extractCategoryKeys(rawCategory);
        
        if (categoryKeys.length === 0) {
          return null;
        }

        const isCandlelight = title.toLowerCase().includes('candlelight');

        const session = row['ds_session_prices'] || row['ds_session'] || '';
        const priceData = extractPrice(session);
        const price = priceData.formatted 
          ? (currency === '€' ? `From ${priceData.formatted}${currency}` : `From ${currency}${priceData.formatted}`)
          : '';
        
        const imageUrl = row['image_link'] || findImageColumn(row);
        const eventDates = parseEventDates(row['event_dates'] || '');

        return {
            id,
            title,
            venue,
            price,
            priceValue: priceData.value,
            link,
            imageUrl,
            rank,
            categories: categoryKeys,
            city: citySlug,
            isCandlelight,
            eventDates
        };
    }).filter((p): p is ValentinePlan => p !== null && p.id !== '' && p.title !== '');

    const cityPlans = plans;
    cityPlans.sort((a, b) => a.rank - b.rank);

    const top3: ValentinePlan[] = [];
    const usedIds = new Set<string>();
    let candlelightInTop3 = false;
    
    for (const plan of cityPlans) {
      if (top3.length >= 3) break;
      
      if (plan.isCandlelight) {
        if (!candlelightInTop3) {
          top3.push(plan);
          usedIds.add(plan.id);
          candlelightInTop3 = true;
        }
      } else {
        top3.push(plan);
        usedIds.add(plan.id);
      }
    }
    
    for (const plan of cityPlans) {
      if (top3.length >= 3) break;
      if (!usedIds.has(plan.id)) {
        top3.push(plan);
        usedIds.add(plan.id);
      }
    }
    
    top3.sort((a, b) => a.rank - b.rank);

    const remaining = cityPlans.filter(p => !usedIds.has(p.id));
    const candlelightPlans = remaining.filter(p => p.isCandlelight);
    
    const categories: Record<string, ValentinePlan[]> = {};
    remaining.forEach(plan => {
        plan.categories.forEach(categoryKey => {
            if (plan.isCandlelight && categoryKey !== 'valentines-related-events') {
                return;
            }
            
            const translatedCategory = translations[categoryKey]?.[language] 
              || translations[categoryKey]?.['en']
              || categoryKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(' And ', ' & ');
            
            if (!categories[translatedCategory]) {
                categories[translatedCategory] = [];
            }
            categories[translatedCategory].push(plan);
        });
    });

    return {
        top3,
        categories,
        candlelight: candlelightPlans,
        all: cityPlans
    };

  } catch (error) {
    console.warn(`⚠️ Error in getValentinesData for ${citySlug}:`, error instanceof Error ? error.message : error);
    return { top3: [], categories: {}, candlelight: [], all: [] };
  }
}
```

---

## 5. 📊 UTM Tracking (`src/lib/valentines/utm.ts`)

Utilidades para tracking UTM en enlaces de planes.

```typescript
import { getNormalizedOrigin } from '@/lib/utils';

const CITY_UTM_CODES: Record<string, string> = {
  'madrid': 'mad', 'barcelona': 'bcn', 'valencia': 'val',
  'london': 'lon', 'paris': 'par', 'lyon': 'lyo',
  'new-york': 'nyc', 'los-angeles': 'lax', 'chicago': 'chi',
  'miami': 'mia', 'san-francisco': 'sfo', 'washington-dc': 'was',
  'san-diego': 'san', 'atlanta': 'atl', 'austin': 'aus',
  'lisbon': 'lis', 'sao-paulo': 'sao', 'rio-de-janeiro': 'rio',
  'mexico-city': 'mex', 'buenos-aires': 'bue', 'montreal': 'mtl',
  'berlin': 'ber', 'hamburg': 'ham', 'vienna': 'vie', 'munchen': 'muc',
  'dublin': 'dub', 'sydney': 'syd', 'melbourne': 'mel', 'brisbane': 'bri',
  'toronto': 'tor', 'roma': 'rom', 'milano': 'mil',
};

const DEFAULT_UTM_PARAMS = {
  utm_source: 'celebratevalentines',
  utm_medium: 'organiclanding',
  utm_content: 'valentines',
};

function getCityCode(citySlug: string): string {
  const normalized = citySlug.toLowerCase();
  return CITY_UTM_CODES[normalized] ?? 'gen';
}

function cleanPlanId(planId: string | null | undefined): string | null {
  if (!planId) return null;
  
  let cleaned = planId.toString();
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {}
  
  cleaned = cleaned.replace(/[^\d]/g, '');
  return cleaned.length > 0 ? cleaned : null;
}

function extractPlanIdFromLink(link: string): string | null {
  const match = link.match(/\/m\/(\d+)/);
  if (match) return match[1];
  
  try {
    const url = new URL(link);
    const urlMatch = url.pathname.match(/\/m\/(\d+)/);
    return urlMatch ? urlMatch[1] : null;
  } catch {
    return null;
  }
}

export function buildPlanUtmUrl(
  planLink: string,
  planId: string | null | undefined,
  citySlug: string,
  incomingParams?: Record<string, string>
): string {
  const rawPlanId = planId || extractPlanIdFromLink(planLink);
  const finalPlanId = cleanPlanId(rawPlanId);
  
  if (!finalPlanId) {
    console.warn('Could not determine plan ID for UTM tracking:', planLink);
    if (incomingParams && Object.keys(incomingParams).length > 0) {
      try {
        const url = new URL(planLink);
        Object.entries(incomingParams).forEach(([key, value]) => {
          if (key && value) {
            url.searchParams.set(key, value);
          }
        });
        return url.toString();
      } catch {
        return planLink;
      }
    }
    return planLink;
  }

  const cityCode = getCityCode(citySlug);
  const utmCampaign = `${finalPlanId}_${cityCode}`;

  try {
    let url: URL;
    try {
      url = new URL(planLink);
    } catch {
      const base = typeof window !== 'undefined' 
        ? getNormalizedOrigin() 
        : 'https://feverup.com';
      url = new URL(planLink, base);
    }
    
    const utmParams: Record<string, string> = {
      ...DEFAULT_UTM_PARAMS,
    };
    
    if (incomingParams) {
      if (incomingParams.utm_source) {
        utmParams.utm_source = incomingParams.utm_source;
      }
      if (incomingParams.utm_medium) {
        utmParams.utm_medium = incomingParams.utm_medium;
      }
      if (incomingParams.utm_content) {
        utmParams.utm_content = incomingParams.utm_content;
      }
      Object.entries(incomingParams).forEach(([key, value]) => {
        if (key && value && !key.startsWith('utm_')) {
          if (!url.searchParams.has(key)) {
            url.searchParams.set(key, value);
          }
        }
      });
    }
    
    utmParams.utm_campaign = utmCampaign;
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    console.warn('Error building UTM URL, using fallback:', error);
    const params = new URLSearchParams();
    
    Object.entries(DEFAULT_UTM_PARAMS).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    if (incomingParams) {
      if (incomingParams.utm_source) params.set('utm_source', incomingParams.utm_source);
      if (incomingParams.utm_medium) params.set('utm_medium', incomingParams.utm_medium);
      if (incomingParams.utm_content) params.set('utm_content', incomingParams.utm_content);
    }
    
    params.set('utm_campaign', utmCampaign);
    
    const separator = planLink.includes('?') ? '&' : '?';
    return `${planLink}${separator}${params.toString()}`;
  }
}
```

---

## 6. 🔧 Utilidades (`src/lib/utils/basepath.ts`)

Utilidades para manejo de URLs y base paths.

```typescript
/**
 * Get the normalized origin (without port for production)
 * In production, always returns https://celebratevalentines.com
 * In development, returns the current origin with port
 */
export function getNormalizedOrigin(): string {
  if (typeof window === 'undefined') {
    // Server-side: use production URL
    return 'https://celebratevalentines.com';
  }
  
  // Client-side: check if we're in production
  const hostname = window.location.hostname;
  const isProduction = hostname === 'celebratevalentines.com' || hostname === 'www.celebratevalentines.com';
  
  if (isProduction) {
    // Always use HTTPS without port in production
    return 'https://celebratevalentines.com';
  }
  
  // Development: return current origin (with port if needed)
  return window.location.origin;
}

/**
 * Helper function to get the base path for static assets
 * For Google Cloud Platform deployment with custom domain, basePath is always empty
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      return '';
    }
    
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.basePath) {
      return nextData.basePath;
    }
    if (nextData?.assetPrefix) {
      return nextData.assetPrefix;
    }
  }
  
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return '';
  }
  
  return '';
}

/**
 * Adds basePath to a static asset path
 */
export function withBasePath(path: string): string {
  const basePath = getBasePath();
  if (!basePath) return path;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
```

---

## 7. 🌍 Internacionalización (`src/i18n.ts`)

Configuración de next-intl para multiidioma.

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    locale = 'en';
  }

  if (!locales.includes(locale as Locale)) {
    console.error(`Invalid locale: ${locale}`);
    notFound();
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    notFound();
  }
});
```

---

## 8. ⚙️ Configuración Next.js (`next.config.js`)

Configuración principal de Next.js.

```javascript
const createNextIntlPlugin = require('next-intl/plugin')(
  './src/i18n.ts'
);

const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || 
                      process.env.STATIC_EXPORT === 'true' || 
                      process.env.DOCKER === 'true' || 
                      process.env.NODE_ENV === 'production';
const hasCustomDomain = process.env.CUSTOM_DOMAIN === 'true' || 
                       process.env.CNAME_DOMAIN === 'true';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isStaticExport ? {
    output: 'export',
    basePath: '',
    assetPrefix: '',
    trailingSlash: true,
  } : {}),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        'tailwind-merge': require.resolve('tailwind-merge'),
      };
    } catch (error) {
      // Continue without alias
    }
    
    return config;
  },
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'applications-media.feverup.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.feverup.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'feverup.com',
        port: '',
        pathname: '/**',
      }
    ],
  }
};

module.exports = createNextIntlPlugin(nextConfig);
```

---

## 📋 Resumen de Archivos Backend

| Archivo | Función | Tipo |
|---------|---------|------|
| `middleware.ts` | Internacionalización y detección de idioma | Middleware |
| `src/app/sitemap.ts` | Generación de sitemap XML | Route Handler |
| `src/app/robots.ts` | Generación de robots.txt | Route Handler |
| `src/lib/valentines/service.ts` | Servicio de datos (Google Sheets) | Service |
| `src/lib/valentines/utm.ts` | Tracking UTM | Utility |
| `src/lib/utils/basepath.ts` | Utilidades de URLs | Utility |
| `src/i18n.ts` | Configuración i18n | Config |
| `next.config.js` | Configuración Next.js | Config |

---

## 🎯 Características Principales

- ✅ **Middleware**: Detección automática de idioma por geolocalización
- ✅ **Sitemap**: Generación dinámica de 936 URLs
- ✅ **Robots**: Configuración para crawlers y AI bots
- ✅ **Service**: Fetch de datos desde Google Sheets con retry
- ✅ **UTM Tracking**: Tracking preciso de campañas
- ✅ **i18n**: Soporte para 6 idiomas (en, es, fr, de, it, pt)
- ✅ **Static Export**: Configuración para export estático

---

**Nota**: Este proyecto usa **Static Export** (`output: 'export'`), por lo que no hay rutas API tradicionales (`/api/*`). Toda la lógica del servidor se ejecuta en build time o en el middleware.
