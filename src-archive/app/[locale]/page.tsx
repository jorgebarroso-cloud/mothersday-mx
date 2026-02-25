import { HeroSection } from '@/components/valentines/hero-section';
import { GlobalGuideSection } from '@/components/valentines/global-guide-section';
import { CitySelector } from '@/components/valentines/city-selector';
import { TestimonialsSection } from '@/components/valentines/testimonials-section';
import { WhyCelebrateSection } from '@/components/valentines/why-celebrate-section';
import { WhyUsSection } from '@/components/valentines/why-us-section';
import { Footer } from '@/components/layout/footer';
import { StructuredData } from '@/components/seo/structured-data';
import type { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // Get translations - access Metadata namespace directly
  let title: string;
  let description: string;
  
  try {
    const t = await getTranslations({ locale });
    // Access nested namespace using dot notation
    title = t('Metadata.homeTitle');
    description = t('Metadata.homeDescription');
  } catch (error) {
    // Fallback to English if translation fails
    console.error('Error loading metadata translations:', error);
    title = "Valentine's Day 2026: Best Romantic Plans & Dinners";
    description = "Explore romantic plans for Valentine's Day 2026. Book top dinners, concerts & unique getaways in NYC, Paris, Madrid & more. Make it unforgettable.";
  }
  
  return {
    title,
    description,
    keywords: [
      "Valentine's Day 2026",
      "romantic dinner",
      "date ideas",
      "valentine's getaways",
      "couple activities",
      "romantic hotels",
      "valentine's day plans",
      "candlelight dinners",
      "romantic experiences",
      "valentine's day 2026",
      "romantic getaways",
      "couple date ideas"
    ],
    authors: [{ name: 'CelebrateValentines' }],
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
    openGraph: {
      title,
      description,
      url: `https://celebratemothersday.com/${locale}/`,
      siteName: "CelebrateValentines",
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : locale === 'de' ? 'de_DE' : locale === 'it' ? 'it_IT' : 'pt_PT',
      type: 'website',
      images: [
        {
          url: 'https://celebratemothersday.com/images/posters/skyline-paris.jpg',
          width: 1200,
          height: 630,
          alt: "Romantic Valentine's Day dinner and experiences - CelebrateValentines 2026",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://celebratemothersday.com/${locale}/`,
      languages: {
        'en': 'https://celebratemothersday.com/en/',
        'es': 'https://celebratemothersday.com/es/',
        'fr': 'https://celebratemothersday.com/fr/',
        'de': 'https://celebratemothersday.com/de/',
        'it': 'https://celebratemothersday.com/it/',
        'pt': 'https://celebratemothersday.com/pt/',
        'x-default': 'https://celebratemothersday.com/en/',
      },
    },
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
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  try {
    const { locale } = await params;
    const baseUrl = `https://celebratemothersday.com/${locale}`;
    
    return (
      <>
        <StructuredData type="home" url={baseUrl} locale={locale} />
        {/* Hero Section with Search - height reduced on mobile so content below is visible in first viewport (GSC) */}
        <HeroSection />
        
        {/* Global Guide Section */}
        <GlobalGuideSection />
        
        {/* City Selector */}
        <CitySelector />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Why Celebrate Valentine's Day Section */}
        <WhyCelebrateSection />
        
        {/* Why Us Section - Consolidated */}
        <WhyUsSection />
        
        {/* Footer */}
        <Footer lang={locale as Locale} />
      </>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    // Fallback page to prevent build failure
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
