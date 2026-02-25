'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DateFilter } from './date-filter';
import { useTranslations } from 'next-intl';

const PRICE_RANGES: { range: [number, number] }[] = [
  { range: [0, 25] },
  { range: [25, 50] },
  { range: [50, 100] },
  { range: [100, Infinity] },
];

// Format price label with currency in correct position (€ after, others before)
// This function will be moved inside the component to access translations

interface CategoryNavProps {
  categories: string[];
  hasCandlelight: boolean;
  priceRange: [number, number] | null;
  onPriceRangeChange: (range: [number, number] | null) => void;
  dateRange: [Date, Date] | null;
  onDateRangeChange: (range: [Date, Date] | null) => void;
  availableDates: Date[];
  currency: string;
}

// Map category names to their section IDs
const getCategoryId = (category: string) => {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

export function CategoryNav({ categories, hasCandlelight, priceRange, onPriceRangeChange, dateRange, onDateRangeChange, availableDates, currency }: CategoryNavProps) {
  const t = useTranslations('CategoryNav');
  const tPrice = useTranslations('Price');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  const isPriceSelected = (range: [number, number]) => {
    if (!priceRange) return false;
    return priceRange[0] === range[0] && priceRange[1] === range[1];
  };

  // Format price label with currency in correct position (€ after, others before)
  const formatPriceLabel = (range: [number, number], currency: string): string => {
    const isEuro = currency === '€';
    const [min, max] = range;
    
    if (min === 0) {
      // "Under X"
      return isEuro ? `${tPrice('under')} ${max}${currency}` : `${tPrice('under')} ${currency}${max}`;
    } else if (max === Infinity) {
      // "X+"
      return isEuro ? `${min}${currency}+` : `${currency}${min}+`;
    } else {
      // "X - Y"
      return isEuro ? `${min}${currency} - ${max}${currency}` : `${currency}${min} - ${currency}${max}`;
    }
  };

  // All sections (excluding Top 3 which is above the nav)
  const allSections = [
    ...(hasCandlelight ? [{ id: 'candlelight', label: t('candlelight') }] : []),
    ...categories.map(cat => ({ id: getCategoryId(cat), label: cat })),
    { id: 'all-experiences', label: t('allExperiences') }
  ];

  // Track scroll position to highlight active section (without updating URL hash)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleScroll = () => {
      // Verify document is still available
      if (typeof document === 'undefined') return;

      // Get all sections with their positions, sorted by position on page
      const sectionsWithPositions = allSections
        .map(s => {
          const element = document.getElementById(s.id);
          if (!element) return null;
          
          try {
            const rect = element.getBoundingClientRect();
            return {
              id: s.id,
              element,
              top: rect.top
            };
          } catch (error) {
            // Element may have been removed, skip it
            return null;
          }
        })
        .filter((s): s is { id: string; element: HTMLElement; top: number } => s !== null);

      if (sectionsWithPositions.length === 0) return;

      const navHeight = 70; // Height of sticky nav
      
      // Find the section that is currently in view (closest to top but still visible)
      let activeSection = sectionsWithPositions[0]?.id || '';
      
      for (const section of sectionsWithPositions) {
        // If section top is above the nav (scrolled past), it could be active
        // We want the last section that has scrolled past the nav
        if (section.top <= navHeight + 50) {
          activeSection = section.id;
        }
      }

      // Only update active category visually, DO NOT update URL hash
      if (activeSection && activeSection !== activeCategory) {
        setActiveCategory(activeSection);
        // URL hash is only updated when user clicks a button (in scrollToSection)
      }
    };

    // Check initial hash from URL (if user navigated with a hash)
    try {
      const initialHash = window.location.hash.slice(1);
      if (initialHash && allSections.some(s => s.id === initialHash)) {
        setActiveCategory(initialHash);
      } else {
        // Set initial active category without updating URL
        handleScroll();
      }
    } catch (error) {
      // If there's an error, just set initial state
      console.debug('Error checking initial hash:', error);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      try {
        window.removeEventListener('scroll', handleScroll);
      } catch (error) {
        // Ignore cleanup errors
        console.debug('Error removing scroll listener:', error);
      }
    };
  }, [allSections]); // Removed activeCategory from dependencies to avoid loops

  // Scroll the active button into view in the nav
  useEffect(() => {
    if (!activeCategory) return;

    // Use requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const button = buttonRefs.current[activeCategory];
      const container = scrollContainerRef.current;
      
      // Verify both refs exist and are still mounted
      if (!button || !container) return;

      try {
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        
        // Check if button is out of view
        if (buttonLeft < scrollLeft + 100) {
          // Button is to the left, scroll left
          container.scrollTo({
            left: buttonLeft - 100,
            behavior: 'smooth'
          });
        } else if (buttonLeft + buttonWidth > scrollLeft + containerWidth - 20) {
          // Button is to the right, scroll right
          container.scrollTo({
            left: buttonLeft - containerWidth + buttonWidth + 100,
            behavior: 'smooth'
          });
        }
      } catch (error) {
        // Element may have been removed, ignore error
        console.debug('Error scrolling to active button:', error);
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [activeCategory]);

  const scrollToSection = (id: string) => {
    // Update active category immediately on click
    setActiveCategory(id);
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      try {
        const element = document.getElementById(id);
        if (!element) {
          console.debug(`Element with id "${id}" not found`);
          return;
        }

        const offset = 160; // Account for sticky nav height (3 rows) + padding for title
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
        
        // Update URL hash safely
        try {
          if (window.location.hash !== `#${id}`) {
            window.history.replaceState(null, '', `#${id}`);
          }
        } catch (error) {
          // Ignore history API errors
          console.debug('Error updating URL hash:', error);
        }
      } catch (error) {
        console.debug('Error scrolling to section:', error);
      }
    });
  };

  return (
    <div 
      className="sticky top-0 z-[100] bg-gradient-to-r from-[#FF1493] via-[#FF3366] to-[#FF6B9D] border-y-2 border-white shadow-lg"
      style={{ position: '-webkit-sticky' } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        {/* Row 1: Categories */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Categories label */}
          <span className="flex-shrink-0 text-white font-bold text-sm uppercase tracking-wider">
            {t('categories')}
          </span>
          
          {/* Divider */}
          <div className="flex-shrink-0 w-px h-6 bg-white/40" />
          
          {/* Category buttons */}
          {allSections.map((section) => (
            <button
              key={section.id}
              ref={(el) => { buttonRefs.current[section.id] = el; }}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border",
                activeCategory === section.id
                  ? "bg-white text-[#FF1493] border-white shadow-md"
                  : "text-white hover:bg-white/20 border-white/50"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
        
        {/* Row 2: Price Filter */}
        <div 
          className="flex items-center gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Price filter label */}
          <span className="flex-shrink-0 text-white font-bold text-sm uppercase tracking-wider">
            {t('price')}
          </span>
          
          {/* Divider */}
          <div className="flex-shrink-0 w-px h-6 bg-white/40" />
          
          {/* All prices button */}
          <button
            onClick={() => onPriceRangeChange(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border",
              !priceRange
                ? "bg-white text-[#FF1493] border-white shadow-md"
                : "text-white hover:bg-white/20 border-white/50"
            )}
          >
            {t('all')}
          </button>
          
          {/* Price range buttons */}
          {PRICE_RANGES.map((range, index) => (
            <button
              key={index}
              onClick={() => onPriceRangeChange(isPriceSelected(range.range) ? null : range.range)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border",
                isPriceSelected(range.range)
                  ? "bg-white text-[#FF1493] border-white shadow-md"
                  : "text-white hover:bg-white/20 border-white/50"
              )}
            >
              {formatPriceLabel(range.range, currency)}
            </button>
          ))}
        </div>
        
        {/* Row 3: Date Filter */}
        <div 
          className="flex items-center gap-3 pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Date filter label */}
          <span className="flex-shrink-0 text-white font-bold text-sm uppercase tracking-wider">
            {t('date')}
          </span>
          
          {/* Divider */}
          <div className="flex-shrink-0 w-px h-6 bg-white/40" />
          
          {/* Date Filter Component */}
          <DateFilter 
            onDateRangeChange={onDateRangeChange}
            availableDates={availableDates}
            currentRange={dateRange}
          />
        </div>
      </div>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

