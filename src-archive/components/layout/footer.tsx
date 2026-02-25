'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Heart, ExternalLink, Home, FileText, Shield, Cookie, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@/i18n';

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

interface FooterProps {
  lang?: string;
  currentCity?: string;
}

type CitiesByRegion = Record<string, Array<{ name: string; slug: string; region: string }>>;
type CityNameTranslations = Record<string, Record<string, string>>;

const FEVER_LEGAL_BASE = 'https://feverup.com/legal';
function feverLegalUrl(type: 'terms' | 'privacy', locale: string): string {
  const suffix = ['en', 'es', 'fr', 'de', 'it', 'pt'].includes(locale) ? locale : 'es';
  return `${FEVER_LEGAL_BASE}/${type}_${suffix}.html`;
}

export function Footer({ lang = 'en', currentCity }: FooterProps) {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const termsUrl = feverLegalUrl('terms', lang);
  const privacyUrl = feverLegalUrl('privacy', lang);
  
  // Cities available in city selector and with content
  // Only cities that are in the city selector component
  const availableCities = [
    { slug: 'new-york', name: 'New York', region: 'North America' },
    { slug: 'los-angeles', name: 'Los Angeles', region: 'North America' },
    { slug: 'chicago', name: 'Chicago', region: 'North America' },
    { slug: 'london', name: 'London', region: 'Europe' },
    { slug: 'sydney', name: 'Sydney', region: 'Oceania' },
    { slug: 'melbourne', name: 'Melbourne', region: 'Oceania' },
    { slug: 'toronto', name: 'Toronto', region: 'North America' },
    { slug: 'madrid', name: 'Madrid', region: 'Europe' },
    { slug: 'barcelona', name: 'Barcelona', region: 'Europe' },
    { slug: 'mexico-city', name: 'Ciudad de México', region: 'North America' },
    { slug: 'buenos-aires', name: 'Buenos Aires', region: 'South America' },
    { slug: 'paris', name: 'Paris', region: 'Europe' },
    { slug: 'montreal', name: 'Montréal', region: 'North America' },
    { slug: 'berlin', name: 'Berlin', region: 'Europe' },
    { slug: 'munchen', name: 'München', region: 'Europe' },
    { slug: 'vienna', name: 'Vienna', region: 'Europe' },
    { slug: 'lisbon', name: 'Lisboa', region: 'Europe' },
    { slug: 'roma', name: 'Roma', region: 'Europe' },
    { slug: 'milano', name: 'Milano', region: 'Europe' },
  ];

  // City name translations by language
  const cityNameTranslations: CityNameTranslations = {
    'en': {
      'mexico-city': 'Mexico City',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montreal',
      'munchen': 'Munich',
      'vienna': 'Vienna',
      'lisbon': 'Lisbon',
      'roma': 'Rome',
      'milano': 'Milan',
    },
    'es': {
      'mexico-city': 'Ciudad de México',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montreal',
      'munchen': 'Múnich',
      'vienna': 'Viena',
      'lisbon': 'Lisboa',
      'roma': 'Roma',
      'milano': 'Milán',
    },
    'fr': {
      'mexico-city': 'Mexico',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montréal',
      'munchen': 'Munich',
      'vienna': 'Vienne',
      'lisbon': 'Lisbonne',
      'roma': 'Rome',
      'milano': 'Milan',
    },
    'de': {
      'mexico-city': 'Mexiko-Stadt',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montreal',
      'munchen': 'München',
      'vienna': 'Wien',
      'lisbon': 'Lissabon',
      'roma': 'Rom',
      'milano': 'Mailand',
    },
    'it': {
      'mexico-city': 'Città del Messico',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montreal',
      'munchen': 'Monaco',
      'vienna': 'Vienna',
      'lisbon': 'Lisbona',
      'roma': 'Roma',
      'milano': 'Milano',
    },
    'pt': {
      'mexico-city': 'Cidade do México',
      'buenos-aires': 'Buenos Aires',
      'montreal': 'Montreal',
      'munchen': 'Munique',
      'vienna': 'Viena',
      'lisbon': 'Lisboa',
      'roma': 'Roma',
      'milano': 'Milão',
    },
  };

  // Region translations
  const regionTranslations: Record<string, Record<string, string>> = {
    'en': {
      'North America': 'North America',
      'Europe': 'Europe',
      'Oceania': 'Oceania',
      'South America': 'South America',
    },
    'es': {
      'North America': 'América del Norte',
      'Europe': 'Europa',
      'Oceania': 'Oceanía',
      'South America': 'América del Sur',
    },
    'fr': {
      'North America': 'Amérique du Nord',
      'Europe': 'Europe',
      'Oceania': 'Océanie',
      'South America': 'Amérique du Sud',
    },
    'de': {
      'North America': 'Nordamerika',
      'Europe': 'Europa',
      'Oceania': 'Ozeanien',
      'South America': 'Südamerika',
    },
    'it': {
      'North America': 'Nord America',
      'Europe': 'Europa',
      'Oceania': 'Oceania',
      'South America': 'Sud America',
    },
    'pt': {
      'North America': 'América do Norte',
      'Europe': 'Europa',
      'Oceania': 'Oceania',
      'South America': 'América do Sul',
    },
  };

  // Get translated city names and regions
  const translatedCities = availableCities.map(city => ({
    ...city,
    name: cityNameTranslations[lang]?.[city.slug] || city.name,
    region: regionTranslations[lang]?.[city.region] || city.region,
  }));

  // Popular cities (top 8)
  const popularCities = translatedCities.slice(0, 8).map(city => ({
    name: city.name,
    slug: city.slug,
  }));

  // All cities grouped by region
  const citiesByRegion = translatedCities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as CitiesByRegion);

  // No need to limit cities since we only show available cities
  const limitedCitiesByRegion = citiesByRegion;
  const hasMoreCities = false;

  const footerClassName = 'bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white border-t border-gray-900/50';

  return React.createElement(
    'footer',
    { role: 'contentinfo', className: footerClassName },
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-16">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-1">
            <Link href={`/${lang}/`} className="inline-flex items-center space-x-2 mb-6 group">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-pink-400 transition-colors duration-300">
                  Celebrate
                </span>
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF1493] via-[#FF6B9D] to-[#FF1493] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Valentine's
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center space-x-2.5 text-gray-500 text-sm group/love">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 group-hover/love:scale-110 transition-transform duration-300" />
              <span className="group-hover/love:text-gray-400 transition-colors">{t('madeWithLove')}</span>
            </div>
          </div>

          {/* Popular Cities - Enhanced Design */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                <MapPin className="w-4 h-4 text-pink-400" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('popularCities')}
              </span>
            </h3>
            <ul className="space-y-2.5">
              {popularCities.map((city) => (
                <li key={city.slug}>
                  <Link 
                    href={`/${lang}/${city.slug}/`}
                    className={`group flex items-center gap-3 text-sm transition-all duration-300 py-1.5 ${
                      currentCity?.toLowerCase() === city.slug.toLowerCase() 
                        ? 'text-pink-400 font-semibold' 
                        : 'text-gray-400 hover:text-pink-400'
                    }`}
                    aria-label={`${t('valentinesDayIn')} ${city.name}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      currentCity?.toLowerCase() === city.slug.toLowerCase()
                        ? 'bg-pink-400 opacity-100'
                        : 'bg-pink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                    }`}></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{city.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* All Cities by Region - Enhanced */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('allCities')}
              </span>
            </h3>
            <div className="space-y-4">
              {Object.entries(limitedCitiesByRegion).map(([region, cities]) => (
                <div key={region} className="border-l-2 border-pink-500/20 pl-4">
                  <h4 className="text-xs font-bold text-pink-400/90 uppercase tracking-wider mb-2.5">
                    {region}
                  </h4>
                  <ul className="space-y-1.5">
                    {cities.map((city) => (
                      <li key={city.slug}>
                        <Link 
                          href={`/${lang}/${city.slug}/`}
                          className={`text-xs text-gray-400 hover:text-pink-400 transition-all duration-300 py-0.5 block ${
                            currentCity?.toLowerCase() === city.slug.toLowerCase() 
                              ? 'text-pink-400 font-semibold' 
                              : 'hover:translate-x-1'
                          }`}
                          aria-label={`${city.name} - ${region}`}
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {hasMoreCities && (
                <div className="pt-3 border-t border-gray-800">
                  <Link 
                    href={`/${lang}/`}
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors font-semibold inline-flex items-center gap-1.5 group"
                  >
                    <span>{t('viewAllCities')}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Resources & Legal - Combined & Enhanced */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('resources')}
              </span>
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link 
                  href={`/${lang}/`}
                  className="group flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-all duration-300 py-1.5"
                >
                  <div className="p-1 rounded-md bg-gray-800/50 group-hover:bg-pink-500/10 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{t('home')}</span>
                </Link>
              </li>
            </ul>
            {/* Enlaces a todos los idiomas para que crawlers (Screaming Frog, Google) descubran /es/, /fr/, etc. */}
            <div className="mb-8">
              <h3 className="font-bold text-sm mb-3 text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-pink-400" />
                {t('languages')}
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {locales.map((loc) => (
                  <li key={loc}>
                    <Link
                      href={`/${loc}/`}
                      className={`text-sm transition-colors py-0.5 ${
                        lang === loc ? 'text-pink-400 font-semibold' : 'text-gray-400 hover:text-pink-400'
                      }`}
                      aria-label={localeNames[loc]}
                    >
                      {localeNames[loc]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6 border-t border-gray-800/50">
              <h3 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">
                {t('legal')}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a 
                    href={termsUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-all duration-300 py-1.5"
                    aria-label={t('termsOfService')}
                  >
                    <div className="p-1 rounded-md bg-gray-800/50 group-hover:bg-pink-500/10 transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{t('termsOfService')}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a 
                    href={privacyUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-all duration-300 py-1.5"
                    aria-label={t('privacyPolicy')}
                  >
                    <div className="p-1 rounded-md bg-gray-800/50 group-hover:bg-pink-500/10 transition-colors">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{t('privacyPolicy')}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <Link 
                    href={`/${lang}/legal/cookies/`}
                    className="group flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-all duration-300 py-1.5"
                    aria-label={t('cookiePolicy')}
                  >
                    <div className="p-1 rounded-md bg-gray-800/50 group-hover:bg-pink-500/10 transition-colors">
                      <Cookie className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{t('cookiePolicy')}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${lang}/legal/cookies/#donotsell`}
                    className="group flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-all duration-300 py-1.5"
                    aria-label={t('doNotSell')}
                  >
                    <div className="p-1 rounded-md bg-gray-800/50 group-hover:bg-pink-500/10 transition-colors">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{t('doNotSell')}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-xs text-center md:text-left">
              {t('operatedBy')}
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
                © {currentYear} <span className="text-gray-400">Celebrate Valentine's</span>. {t('allRightsReserved')}
              </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span className="hidden sm:inline text-gray-600">{t('website')}</span>
              <a 
                href="https://celebratemothersday.com" 
                className="text-pink-400 hover:text-pink-300 transition-all duration-300 font-semibold hover:underline"
                rel="noopener noreferrer"
              >
                celebratemothersday.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
