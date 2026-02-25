import { getValentinesData } from '@/lib/valentines/service';
import { buildPlanUtmUrl } from '@/lib/valentines/utm';
import { ValentinesLandingView } from '@/components/valentines/valentines-landing-view';
import { Footer } from '@/components/layout/footer';
import { getCitySEOKeywords } from '@/lib/seo/city-keywords';
import { StructuredData } from '@/components/seo/structured-data';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import { normalizeCitySlug } from '@/lib/utils';

// Note: revalidate is not compatible with static export (output: 'export')
// Static export generates all pages at build time

// City display names
const CITY_NAMES: Record<string, string> = {
  'madrid': 'Madrid',
  'barcelona': 'Barcelona',
  'valencia': 'Valencia',
  'london': 'London',
  'paris': 'Paris',
  'lyon': 'Lyon',
  'new-york': 'New York',
  'los-angeles': 'Los Angeles',
  'chicago': 'Chicago',
  'miami': 'Miami',
  'san-francisco': 'San Francisco',
  'washington-dc': 'Washington DC',
  'san-diego': 'San Diego',
  'atlanta': 'Atlanta',
  'austin': 'Austin',
  'lisbon': 'Lisboa',
  'sao-paulo': 'São Paulo',
  'mexico-city': 'Mexico City',
  'berlin': 'Berlin',
  'hamburg': 'Hamburg',
  'vienna': 'Vienna',
  'dublin': 'Dublin',
  'sydney': 'Sydney',
  'melbourne': 'Melbourne',
  'brisbane': 'Brisbane',
  'toronto': 'Toronto',
  'buenos-aires': 'Buenos Aires',
  'montreal': 'Montréal',
  'munchen': 'München',
  'roma': 'Roma',
  'milano': 'Milano',
};

const CITIES_FOR_PARAMS = [...Object.keys(CITY_NAMES), 'lisboa'];

