/**
 * Structured Data (JSON-LD) for SEO
 * Helps search engines understand the content better
 * Event schema: location, startDate (required); endDate, offers, eventStatus, performer, organizer (recommended)
 */

import { buildPlanUtmUrl } from '@/lib/valentines/utm';

// ISO 4217 currency by city slug (for schema.org Offer priceCurrency)
const CITY_CURRENCY_ISO: Record<string, string> = {
  madrid: 'EUR', barcelona: 'EUR', valencia: 'EUR', paris: 'EUR', lyon: 'EUR', lisbon: 'EUR',
  berlin: 'EUR', hamburg: 'EUR', vienna: 'EUR', dublin: 'EUR', munchen: 'EUR', roma: 'EUR', milano: 'EUR',
  'new-york': 'USD', 'los-angeles': 'USD', chicago: 'USD', miami: 'USD', 'san-francisco': 'USD',
  'washington-dc': 'USD', 'san-diego': 'USD', atlanta: 'USD', austin: 'USD',
  london: 'GBP',
  'sao-paulo': 'BRL', 'mexico-city': 'MXN', 'buenos-aires': 'ARS',
  sydney: 'AUD', melbourne: 'AUD', brisbane: 'AUD',
  toronto: 'CAD', montreal: 'CAD',
};

export interface PlanStructuredData {
  id: string;
  title: string;
  venue: string;
  price: string;
  link: string;
  imageUrl?: string;
  priceValue?: number;
  eventDates?: Date[];
}

interface StructuredDataProps {
  type: 'city' | 'home' | 'gifts' | 'restaurants' | 'ideas' | 'last-minute';
  cityName?: string;
  citySlug?: string;
  url: string;
  plans?: PlanStructuredData[];
  /** Locale (e.g. en, es) for home WebSite url and breadcrumb Home links */
  locale?: string;
}

export function StructuredData({ type, cityName, citySlug, url, plans = [], locale: localeProp }: StructuredDataProps) {
  const baseUrl = 'https://celebratemothersday.com';
  const localeFromUrl = url.replace(baseUrl, '').split('/').filter(Boolean)[0] || 'en';
  const locale = localeProp || localeFromUrl;
  const homeUrl = `${baseUrl}/${locale}/`;

  if (type === 'home') {
    const homeStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: "Celebrate Valentine's",
      url: homeUrl,
      description: "Global guide to romantic Valentine's Day 2026 plans, gifts, and experiences in cities worldwide.",
    };

    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: "Celebrate Valentine's",
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.svg`,
        width: 512,
        height: 512
      },
      description: "Curated guide to the best Valentine's Day 2026 plans, romantic dinners, gifts, and experiences in major cities.",
      foundingDate: '2024',
      sameAs: []
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </>
    );
  }

  // Handle category-specific pages (gifts, restaurants, ideas, last-minute)
  if (type === 'gifts' || type === 'restaurants' || type === 'ideas' || type === 'last-minute') {
    return generateCategoryPageStructuredData(type, cityName!, citySlug!, url, plans);
  }

  // City page: derive locale from url for breadcrumb (e.g. /es/madrid/ -> es)
  const cityPathParts = url.replace(baseUrl, '').split('/').filter(Boolean);
  const cityLocale = cityPathParts[0] || 'en';
  const cityHomeUrl = `${baseUrl}/${cityLocale}/`;

  const cityStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Valentine's Day in ${cityName}`,
    description: `Curated Valentine's Day 2026 plans, gifts, restaurants, and romantic experiences in ${cityName}. Book dinners, concerts & unique dates.`,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      name: `Valentine's Day plans in ${cityName}`,
      description: `Romantic experiences, gifts, and date ideas in ${cityName} for Valentine's Day 2026`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: cityHomeUrl },
        { '@type': 'ListItem', position: 2, name: `Valentine's Day in ${cityName}`, item: url }
      ]
    },
    about: {
      '@type': 'LocalBusiness',
      name: `Valentine's Day guide – ${cityName}`,
      description: `Curated guide to Valentine's Day 2026 plans, gifts, and romantic experiences in ${cityName}.`,
      url: url,
      address: { '@type': 'PostalAddress', addressLocality: cityName },
    }
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: cityHomeUrl },
      { '@type': 'ListItem', position: 2, name: `Valentine's Day in ${cityName}`, item: url }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

const DEFAULT_EVENT_START = '2026-02-14T19:00:00+00:00';
const DEFAULT_EVENT_END = '2026-02-14T23:00:00+00:00';

function toISO8601Start(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear(), m = pad(d.getMonth() + 1), day = pad(d.getDate());
  return `${y}-${m}-${day}T19:00:00+00:00`;
}
function toISO8601End(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear(), m = pad(d.getMonth() + 1), day = pad(d.getDate());
  return `${y}-${m}-${day}T23:00:00+00:00`;
}

function getCategoryListDescription(
  pageType: 'gifts' | 'restaurants' | 'ideas' | 'last-minute',
  pageTypeName: string,
  cityName: string
): string {
  const base = `Valentine's Day 2026 ${pageTypeName.toLowerCase()} in ${cityName}.`;
  if (pageType === 'gifts') return `${base} Curated gifts and experiences to book.`;
  if (pageType === 'restaurants') return `${base} Romantic dinners and dining experiences.`;
  if (pageType === 'ideas') return `${base} Events, concerts, workshops and date ideas.`;
  return `${base} Last-minute bookable plans and experiences.`;
}

