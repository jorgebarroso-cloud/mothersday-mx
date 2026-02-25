import Papa from 'papaparse';
import { TORONTO_MANUAL_PLANS } from './toronto-manual-data';
import { BUENOS_AIRES_MANUAL_PLANS } from './buenos-aires-manual-data';
import { MEXICO_CITY_MANUAL_PLANS } from './mexico-city-manual-data';
import { MONTREAL_MANUAL_PLANS } from './montreal-manual-data';
import { MUENCHEN_MANUAL_PLANS } from './munchen-manual-data';
import { ROMA_MANUAL_PLANS } from './roma-manual-data';
import { MILANO_MANUAL_PLANS } from './milano-manual-data';

// Mother's Day: set NEXT_PUBLIC_MOTHERS_DAY_CSV_URL to your Google Sheet (publish to web as CSV). Fallback for build.
const VALENTINES_CSV_URL = process.env.NEXT_PUBLIC_MOTHERS_DAY_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy4RXQSf-fbha0HGpXaM3qAfaomLcUCHRoQ-qWGG4OCZfRH3zOrXDLcmn1yOeMnnik2yMujklPqYTK/pub?gid=43890264&single=true&output=csv';

// Category translations (same sheet or set NEXT_PUBLIC_MOTHERS_DAY_CATEGORIES_CSV_URL)
const CATEGORY_TRANSLATIONS_CSV_URL = process.env.NEXT_PUBLIC_MOTHERS_DAY_CATEGORIES_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy4RXQSf-fbha0HGpXaM3qAfaomLcUCHRoQ-qWGG4OCZfRH3zOrXDLcmn1yOeMnnik2yMujklPqYTK/pub?gid=546673371&single=true&output=csv';

// City slug to ID mapping (from the actual data in Google Sheet)
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
  'toronto': '99', // Manual data - using placeholder ID
  'buenos-aires': '100', // Manual data - using placeholder ID
  'mexico-city': '101', // Manual data - using placeholder ID
  'montreal': '102', // Manual data - using placeholder ID
  'munchen': '103', // Manual data - using placeholder ID
  'roma': '104', // Manual data - using placeholder ID
  'milano': '105', // Manual data - using placeholder ID
};

// Currency by city
const CITY_CURRENCY: Record<string, string> = {
  'madrid': '€',
  'barcelona': '€',
  'valencia': '€',
  'london': '£',
  'paris': '€',
  'lyon': '€',
  'lisbon': '€',
  'berlin': '€',
  'hamburg': '€',
  'vienna': '€',
  'dublin': '€',
  'new-york': '$',
  'los-angeles': '$',
  'chicago': '$',
  'miami': '$',
  'san-francisco': '$',
  'washington-dc': '$',
  'san-diego': '$',
  'atlanta': '$',
  'austin': '$',
  'sao-paulo': 'R$',
  'mexico-city': 'MX$',
  'sydney': 'A$',
  'melbourne': 'A$',
  'brisbane': 'A$',
  'toronto': 'CA$',
  'buenos-aires': 'ARS$',
  'montreal': 'CA$',
  'munchen': '€',
  'roma': '€',
  'milano': '€',
};

export interface ValentinePlan {
  id: string;
  title: string;
  venue: string;
  price: string;
  priceValue: number; // Numeric price for filtering
  link: string;
  imageUrl: string;
  rank: number;
  categories: string[]; // All valid category keys
  city: string;
  isCandlelight: boolean; // Whether this is a Candlelight experience
  eventDates: Date[]; // Available dates for this plan
}

export interface ValentinesData {
  top3: ValentinePlan[];
  categories: Record<string, ValentinePlan[]>;
  candlelight: ValentinePlan[]; // Separate Candlelight section
  all: ValentinePlan[];
}