export async function generateStaticParams() {
  const allParams: Array<{ locale: string; city: string }> = [];
  for (const locale of locales) {
    for (const city of CITIES_FOR_PARAMS) {
      allParams.push({ locale, city });
    }
  }
  return allParams;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city } = await params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const citySlug = normalizeCitySlug(city);
  if (!CITY_NAMES[citySlug]) notFound();
  const cityName = CITY_NAMES[citySlug];
  const seoKeywords = getCitySEOKeywords(citySlug);
  
  // Title and description in the page language (for meta title, meta description, OG, Twitter)
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const title = t('cityPageTitle', { city: cityName });
  const description = t('cityPageDescription', { city: cityName });
  
  // Combine brand and non-brand keywords
  const allKeywords = [...seoKeywords.brand, ...seoKeywords.nonBrand];
  
  // Build URL with locale (always include locale prefix now)
  const basePath = `/${locale}/${citySlug}/`;
  const canonicalUrl = `https://celebratemothersday.com${basePath}`;
  
  // Map locale to OpenGraph locale
  const ogLocale = locale === 'en' ? 'en_US' : 
                   locale === 'es' ? 'es_ES' : 
                   locale === 'fr' ? 'fr_FR' : 
                   locale === 'de' ? 'de_DE' : 
                   locale === 'it' ? 'it_IT' : 'pt_PT';
  
  // Toronto, Buenos Aires, Montreal, München, Roma, and Milano use .png, other cities use .jpg
  const skylineImageExtension = (citySlug === 'toronto' || citySlug === 'buenos-aires' || citySlug === 'montreal' || citySlug === 'munchen' || citySlug === 'roma' || citySlug === 'milano') ? 'png' : 'jpg';
  const skylineImageUrl = `https://celebratemothersday.com/images/posters/skyline-${citySlug}.${skylineImageExtension}`;
  
  return {
    title,
    description,
    keywords: allKeywords,
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
    },
    openGraph: {
      title: seoKeywords.title,
      description: seoKeywords.description,
      locale: ogLocale,
      type: 'website',
      url: canonicalUrl,
      siteName: "Celebrate Valentine's",
      images: [
        {
          url: skylineImageUrl,
          width: 1200,
          height: 630,
          alt: `${cityName} skyline - Valentine's Day`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [skylineImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://celebratemothersday.com/en/${citySlug}/`,
        'es': `https://celebratemothersday.com/es/${citySlug}/`,
        'fr': `https://celebratemothersday.com/fr/${citySlug}/`,
        'de': `https://celebratemothersday.com/de/${citySlug}/`,
        'it': `https://celebratemothersday.com/it/${citySlug}/`,
        'pt': `https://celebratemothersday.com/pt/${citySlug}/`,
        'x-default': `https://celebratemothersday.com/en/${citySlug}/`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ locale: string; city: string }> }) {
  try {
    const { locale, city } = await params;
    
    // Validate locale
    if (!locales.includes(locale as Locale)) {
      notFound();
    }
    
    const citySlug = normalizeCitySlug(city);
    if (!CITY_NAMES[citySlug]) notFound();
    const cityName = CITY_NAMES[citySlug];
    const lang = locale as Locale;
    
    // Fetch data for the specific city with error handling
    let data;
    try {
      data = await getValentinesData(citySlug, lang);
    } catch (error) {
      console.error(`Error fetching data for ${citySlug}:`, error);
      data = { top3: [], categories: {}, candlelight: [], all: [] };
    }

    if (!data || data.all.length === 0) {
      let t;
      try {
        t = await getTranslations({ locale, namespace: 'Common' });
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback translations
        t = (key: string, params?: any) => {
          if (key === 'comingSoon') return 'Coming Soon';
          if (key === 'notAvailable') return `Content for ${params?.city || cityName} is not available yet`;
          if (key === 'checkBack') return 'Please check back later';
          return key;
        };
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF1493] via-[#FF3366] to-[#FF6B9D]">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">{t('comingSoon')}</h1>
            <p className="text-xl">{t('notAvailable', { city: cityName })}</p>
            <p className="mt-2 text-pink-200">{t('checkBack')}</p>
          </div>
        </div>
      );
    }

    const basePath = `/${locale}/${citySlug}/`;
    const canonicalUrl = `https://celebratemothersday.com${basePath}`;

    return (
      <>
        <StructuredData 
          type="city" 
          cityName={cityName} 
          citySlug={citySlug} 
          url={canonicalUrl}
        />
        {/* SEO: City name in HTML for crawlers - hidden visually but present in source */}
        <h1 className="sr-only">{cityName} - Valentine's Day 2026</h1>
        {/* Server-rendered content for crawlers: top plans as real <a> links so Googlebot sees content without JS */}
        {data.top3.length > 0 && (
          <section aria-label="Top romantic picks" className="sr-only">
            <h2 className="sr-only">Top 3 Romantic Picks in {cityName}</h2>
            <ul className="list-none p-0 m-0">
              {data.top3.slice(0, 3).map((plan) => (
                <li key={plan.id}>
                  <a href={buildPlanUtmUrl(plan.link, plan.id, citySlug)} target="_blank" rel="noopener noreferrer">{plan.title}</a>
                  <span> — {plan.venue}</span>
                  <span> — {plan.price}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <ValentinesLandingView data={data} city={cityName} citySlug={citySlug} lang={lang} />
        {/* Fallback visible when JS is disabled (e.g. crawlers that don't execute JS) */}
        <noscript>
          <section className="bg-pink-50 border border-pink-200 rounded-lg p-6 mx-4 my-6 max-w-2xl" aria-label="Content without JavaScript">
            <p className="font-semibold text-gray-800 mb-2">
              Valentine&apos;s Day plans in {cityName}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Enable JavaScript for the full experience, or use the links below:
            </p>
            <ul className="list-disc list-inside space-y-1 text-pink-700">
              {data.top3.slice(0, 3).map((plan) => (
                <li key={plan.id}>
                  <a href={buildPlanUtmUrl(plan.link, plan.id, citySlug)} target="_blank" rel="noopener noreferrer">{plan.title}</a>
                  <span className="text-gray-600"> — {plan.venue} · {plan.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <a href={`/${locale}/${citySlug}/gifts/`} className="text-pink-600 underline">Gifts</a>
              {' · '}
              <a href={`/${locale}/${citySlug}/restaurants/`} className="text-pink-600 underline">Restaurants</a>
              {' · '}
              <a href={`/${locale}/${citySlug}/valentines-day/ideas/`} className="text-pink-600 underline">Ideas</a>
              {' · '}
              <a href={`/${locale}/${citySlug}/valentines-day/last-minute/`} className="text-pink-600 underline">Last minute</a>
            </p>
          </section>
        </noscript>
        <Footer lang={lang} currentCity={citySlug} />
      </>
    );
  } catch (error) {
    console.error('Error in CityPage:', error);
    // Return a fallback page instead of crashing the build
      const t = await getTranslations('Common');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF1493] via-[#FF3366] to-[#FF6B9D]">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">{t('errorLoadingPage')}</h1>
            <p className="text-xl">{t('pleaseTryAgainLater')}</p>
          </div>
        </div>
      );
  }
}