function getCategoryPageDescription(
  pageType: 'gifts' | 'restaurants' | 'ideas' | 'last-minute',
  pageTypeName: string,
  cityName: string
): string {
  const base = `Best ${pageTypeName.toLowerCase()} in ${cityName} for Valentine's Day 2026.`;
  if (pageType === 'gifts') return `${base} Book gifts and romantic experiences.`;
  if (pageType === 'restaurants') return `${base} Romantic restaurants and dinners.`;
  if (pageType === 'ideas') return `${base} Events, concerts and date ideas.`;
  return `${base} Last-minute plans you can book now.`;
}

/**
 * Generate structured data for category-specific pages
 */
function generateCategoryPageStructuredData(
  pageType: 'gifts' | 'restaurants' | 'ideas' | 'last-minute',
  cityName: string,
  citySlug: string,
  url: string,
  plans: PlanStructuredData[]
) {
  const baseUrl = 'https://celebratemothersday.com';
  const pageTypeNames = {
    'gifts': "Valentine's Day Gifts",
    'restaurants': 'Romantic Restaurants',
    'ideas': "Valentine's Day Ideas",
    'last-minute': 'Last-Minute Valentine\'s Plans',
  };

  const pageTypeName = pageTypeNames[pageType];
  const pathParts = url.replace(baseUrl, '').split('/').filter(Boolean);
  const locale = pathParts[0] || 'en';
  const cityUrl = pathParts.length >= 2 ? `${baseUrl}/${locale}/${pathParts[1]}/` : `${baseUrl}/${locale}/${citySlug}/`;
  const priceCurrency = CITY_CURRENCY_ISO[citySlug?.toLowerCase() ?? ''] ?? 'EUR';

  let itemSchemaType: 'Event' | 'Product' | 'Restaurant' = 'Event';
  if (pageType === 'gifts') itemSchemaType = 'Product';
  if (pageType === 'restaurants') itemSchemaType = 'Restaurant';

  const itemListElements = plans.slice(0, 20).map((plan, index) => {
    const hasDates = (plan.eventDates?.length ?? 0) > 0;
    const startDate = hasDates ? toISO8601Start(plan.eventDates![0]) : DEFAULT_EVENT_START;
    const endDate = hasDates
      ? toISO8601End(plan.eventDates![plan.eventDates!.length - 1])
      : DEFAULT_EVENT_END;
    const planUrl = citySlug ? buildPlanUtmUrl(plan.link, plan.id, citySlug) : plan.link;

    const baseItem: Record<string, unknown> = {
      '@type': itemSchemaType,
      name: plan.title,
      description: `${plan.title} – ${plan.venue}, ${cityName}. ${pageTypeName} for Valentine's Day 2026.`,
      url: planUrl,
      ...(plan.imageUrl && { image: plan.imageUrl }),
    };

    if (itemSchemaType === 'Event') {
      Object.assign(baseItem, {
        location: {
          '@type': 'Place',
          name: plan.venue || cityName,
          address: {
            '@type': 'PostalAddress',
            addressLocality: cityName,
          },
        },
        startDate,
        endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        performer: {
          '@type': 'PerformingGroup',
          name: plan.venue || 'Various',
        },
        organizer: {
          '@type': 'Organization',
          name: 'Celebrate Valentines',
          url: baseUrl,
        },
        ...(typeof plan.priceValue === 'number' && plan.priceValue > 0 && {
          offers: {
            '@type': 'Offer',
            price: plan.priceValue,
            priceCurrency,
            url: planUrl,
          },
        }),
        ...(pageType === 'last-minute' && { availabilityStarts: new Date().toISOString() }),
      });
    }

    if (itemSchemaType === 'Product') {
      const numPrice = typeof plan.priceValue === 'number' && plan.priceValue > 0
        ? plan.priceValue
        : (parseFloat(String(plan.price).replace(/[^\d.]/g, '')) || 0);
      Object.assign(baseItem, {
        category: "Valentine's Day Gift",
        ...(numPrice > 0 && {
          offers: {
            '@type': 'Offer',
            price: numPrice,
            priceCurrency,
            url: planUrl,
          },
        }),
      });
    }

    if (itemSchemaType === 'Restaurant') {
      Object.assign(baseItem, {
        servesCuisine: 'Romantic Dining',
        address: {
          '@type': 'PostalAddress',
          addressLocality: cityName,
        },
        ...(typeof plan.priceValue === 'number' && plan.priceValue > 0 && {
          offers: {
            '@type': 'Offer',
            price: plan.priceValue,
            priceCurrency,
            url: planUrl,
          },
        }),
      });
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: baseItem,
    };
  });

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pageTypeName} in ${cityName}`,
    description: getCategoryListDescription(pageType, pageTypeName, cityName),
    numberOfItems: plans.length,
    itemListElement: itemListElements,
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}/` },
      { '@type': 'ListItem', position: 2, name: `Valentine's Day in ${cityName}`, item: cityUrl },
      { '@type': 'ListItem', position: 3, name: pageTypeName, item: url },
    ],
  };

  const collectionPageData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${pageTypeName} in ${cityName}`,
    description: getCategoryPageDescription(pageType, pageTypeName, cityName),
    url: url,
    mainEntity: itemList,
    breadcrumb: breadcrumbData,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