// Helper to clean price string and return both formatted string and numeric value
const extractPrice = (sessionStr: string): { formatted: string; value: number } => {
  if (!sessionStr) return { formatted: '', value: 0 };
  
  // ds_session_prices format is comma-separated prices like "33.0,61.5,31.5,49.0"
  // Split by comma and parse each price
  const priceStrings = sessionStr.split(',').map(s => s.trim()).filter(s => s);
  
  const prices: number[] = [];
  for (const priceStr of priceStrings) {
    // Parse the price (handle both . and , as decimal separators)
    const parsed = parseFloat(priceStr.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      prices.push(parsed);
    }
  }
  
  if (prices.length === 0) return { formatted: '', value: 0 };
  
  const minPrice = Math.min(...prices);
  
  // Round to whole number for display
  return { formatted: Math.round(minPrice).toString(), value: minPrice };
};

// Valid Valentine's Day categories (only these should be used)
const VALID_CATEGORIES = [
  'concerts-musicals-theater',
  'valentines-related-events',
  'food',
  'workshops-and-activities',
  'wellness-and-relaxation'
];

// Helper to extract ALL valid category keys from comma-separated list
const extractCategoryKeys = (categoryStr: string): string[] => {
  if (!categoryStr) return [];
  
  const tags = categoryStr.split(',').map(s => s.trim().toLowerCase());
  
  // Find ALL tags that match valid categories
  return tags.filter(tag => VALID_CATEGORIES.includes(tag));
};

