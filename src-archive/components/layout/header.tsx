'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { getBasePath } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from 'next-intl';

// Available cities for Valentine's Day (matching city selector in home)
// Using the actual route slugs that work in the app
const CITIES = [
  // English cities
  { name: 'New York', slug: 'new-york', lang: 'en' },
  { name: 'Los Angeles', slug: 'los-angeles', lang: 'en' },
  { name: 'Chicago', slug: 'chicago', lang: 'en' },
  { name: 'Miami', slug: 'miami', lang: 'en' },
  { name: 'San Francisco', slug: 'san-francisco', lang: 'en' },
  { name: 'Washington DC', slug: 'washington-dc', lang: 'en' },
  { name: 'San Diego', slug: 'san-diego', lang: 'en' },
  { name: 'Atlanta', slug: 'atlanta', lang: 'en' },
  { name: 'Austin', slug: 'austin', lang: 'en' },
  { name: 'London', slug: 'london', lang: 'en' },
  { name: 'Dublin', slug: 'dublin', lang: 'en' },
  { name: 'Sydney', slug: 'sydney', lang: 'en' },
  { name: 'Melbourne', slug: 'melbourne', lang: 'en' },
  { name: 'Brisbane', slug: 'brisbane', lang: 'en' },
  { name: 'Toronto', slug: 'toronto', lang: 'en' },
  // Spanish cities
  { name: 'Madrid', slug: 'madrid', lang: 'es' },
  { name: 'Barcelona', slug: 'barcelona', lang: 'es' },
  { name: 'Valencia', slug: 'valencia', lang: 'es' },
  { name: 'Ciudad de México', slug: 'mexico-city', lang: 'es' },
  { name: 'Buenos Aires', slug: 'buenos-aires', lang: 'es' },
  // French cities
  { name: 'Paris', slug: 'paris', lang: 'fr' },
  { name: 'Lyon', slug: 'lyon', lang: 'fr' },
  { name: 'Montréal', slug: 'montreal', lang: 'fr' },
  // German cities
  { name: 'Berlin', slug: 'berlin', lang: 'de' },
  { name: 'München', slug: 'munchen', lang: 'de' },
  { name: 'Hamburg', slug: 'hamburg', lang: 'de' },
  { name: 'Vienna', slug: 'vienna', lang: 'de' },
  // Portuguese cities
  { name: 'Lisboa', slug: 'lisbon', lang: 'pt' },
  // Italian cities
  { name: 'Roma', slug: 'roma', lang: 'it' },
  { name: 'Milano', slug: 'milano', lang: 'it' },
];

export function Header() {
  const t = useTranslations('Header');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const params = useParams();
  const pathname = usePathname();
  const basePath = getBasePath();
  
  // Extract locale from pathname (e.g., /es/madrid/ -> 'es', /madrid/ -> 'en')
  const localeMatch = pathname.match(/^\/(en|es|fr|de|it|pt)(\/|$)/);
  const locale = (localeMatch ? localeMatch[1] : 'en') as 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';
  
  // Remove basePath from pathname for comparison
  const cleanPathname = basePath && pathname.startsWith(basePath) 
    ? pathname.slice(basePath.length) 
    : pathname;
  
  // Check if we're on home page (pathname should be /locale/ or /locale)
  const isHomePage = pathname === `/${locale}/` || pathname === `/${locale}` || cleanPathname === '/' || cleanPathname === '' || cleanPathname === basePath;
  
  // Get current city from URL params (new structure: /[locale]/[city] or /[city])
  const currentCitySlug = params?.city as string || null;
  
  // Find the current city in our list
  const currentCity = currentCitySlug 
    ? (CITIES.find(c => c.slug === currentCitySlug) || CITIES[0])
    : { name: 'Home', slug: '', lang: 'en' };

  // Handle scroll for sticky effect and mobile hide/show behavior
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      try {
        const currentScrollY = window.scrollY;
        setIsScrolled(currentScrollY > 10);
        
        // Mobile: Hide on scroll down, show on scroll up (only on mobile screens)
        if (window.innerWidth < 768) {
          if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
            // Scrolling down - hide header
            setIsVisible(false);
          } else if (currentScrollY < lastScrollYRef.current) {
            // Scrolling up - show header
            setIsVisible(true);
          }
        } else {
          // Desktop: always visible
          setIsVisible(true);
        }
        
        lastScrollYRef.current = currentScrollY;
      } catch (error) {
        // Ignore scroll errors during navigation
        console.debug('Error handling scroll:', error);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Set initial scroll position
    handleScroll();
    
    return () => {
      try {
        window.removeEventListener('scroll', handleScroll);
      } catch (error) {
        // Ignore cleanup errors
        console.debug('Error removing scroll listener:', error);
      }
    };
  }, []);

  const handleDropdownClose = () => {
    setIsOpen(false);
  };

  const scrollToTop3 = () => {
    const element = document.getElementById('top-3');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 z-[200] w-full border-b transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'backdrop-blur-md bg-white/80 shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href={`/${locale}/`} className="flex items-center space-x-1 md:space-x-2 group min-h-[44px] min-w-[44px]">
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className="text-lg md:text-xl font-bold text-neutral-900 group-hover:text-pink-600 transition-colors">
              Celebrate
            </span>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] bg-clip-text text-transparent">
              Valentine's
            </span>
          </div>
        </Link>

        {/* Right side - Language Switcher + City Selector + Gift Now */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Gift Now Button - only show on city pages, hide on mobile */}
          {!isHomePage && (
            <button
              onClick={scrollToTop3}
              aria-label={t('giftNow')}
              className="hidden md:flex bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white font-bold px-4 md:px-5 py-2.5 md:py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs md:text-sm min-h-[44px] items-center"
            >
              {t('giftNow')}
            </button>
          )}

          {/* City Selector - Enhanced CTA Button - Always Visible */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isHomePage ? t('selectCity') : `Current city: ${currentCity.name}. Click to change city`}
              aria-expanded={isOpen}
              className={`flex items-center gap-1.5 md:gap-2 font-medium transition-all duration-200 min-h-[44px] ${
                isHomePage
                  ? 'bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white px-3 md:px-4 py-2 rounded-full hover:shadow-lg hover:scale-105'
                  : 'text-neutral-700 hover:text-pink-600 px-2.5 md:px-3 py-2 rounded-lg hover:bg-pink-50'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
              <span className="text-xs md:text-sm lg:text-base hidden sm:inline">{isHomePage ? t('selectCity') : currentCity.name}</span>
              <ChevronDown className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            
            {/* Dropdown */}
            {isOpen && (
              <>
                {/* Backdrop - z-[199] so dropdown (z-[200]) stays above */}
                <div 
                  className="fixed inset-0 z-[199]" 
                  onClick={() => setIsOpen(false)}
                  aria-hidden="true"
                />
                
                {/* Dropdown Menu - z-[200] so it paints above backdrop and rest of page */}
                <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white rounded-lg shadow-xl border z-[200] max-h-[70vh] md:max-h-80 overflow-y-auto">
                  {CITIES.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${locale}/${city.slug}/`}
                      onClick={handleDropdownClose}
                      className={`block w-full px-4 py-3 md:py-2.5 text-left hover:bg-pink-50 transition-colors flex items-center gap-2 min-h-[44px] ${
                        city.slug === currentCitySlug ? 'bg-pink-100 text-pink-600 font-medium' : 'text-neutral-700'
                      }`}
                    >
                      <MapPin className="h-4 w-4 md:h-3.5 md:w-3.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm md:text-base">{city.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
