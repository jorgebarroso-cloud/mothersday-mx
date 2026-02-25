'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { withBasePath } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  city?: string;
  citySlug?: string;
}

// City information for the search
const CITIES = [
  { slug: 'new-york', name: 'New York', country: 'USA' },
  { slug: 'los-angeles', name: 'Los Angeles', country: 'USA' },
  { slug: 'chicago', name: 'Chicago', country: 'USA' },
  { slug: 'london', name: 'London', country: 'UK' },
  { slug: 'sydney', name: 'Sydney', country: 'Australia' },
  { slug: 'melbourne', name: 'Melbourne', country: 'Australia' },
  { slug: 'toronto', name: 'Toronto', country: 'Canada' },
  { slug: 'madrid', name: 'Madrid', country: 'Spain' },
  { slug: 'barcelona', name: 'Barcelona', country: 'Spain' },
  { slug: 'mexico-city', name: 'Ciudad de México', country: 'Mexico' },
  { slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina' },
  { slug: 'paris', name: 'Paris', country: 'France' },
  { slug: 'montreal', name: 'Montréal', country: 'Canada' },
  { slug: 'berlin', name: 'Berlin', country: 'Germany' },
  { slug: 'munchen', name: 'München', country: 'Germany' },
  { slug: 'vienna', name: 'Vienna', country: 'Austria' },
  { slug: 'lisbon', name: 'Lisboa', country: 'Portugal' },
  { slug: 'roma', name: 'Roma', country: 'Italy' },
  { slug: 'milano', name: 'Milano', country: 'Italy' },
];

export function HeroSection({ city, citySlug }: HeroSectionProps) {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (slug: string) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    // Navigate with locale prefix (always include locale) using Next.js router
    const cityPath = `/${locale}/${slug}/`;
    router.push(cityPath);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCities.length > 0) {
      handleCitySelect(filteredCities[0].slug);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if ref still exists and is mounted
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsDropdownOpen(false);
    };

    // Use capture phase to catch events earlier
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isDropdownOpen]);

  // Background - GIF for home, image for city pages
  // Toronto, Buenos Aires, Montreal, München, Roma, and Milano use .png, other cities use .jpg
  const getBackgroundImage = () => {
    if (!city) return null;
    const slug = citySlug || city.toLowerCase().replace(/\s+/g, '-');
    const extension = (slug === 'toronto' || slug === 'buenos-aires' || slug === 'montreal' || slug === 'munchen' || slug === 'roma' || slug === 'milano') ? 'png' : 'jpg';
    return withBasePath(`/images/posters/skyline-${slug}.${extension}`);
  };
  const backgroundImage = getBackgroundImage();

  return (
    <header className="relative w-full h-[100dvh] md:h-[70vh] md:min-h-[600px] overflow-hidden bg-[#FF3366]">
      {/* Background - Ken Burns effect for all pages; bg-[#FF3366] fallback when image fails to load (e.g. crawlers) */}
      {city ? (
        // City page: use Ken Burns effect with city skyline image
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FF3366]">
          <Image
            src={backgroundImage || withBasePath('/images/posters/skyline-paris.jpg')}
            alt={`Romantic Valentine's dinner and experiences in ${city}`}
            fill
            priority
            className="object-cover object-center animate-ken-burns"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dark Gradient Overlay for text readability - Vital for WCAG compliance */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>
        </div>
      ) : (
        // Home page: use Ken Burns effect with romantic image
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FF3366]">
          <Image
            src={withBasePath('/images/hero-romantic.jpg')}
            alt="Romantic Valentine's Day dinner scene with city lights"
            fill
            priority
            className="object-cover object-center animate-ken-burns"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dark Gradient Overlay for text readability - Vital for WCAG compliance */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 text-white">
        <h1 className="mb-3 md:mb-4 drop-shadow-2xl animate-fade-in-up text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-balance px-2">
          {city ? (
            <>
              {t('cityTitle')} <br/>
              <span className="text-pink-300">{t('citySubtitle', { city })}</span>
            </>
          ) : (
            <>
              {t('title')} <br/>
              <span className="text-pink-300">{t('subtitle')}</span>
            </>
          )}
        </h1>
        
        <p className="text-base md:text-lg max-w-3xl mx-auto text-white/95 drop-shadow-lg mb-6 md:mb-8 animate-fade-in-up animation-delay-200 px-2">
          {city ? (
            t('cityDescription', { city })
          ) : (
            t('description')
          )}
        </p>
        
        {/* Search Bar - Center of Hero */}
        {!city && (
          <div className="w-full max-w-2xl mx-auto animate-fade-in-up animation-delay-400 px-2" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl p-2 md:p-2 border-2 border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-gray-800 placeholder-gray-500 rounded-lg md:rounded-xl outline-none text-base min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white font-bold px-5 md:px-6 lg:px-8 py-3 md:py-4 rounded-lg md:rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap min-h-[44px] text-sm md:text-base"
                >
                  {t('searchButton')}
                </button>
              </div>
              
              {/* Dropdown Results - Real <a> links for crawlers (Googlebot) */}
              {isDropdownOpen && searchQuery && filteredCities.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl max-h-[50vh] md:max-h-64 overflow-y-auto border-2 border-pink-200">
                  {filteredCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${locale}/${city.slug}/`}
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-3 md:py-3 text-left hover:bg-pink-50 transition-colors flex items-center gap-3 border-b border-pink-100 last:border-b-0 min-h-[44px]"
                    >
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#FF1493] flex-shrink-0" aria-hidden="true" />
                      <div>
                        <div className="font-medium text-gray-800 text-sm md:text-base">{city.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{city.country}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