// Helper to parse event_dates column (format: comma-separated yyyymmdd)
const parseEventDates = (datesStr: string): Date[] => {
  if (!datesStr) return [];
  
  const dateStrings = datesStr.split(',').map(s => s.trim()).filter(s => s);
  const dates: Date[] = [];
  
  for (const dateStr of dateStrings) {
    // Parse yyyymmdd format
    if (dateStr.length === 8) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
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

// Helper to clean plan ID (same as in CSV processing)
function cleanPlanIdForManual(rawId: string): string {
  if (!rawId) return '';
  let cleaned = rawId.toString();
  // Decode URL encoding (e.g., %2C -> comma)
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // If decoding fails, continue with original
  }
  // Remove all non-digit characters
  cleaned = cleaned.replace(/[^\d]/g, '');
  return cleaned;
}

// Process manual data (e.g., Toronto) - same logic as CSV processing
async function processManualData(plans: ValentinePlan[]): Promise<ValentinesData> {
  // Fetch translations for category names
  let translations: Record<string, Record<string, string>> = {};
  try {
    translations = await fetchTranslations();
  } catch (error) {
    console.warn('Failed to fetch translations, using defaults');
  }

  // Clean all plan IDs to ensure consistency (remove commas, spaces, URL encoding, etc.)
  const cleanedPlans = plans.map(plan => ({
    ...plan,
    id: cleanPlanIdForManual(plan.id)
  }));

  // Sort by rank
  const sortedPlans = [...cleanedPlans].sort((a, b) => a.rank - b.rank);

  // Top 3 - with max 1 Candlelight experience
  const top3: ValentinePlan[] = [];
  const usedIds = new Set<string>();
  let candlelightInTop3 = false;
  
  // First pass: iterate through all plans sorted by rank
  for (const plan of sortedPlans) {
    if (top3.length >= 3) break;
    
    if (plan.isCandlelight) {
      if (!candlelightInTop3) {
        // First candlelight (best ranked) - include it
        top3.push(plan);
        usedIds.add(plan.id);
        candlelightInTop3 = true;
      }
      // Skip additional candlelights - they'll be picked up in remaining
    } else {
      // Non-candlelight - always include if we have room
      top3.push(plan);
      usedIds.add(plan.id);
    }
  }
  
  // If we still don't have 3 (e.g., not enough non-CDL plans), fill with any remaining
  for (const plan of sortedPlans) {
    if (top3.length >= 3) break;
    if (!usedIds.has(plan.id)) {
      top3.push(plan);
      usedIds.add(plan.id);
    }
  }
  
  // Ensure top3 is sorted by rank
  top3.sort((a, b) => a.rank - b.rank);

  // Remaining for categories - exclude top3 plans
  const remaining = sortedPlans.filter(p => !usedIds.has(p.id));
  
  // Separate Candlelight plans
  const candlelightPlans = remaining.filter(p => p.isCandlelight);
  
  // Group by category - plans can appear in multiple categories
  const categories: Record<string, ValentinePlan[]> = {};
  remaining.forEach(plan => {
      plan.categories.forEach(categoryKey => {
          // If it's a candlelight plan, only include in valentines-related-events category
          if (plan.isCandlelight && categoryKey !== 'valentines-related-events') {
              return; // Skip adding to other categories
          }
          
          // Translate category key
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

// Fetch translations with retry (Valentine's sheet uses: Tag, CD_LOCALE, translation)
async function fetchTranslations(): Promise<Record<string, Record<string, string>>> {
  const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || process.env.STATIC_EXPORT === 'true' || process.env.DOCKER === 'true' || process.env.NODE_ENV === 'production';
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
      
      // Map: Key -> Language -> Translation
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

// Helper to find image column (heuristic: starts with http, contains image keywords or extension)
const findImageColumn = (row: any): string => {
  const keys = Object.keys(row);
  for (const key of keys) {
    // Skip known columns
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
  // Fallback: try looking for a column named 'image' or similar
  const imageKey = keys.find(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('img'));
  return imageKey ? row[imageKey] : '';
};

export async function getValentinesData(citySlug: string, language: string): Promise<ValentinesData> {
  try {
    // Check if we have manual data for this city (e.g., Toronto, Buenos Aires, Mexico City)
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
    
    // Get city ID from slug
    const targetCityId = CITY_ID_MAP[citySlug.toLowerCase()] || CITY_ID_MAP['madrid'];
    const currency = CITY_CURRENCY[citySlug.toLowerCase()] || '€';
    
    // Add timeout and retry to fetch for reliability during build
    // Use 'force-cache' for static export builds, 'no-store' for development
    const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || 
                          process.env.STATIC_EXPORT === 'true' || 
                          process.env.DOCKER === 'true' ||
                          process.env.NODE_ENV === 'production';
    const cacheOption = isStaticExport ? 'force-cache' : 'no-store';
    
    // Build-time data fetching (no logging in production)
    
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
          if (i < retries - 1) await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retry
        }
      }
      return null;
    };

    const [response, translations] = await Promise.all([
      fetchWithRetry(VALENTINES_CSV_URL),
      fetchTranslations().catch(() => ({}))
    ]);

    if (!response || !response.ok) {
      console.error(`❌ Failed to fetch Valentines CSV for ${citySlug} (ID: ${targetCityId}), returning empty data`);
      console.error(`   Response status: ${response?.status || 'no response'}`);
      return { top3: [], categories: {}, candlelight: [], all: [] };
    }
    
    const csvText = await response.text();
    
    // Check for HTML response (likely sign-in page or error)
    if (csvText.trim().toLowerCase().startsWith('<!doctype html') || csvText.trim().toLowerCase().startsWith('<html')) {
      console.error('❌ Error: The Google Sheet URL returned HTML instead of CSV.');
      console.error('   Please ensure the Google Sheet is "Published to the web" (File > Share > Publish to web).');
      console.error('   Received content preview:', csvText.substring(0, 500));
      return { top3: [], categories: {}, candlelight: [], all: [] };
    }

    // Parse CSV
    const { data, meta } = Papa.parse(csvText, { 
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    // Helper to clean plan ID: remove commas, spaces, URL encoding, keep only digits
    const cleanPlanId = (rawId: string): string => {
      if (!rawId) return '';
      let cleaned = rawId.toString();
      // Decode URL encoding (e.g., %2C -> comma)
      try {
        cleaned = decodeURIComponent(cleaned);
      } catch {
        // If decoding fails, continue with original
      }
      // Remove all non-digit characters
      cleaned = cleaned.replace(/[^\d]/g, '');
      return cleaned;
    };

    const plans: ValentinePlan[] = (data as any[]).map((row) => {
        // Map fields - clean the plan ID to remove commas, spaces, etc.
        const rawId = row['id_plan'] || '';
        const id = cleanPlanId(rawId);
        const title = row['ds_plan'] || '';
        const venue = row['ds_venue'] || '';
        const link = row['link_to_plan'] || ''; // Column H
        const rank = parseInt(row['rank'] || '999', 10); // Column M

        // Filter by target city ID
        const cityId = row['id_city'] || '';
        if (cityId !== targetCityId) {
          return null; // Skip plans not for this city
        }

        const rawCategory = row['category'] || ''; // Column N
        const categoryKeys = extractCategoryKeys(rawCategory);
        
        // Skip plans without any valid category
        if (categoryKeys.length === 0) {
          return null;
        }

        // Check if this is a Candlelight experience
        const isCandlelight = title.toLowerCase().includes('candlelight');

        const session = row['ds_session_prices'] || row['ds_session'] || '';
        
        // Price logic with dynamic currency
        // Euro goes after the number, other currencies go before
        const priceData = extractPrice(session);
        const price = priceData.formatted 
          ? (currency === '€' ? `From ${priceData.formatted}${currency}` : `From ${currency}${priceData.formatted}`)
          : '';
        
        // Image logic
        const imageUrl = row['image_link'] || findImageColumn(row);
        
        // Parse event dates
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
    }).filter((p): p is ValentinePlan => p !== null && p.id !== '' && p.title !== ''); // Filter nulls and validate

    const cityPlans = plans;

    // Sort by rank
    cityPlans.sort((a, b) => a.rank - b.rank);

    // Top 3 - with max 1 Candlelight experience
    // Strategy: Get the best 3 plans, but if more than 1 CDL would be included,
    // keep only the best-ranked CDL and replace others with next best non-CDL plans
    const top3: ValentinePlan[] = [];
    const usedIds = new Set<string>();
    let candlelightInTop3 = false;
    
    // First pass: iterate through all plans sorted by rank
    for (const plan of cityPlans) {
      if (top3.length >= 3) break;
      
      if (plan.isCandlelight) {
        if (!candlelightInTop3) {
          // First candlelight (best ranked) - include it
          top3.push(plan);
          usedIds.add(plan.id);
          candlelightInTop3 = true;
        }
        // Skip additional candlelights - they'll be picked up in remaining
      } else {
        // Non-candlelight - always include if we have room
        top3.push(plan);
        usedIds.add(plan.id);
      }
    }
    
    // If we still don't have 3 (e.g., not enough non-CDL plans), fill with any remaining
    for (const plan of cityPlans) {
      if (top3.length >= 3) break;
      if (!usedIds.has(plan.id)) {
        top3.push(plan);
        usedIds.add(plan.id);
      }
    }
    
    // Ensure top3 is sorted by rank (should already be, but just in case)
    top3.sort((a, b) => a.rank - b.rank);

    // Remaining for categories - exclude top3 plans
    const remaining = cityPlans.filter(p => !usedIds.has(p.id));
    
    // Separate Candlelight plans
    const candlelightPlans = remaining.filter(p => p.isCandlelight);
    
    // Group by category - plans can appear in multiple categories
    // Candlelight plans only go in "valentines-related-events" category (if applicable), not others
    const categories: Record<string, ValentinePlan[]> = {};
    remaining.forEach(plan => {
        plan.categories.forEach(categoryKey => {
            // If it's a candlelight plan, only include in valentines-related-events category
            if (plan.isCandlelight && categoryKey !== 'valentines-related-events') {
                return; // Skip adding to other categories
            }
            
            // Translate category key
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
    // Return empty data instead of throwing to allow build to continue
    return { top3: [], categories: {}, candlelight: [], all: [] };
  }
}
