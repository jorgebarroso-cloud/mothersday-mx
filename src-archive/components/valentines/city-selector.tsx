'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Search, Heart } from 'lucide-react';
import { withBasePath } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

// City information for the selector - In exact order as specified
const CITIES = [
  // English cities
  { slug: 'new-york', name: 'New York', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-new-york.jpg', region: 'america', experiences: 24 },
  { slug: 'los-angeles', name: 'Los Angeles', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-los-angeles.jpg', region: 'america', experiences: 18 },
  { slug: 'chicago', name: 'Chicago', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-chicago.jpg', region: 'america', experiences: 15 },
  { slug: 'miami', name: 'Miami', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-miami.jpg', region: 'america', experiences: 17 },
  { slug: 'san-francisco', name: 'San Francisco', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-san-francisco.jpg', region: 'america', experiences: 16 },
  { slug: 'washington-dc', name: 'Washington DC', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-washington-dc.jpg', region: 'america', experiences: 14 },
  { slug: 'san-diego', name: 'San Diego', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-san-diego.jpg', region: 'america', experiences: 13 },
  { slug: 'atlanta', name: 'Atlanta', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-atlanta.jpg', region: 'america', experiences: 12 },
  { slug: 'austin', name: 'Austin', country: 'USA', flag: '🇺🇸', image: '/images/posters/skyline-austin.jpg', region: 'america', experiences: 11 },
  { slug: 'london', name: 'London', country: 'UK', flag: '🇬🇧', image: '/images/posters/skyline-london.jpg', region: 'europe', experiences: 28 },
  { slug: 'dublin', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', image: '/images/posters/skyline-dublin.jpg', region: 'europe', experiences: 15 },
  { slug: 'sydney', name: 'Sydney', country: 'Australia', flag: '🇦🇺', image: '/images/posters/skyline-sydney.jpg', region: 'oceania', experiences: 20 },
  { slug: 'melbourne', name: 'Melbourne', country: 'Australia', flag: '🇦🇺', image: '/images/posters/skyline-melbourne.jpg', region: 'oceania', experiences: 16 },
  { slug: 'brisbane', name: 'Brisbane', country: 'Australia', flag: '🇦🇺', image: '/images/posters/skyline-brisbane.jpg', region: 'oceania', experiences: 14 },
  { slug: 'toronto', name: 'Toronto', country: 'Canada', flag: '🇨🇦', image: '/images/posters/skyline-toronto.png', region: 'america', experiences: 14 },
  
  // Spanish cities
  { slug: 'madrid', name: 'Madrid', country: 'Spain', flag: '🇪🇸', image: '/images/posters/skyline-madrid.jpg', region: 'europe', experiences: 32 },
  { slug: 'barcelona', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', image: '/images/posters/skyline-barcelona.jpg', region: 'europe', experiences: 26 },
  { slug: 'valencia', name: 'Valencia', country: 'Spain', flag: '🇪🇸', image: '/images/posters/skyline-valencia.jpg', region: 'europe', experiences: 20 },
  { slug: 'mexico-city', name: 'Ciudad de México', country: 'Mexico', flag: '🇲🇽', image: '/images/posters/skyline-mexico-city.jpg', region: 'america', experiences: 19 },
  { slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', image: '/images/posters/skyline-buenos-aires.png', region: 'america', experiences: 17 },
  
  // French cities
  { slug: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', image: '/images/posters/skyline-paris.jpg', region: 'europe', experiences: 35 },
  { slug: 'lyon', name: 'Lyon', country: 'France', flag: '🇫🇷', image: '/images/posters/skyline-lyon.jpg', region: 'europe', experiences: 18 },
  { slug: 'montreal', name: 'Montréal', country: 'Canada', flag: '🇨🇦', image: '/images/posters/skyline-montreal.png', region: 'america', experiences: 13 },
  
  // German cities
  { slug: 'berlin', name: 'Berlin', country: 'Germany', flag: '🇩🇪', image: '/images/posters/skyline-berlin.jpg', region: 'europe', experiences: 22 },
  { slug: 'munchen', name: 'München', country: 'Germany', flag: '🇩🇪', image: '/images/posters/skyline-munchen.png', region: 'europe', experiences: 15 },
  { slug: 'hamburg', name: 'Hamburg', country: 'Germany', flag: '🇩🇪', image: '/images/posters/skyline-hamburg.jpg', region: 'europe', experiences: 16 },
  { slug: 'vienna', name: 'Vienna', country: 'Austria', flag: '🇦🇹', image: '/images/posters/skyline-vienna.jpg', region: 'europe', experiences: 18 },
  
  // Portuguese cities
  { slug: 'lisbon', name: 'Lisboa', country: 'Portugal', flag: '🇵🇹', image: '/images/posters/skyline-lisbon.jpg', region: 'europe', experiences: 21 },
  
  // Italian cities
  { slug: 'roma', name: 'Roma', country: 'Italy', flag: '🇮🇹', image: '/images/posters/skyline-roma.png', region: 'europe', experiences: 29 },
  { slug: 'milano', name: 'Milano', country: 'Italy', flag: '🇮🇹', image: '/images/posters/skyline-milano.png', region: 'europe', experiences: 24 },
];

type Region = 'all' | 'europe' | 'america' | 'oceania';

export function CitySelector() {
  const t = useTranslations('CitySelector');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<Region>('all');

  // Filter cities based on search and region
  const filteredCities = CITIES.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = activeRegion === 'all' || city.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = [
    { id: 'all' as Region, label: t('regionAll'), count: CITIES.length },
    { id: 'europe' as Region, label: t('regionEurope'), count: CITIES.filter(c => c.region === 'europe').length },
    { id: 'america' as Region, label: t('regionAmerica'), count: CITIES.filter(c => c.region === 'america').length },
    { id: 'oceania' as Region, label: t('regionOceania'), count: CITIES.filter(c => c.region === 'oceania').length },
  ];

  return (
    <section id="city-selector" className="relative z-20 py-8 md:py-12 lg:py-16 bg-white scroll-mt-14 md:scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FF1493] text-balance">
              {t('title')}
            </h2>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4 md:mb-6 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-10 md:pr-4 py-3 md:py-4 border-2 border-pink-200 rounded-xl focus:border-[#FF1493] focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-800 placeholder-gray-400 text-base min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="mb-6 md:mb-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  setActiveRegion(region.id);
                  setSearchQuery(''); // Clear search when switching regions
                }}
                className={`px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full font-medium text-xs md:text-sm lg:text-base transition-all duration-300 min-h-[44px] ${
                  activeRegion === region.id
                    ? 'bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white shadow-lg scale-105'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
                }`}
              >
                {region.label} ({region.count})
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filteredCities.length > 0 && (
            <div className="mb-6 text-center text-gray-600 text-sm">
              {t('resultsCount', { count: filteredCities.length })}
            </div>
          )}

          {/* No Results Message */}
          {filteredCities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">{t('noResults')}</p>
              <p className="text-gray-400 text-sm">{t('noResultsHelp')}</p>
            </div>
          )}

          {/* Cities Grid - Mobile-first: 1 col mobile, 2 tablet, 3+ desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredCities.map((city) => {
              // Determine badge for trending cities
              const isTrending = ['paris', 'new-york', 'madrid'].includes(city.slug);
              const badgeText = isTrending ? 'Trending' : null;
              const isTopChoice = city.experiences >= 30;
              const topChoiceText = isTopChoice && !isTrending ? 'Top Choice' : null;

              return (
                <Link
                  key={city.slug}
                  href={`/${locale}/${city.slug}/`}
                  aria-label={`View Valentine's Day plans in ${city.name}, ${city.country} - ${city.experiences} experiences`}
                  className="group relative bg-white border-2 border-pink-100 rounded-xl overflow-hidden hover:border-[#FF1493] hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] aspect-video sm:aspect-[4/5] cursor-pointer min-h-[200px]"
                >
                  {/* City Image - Full container with vertical format */}
                  <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-pink-100 to-pink-50">
                    {/* Use withBasePath for static export compatibility */}
                    <Image
                      src={withBasePath(city.image)}
                      alt={`Romantic Valentine's dinner and experiences in ${city.name}, ${city.country} - ${city.experiences} curated romantic plans`}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500 ease-out group-hover:brightness-110"
                      loading="lazy"
                      style={{ objectPosition: 'center' }}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {/* Gradient overlay at bottom for text readability - Enhanced on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Badge - Trending or Top Choice */}
                    {(badgeText || topChoiceText) && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
                          {badgeText || topChoiceText}
                        </span>
                      </div>
                    )}
                    
                    {/* City Name and Experiences - Overlaid on image at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10 transform group-hover:translate-y-0 translate-y-0 transition-all duration-300">
                      <h3 className="font-bold text-white text-sm md:text-base drop-shadow-lg group-hover:text-[#FF1493] transition-all duration-500 mb-0.5 md:mb-1">
                        {city.name}
                      </h3>
                      <p className="text-white/90 text-xs md:text-sm drop-shadow-md group-hover:text-white transition-colors duration-300">
                        {city.experiences} experiences
                      </p>
                    </div>
                    
                    {/* Animated Heart Icon on Hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 transform group-hover:scale-110 group-hover:rotate-12">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] flex items-center justify-center shadow-2xl backdrop-blur-sm animate-pulse">
                        <Heart className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    
                    {/* Subtle shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
