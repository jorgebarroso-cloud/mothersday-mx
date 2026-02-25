import { getValentinesData } from '@/lib/valentines/service';
import { filterPlansByPageType } from '@/lib/valentines/filters';
import { CategoryPageView } from '@/components/valentines/category-page-view';
import { Footer } from '@/components/layout/footer';
import { getPageTypeSEOKeywords } from '@/lib/seo/city-keywords';
import { StructuredData } from '@/components/seo/structured-data';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import { normalizeCitySlug } from '@/lib/utils';

// City display names (same as main city page)
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

// Include alternate slugs so /en/lisboa/... etc. are generated (normalizeCitySlug maps lisboa -> lisbon)
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
  const seoKeywords = getPageTypeSEOKeywords(citySlug, 'gifts', locale as Locale);
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const title = t('cityPageGiftsTitle', { city: cityName });
  const description = t('cityPageGiftsDescription', { city: cityName });
  
  // Combine brand and non-brand keywords
  const allKeywords = [...seoKeywords.brand, ...seoKeywords.nonBrand];
  
  // Build URL with locale
  const basePath = `/${locale}/${citySlug}/gifts/`;
  const canonicalUrl = `https://celebratemothersday.com${basePath}`;
  
  // Map locale to OpenGraph locale
  const ogLocale = locale === 'en' ? 'en_US' : 
                   locale === 'es' ? 'es_ES' : 
                   locale === 'fr' ? 'fr_FR' : 
                   locale === 'de' ? 'de_DE' : 
                   locale === 'it' ? 'it_IT' : 'pt_PT';
  
  // Skyline image
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
      title,
      description,
      locale: ogLocale,
      type: 'website',
      url: canonicalUrl,
      siteName: "Celebrate Valentine's",
      images: [
        {
          url: skylineImageUrl,
          width: 1200,
          height: 630,
          alt: `${cityName} skyline - Valentine's Day Gifts`,
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
        'en': `https://celebratemothersday.com/en/${citySlug}/gifts/`,
        'es': `https://celebratemothersday.com/es/${citySlug}/gifts/`,
        'fr': `https://celebratemothersday.com/fr/${citySlug}/gifts/`,
        'de': `https://celebratemothersday.com/de/${citySlug}/gifts/`,
        'it': `https://celebratemothersday.com/it/${citySlug}/gifts/`,
        'pt': `https://celebratemothersday.com/pt/${citySlug}/gifts/`,
        'x-default': `https://celebratemothersday.com/en/${citySlug}/gifts/`,
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

export default async function GiftsPage({ params }: { params: Promise<{ locale: string; city: string }> }) {
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
    
    // Fetch data for the specific city
    let data;
    try {
      data = await getValentinesData(citySlug, lang);
    } catch (error) {
      console.error(`Error fetching data for ${citySlug}:`, error);
      data = { top3: [], categories: {}, candlelight: [], all: [] };
    }
    
    // Filter plans for gifts page
    const filteredPlans = filterPlansByPageType(data.all, 'gifts');
    
    const basePath = `/${locale}/${citySlug}/gifts/`;
    const canonicalUrl = `https://celebratemothersday.com${basePath}`;
    
    // Prepare plans for structured data (eventDates + priceValue for schema Event/Product)
    const plansForStructuredData = filteredPlans.slice(0, 20).map(plan => ({
      id: plan.id,
      title: plan.title,
      venue: plan.venue,
      price: plan.price,
      link: plan.link,
      imageUrl: plan.imageUrl,
      priceValue: plan.priceValue,
      eventDates: plan.eventDates,
    }));

    return (
      <>
        <StructuredData 
          type="gifts" 
          cityName={cityName} 
          citySlug={citySlug} 
          url={canonicalUrl}
          plans={plansForStructuredData}
        />
        {/* Visible fallback for crawlers: title + links always in HTML so content is visible on every page */}
        <section
          aria-label="Valentine's Day Gifts in city"
          className="relative z-0 py-4 px-4 md:px-6 bg-gradient-to-r from-[#FF1493]/90 via-[#FF3366]/90 to-[#FF6B9D]/90 text-white border-b border-white/20"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center text-white drop-shadow-sm">
            Valentine&apos;s Day Gifts in {cityName}
          </h2>
          <p className="text-center text-sm text-white/90">
            <a href={`/${locale}/${citySlug}/`} className="underline">Back to {cityName}</a>
            {' · '}
            <a href={`/${locale}/${citySlug}/gifts/`} className="underline">Gifts</a>
            {' · '}
            <a href={`/${locale}/${citySlug}/restaurants/`} className="underline">Restaurants</a>
            {' · '}
            <a href={`/${locale}/${citySlug}/valentines-day/ideas/`} className="underline">Ideas</a>
            {' · '}
            <a href={`/${locale}/${citySlug}/valentines-day/last-minute/`} className="underline">Last minute</a>
          </p>
        </section>
        <CategoryPageView 
          plans={filteredPlans}
          city={cityName}
          citySlug={citySlug}
          pageType="gifts"
          lang={lang}
        />
        <Footer lang={lang} currentCity={citySlug} />
      </>
    );
  } catch (error) {
    console.error('Error in GiftsPage:', error);
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
