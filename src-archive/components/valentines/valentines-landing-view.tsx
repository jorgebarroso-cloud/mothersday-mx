'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ValentinesData, ValentinePlan } from '@/lib/valentines/service';
import { HeroSection } from '@/components/valentines/hero-section';
import { PlanCard } from '@/components/valentines/plan-card';
import { PlanCarousel } from '@/components/valentines/plan-carousel';
import { CategoryNav } from '@/components/valentines/category-nav';
import { DateFilter } from '@/components/valentines/date-filter';
import { CityInfoSection } from '@/components/valentines/city-info-section';
import { ValentinesIdeasSection } from '@/components/valentines/valentines-ideas-section';
import { useTranslations } from 'next-intl';
import { getNormalizedOrigin } from '@/lib/utils';
import { buildPlanUtmUrl } from '@/lib/valentines/utm';

// UTM Storage key for localStorage persistence
const UTM_STORAGE_KEY = 'valentines_utm_params';
// Date filter storage key
const DATE_FILTER_STORAGE_KEY = 'valentines_date_filter';

// Map category names to their section IDs
const getCategoryId = (category: string) => {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

// Currency by city
const CITY_CURRENCY: Record<string, string> = {
  'madrid': '€',
  'barcelona': '€',
  'valencia': '€',
  'london': '£',
  'paris': '€',
  'new-york': '$',
  'los-angeles': '$',
  'chicago': '$',
  'miami': '$',
  'lisbon': '€',
  'berlin': '€',
  'sydney': 'A$',
  'melbourne': 'A$',
};

interface ValentinesLandingViewProps {
  data: ValentinesData;
  city: string;
  citySlug?: string;
  lang?: string;
}

// Floating heart component
function FloatingHeart({ delay, left, size, duration }: { delay: number; left: number; size: number; duration: number }) {
  return (
    <div
      className="absolute bottom-0 animate-float-up pointer-events-none"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <svg 
        className="text-white" 
        style={{ width: size, height: size, opacity: 0.7 }}
        viewBox="0 0 100 100" 
        fill="currentColor"
      >
        <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
      </svg>
    </div>
  );
}

export function ValentinesLandingView({ data, city, citySlug, lang = 'en' }: ValentinesLandingViewProps) {
  const t = useTranslations('CityPage');
  const [showHearts, setShowHearts] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [trackingParams, setTrackingParams] = useState<Record<string, string>>({});
  
  const currency = CITY_CURRENCY[city.toLowerCase()] || '€';
  
  // Collect all available dates from all plans
  const allAvailableDates = useMemo(() => {
    const dates: Date[] = [];
    data.all.forEach(plan => {
      plan.eventDates.forEach(date => dates.push(date));
    });
    return dates;
  }, [data.all]);
  
  // Load date filter from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DATE_FILTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.start && parsed.end) {
          const start = new Date(parsed.start);
          const end = new Date(parsed.end);
          // Validate dates are valid
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            setDateRange([start, end]);
          }
        }
      }
    } catch (e) {
      console.error('Error loading date filter from storage:', e);
    }
  }, []);
  
  // Save date filter to localStorage when it changes
  useEffect(() => {
    try {
      if (dateRange) {
        localStorage.setItem(DATE_FILTER_STORAGE_KEY, JSON.stringify({
          start: dateRange[0].toISOString(),
          end: dateRange[1].toISOString()
        }));
      } else {
        localStorage.removeItem(DATE_FILTER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving date filter to storage:', e);
    }
  }, [dateRange]);

  // Capture and persist UTM/tracking parameters (client-only; no useSearchParams so static HTML includes full content)
  useEffect(() => {
    let storedParams: Record<string, string> = {};
    try {
      const stored = localStorage.getItem(UTM_STORAGE_KEY);
      if (stored) {
        storedParams = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading UTM params from storage:', e);
    }
    
    const currentParams: Record<string, string> = {};
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      params.forEach((value, key) => {
        if (key && value) currentParams[key] = value;
      });
    }
    
    const mergedParams = { ...storedParams, ...currentParams };
    
    if (Object.keys(currentParams).length > 0) {
      try {
        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(mergedParams));
      } catch (e) {
        console.error('Error storing UTM params:', e);
      }
    }
    
    setTrackingParams(mergedParams);
  }, []);

  // Add tracking parameters to links (runs on SSR and client so HTML has UTM from first paint)
  // utm_campaign = {planId}_{cityCode}
  const getTrackedLink = useCallback((link: string, planId?: string): string => {
    const finalCitySlug = citySlug || city.toLowerCase();
    return buildPlanUtmUrl(
      link,
      planId || null,
      finalCitySlug,
      trackingParams
    );
  }, [trackingParams, citySlug, city]);
  
  // Filter plans by price range
  const filterByPrice = (plans: ValentinePlan[]) => {
    if (!priceRange) return plans;
    return plans.filter(plan => {
      if (plan.priceValue === 0) return true; // Include plans without price
      return plan.priceValue >= priceRange[0] && plan.priceValue < priceRange[1];
    });
  };
  
  // Filter plans by date range
  const filterByDate = (plans: ValentinePlan[]) => {
    if (!dateRange) return plans;
    const [start, end] = dateRange;
    return plans.filter(plan => {
      // If no event dates, include the plan
      if (plan.eventDates.length === 0) return true;
      // Check if at least one event date falls within the range
      return plan.eventDates.some(date => date >= start && date <= end);
    });
  };
  
  // Combined filter function
  const applyFilters = (plans: ValentinePlan[]) => {
    return filterByDate(filterByPrice(plans));
  };
  
  // Generate random hearts on mount
  const [hearts] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      duration: 4 + Math.random() * 4,
    }))
  );

  // Hide hearts after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHearts(false);
    }, 10000); // Hide after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  // Sort categories - "Valentines related events" first, and sort plans within each category by rank
  const sortedCategories = useMemo(() => {
    const entries = Object.entries(data.categories);
    
    // Sort categories (Valentines first)
    const sortedEntries = entries.sort(([catA], [catB]) => {
      const aIsValentine = catA.toLowerCase().includes('valentine');
      const bIsValentine = catB.toLowerCase().includes('valentine');
      
      if (aIsValentine && !bIsValentine) return -1;
      if (!aIsValentine && bIsValentine) return 1;
      return 0;
    });
    
    // Sort plans within each category by rank, add ID, and filter by price/date
    return sortedEntries.map(([category, plans]) => ({
      name: category,
      id: getCategoryId(category),
      plans: applyFilters([...plans].sort((a, b) => a.rank - b.rank))
    })).filter(cat => cat.plans.length > 0); // Only show categories with plans
  }, [data.categories, priceRange, dateRange]);

  // Sort candlelight plans by rank and filter by price/date
  const sortedCandlelight = useMemo(() => {
    return applyFilters([...data.candlelight].sort((a, b) => a.rank - b.rank));
  }, [data.candlelight, priceRange, dateRange]);

  // Category names for navigation (only categories with plans after filtering)
  const categoryNames = useMemo(() => 
    sortedCategories.map(c => c.name), 
    [sortedCategories]
  );

  // Sort all plans by rank, but put Candlelight plans at the bottom, and filter by price/date
  const sortedAllPlans = useMemo(() => {
    return applyFilters([...data.all].sort((a, b) => {
      // Candlelight plans go to the bottom
      if (a.isCandlelight && !b.isCandlelight) return 1;
      if (!a.isCandlelight && b.isCandlelight) return -1;
      // Otherwise sort by rank
      return a.rank - b.rank;
    }));
  }, [data.all, priceRange, dateRange]);

  return (
    <div className="min-h-screen relative">
      {/* Floating hearts animation on page load */}
      {showHearts && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {hearts.map((heart) => (
            <FloatingHeart
              key={heart.id}
              delay={heart.delay}
              left={heart.left}
              size={heart.size}
              duration={heart.duration}
            />
          ))}
        </div>
      )}

      {/* Full page pink gradient background - like Galentines card (left to right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493] via-[#FF3366] to-[#FF6B9D]" />
      
      {/* Decorative SVG Elements - scattered across ENTIRE page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        
        {/* === TOP AREA === */}
        
        {/* Large diamond/sparkle - top left */}
        <svg className="absolute top-8 left-8 w-20 h-20 text-white/90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z"/>
        </svg>
        {/* Small diamond below */}
        <svg className="absolute top-28 left-24 w-8 h-8 text-white/70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
        </svg>
        
        {/* Hearts with kiss marks - top left area */}
        <svg className="absolute top-32 left-4 w-36 h-32 text-white/70" viewBox="0 0 120 110" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M60 95 L25 60 C8 43 8 18 30 18 C42 18 52 30 60 42 C68 30 78 18 90 18 C112 18 112 43 95 60 Z"/>
          <path d="M50 50 L46 46 C42 42 42 36 48 36 C51 36 53 39 50 43 C47 39 49 36 52 36 C58 36 58 42 54 46 Z" fill="currentColor"/>
          <path d="M70 50 L66 46 C62 42 62 36 68 36 C71 36 73 39 70 43 C67 39 69 36 72 36 C78 36 78 42 74 46 Z" fill="currentColor"/>
          <path d="M15 45 Q5 50 10 60" strokeLinecap="round"/>
          <path d="M10 35 Q0 40 5 50" strokeLinecap="round"/>
        </svg>
        
        {/* XOXO text */}
        <div className="absolute top-[15%] left-1/3 text-white/50 text-4xl md:text-5xl font-light tracking-[0.3em] -rotate-6">
          XOXO
        </div>
        
        {/* Microphone with disco ball - top right */}
        <svg className="absolute top-12 right-8 w-24 h-36 text-white/80" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="40" cy="28" r="24"/>
          <ellipse cx="40" cy="28" rx="24" ry="8"/>
          <path d="M20 18 Q40 35 60 18" strokeWidth="1.5"/>
          <path d="M18 32 Q40 22 62 32" strokeWidth="1.5"/>
          <line x1="40" y1="4" x2="40" y2="52" strokeWidth="1"/>
          <line x1="16" y1="28" x2="64" y2="28" strokeWidth="1"/>
          <rect x="34" y="52" width="12" height="55" rx="3"/>
          <path d="M68 45 L64 41 C59 36 59 29 66 29 C70 29 73 33 68 38 C63 33 66 29 70 29 C77 29 77 36 72 41 Z" fill="currentColor"/>
          <path d="M75 62 L72 59 C68 55 68 50 73 50 C76 50 78 53 75 56 C72 53 74 50 77 50 C82 50 82 55 78 59 Z" fill="currentColor"/>
        </svg>
        
        {/* Heart outline - right side top */}
        <svg className="absolute top-[20%] right-16 w-20 h-20 text-white/60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        
        {/* === MIDDLE AREA === */}
        
        <svg className="absolute top-[40%] -left-6 w-48 h-36 text-white/60" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 85 L32 67 C15 50 15 28 38 28 C50 28 58 40 50 55 C42 40 50 28 62 28 C85 28 85 50 68 67 Z"/>
          <path d="M90 100 L68 78 C48 58 48 32 75 32 C90 32 100 47 90 67 C80 47 90 32 105 32 C132 32 132 58 112 78 Z"/>
          <path d="M130 85 L112 67 C95 50 95 28 118 28 C130 28 138 40 130 55 C122 40 130 28 142 28 C165 28 165 50 148 67 Z"/>
          <line x1="0" y1="60" x2="70" y2="60" strokeWidth="2.5"/>
          <polygon points="0,60 15,53 15,67" fill="currentColor"/>
        </svg>
        
        <svg className="absolute top-[45%] left-[30%] w-10 h-10 text-white/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
        </svg>
        
        <svg className="absolute top-[35%] right-4 w-28 h-28 text-white/50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        
        <svg className="absolute top-[50%] left-[45%] w-6 h-6 text-white/35" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        <svg className="absolute top-[55%] right-[30%] w-5 h-5 text-white/30" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        
        <svg className="absolute top-[52%] right-20 w-8 h-8 text-white/45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M50 15 L54 45 L85 50 L54 55 L50 85 L46 55 L15 50 L46 45 Z"/>
        </svg>
        
        {/* === BOTTOM AREA === */}
        
        <svg className="absolute bottom-[25%] left-6 w-44 h-32 text-white/55" viewBox="0 0 150 110" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M35 80 L20 65 C7 52 7 35 25 35 C34 35 40 44 35 55 C30 44 36 35 45 35 C63 35 63 52 50 65 Z"/>
          <path d="M75 95 L55 75 C38 58 38 35 60 35 C72 35 82 48 75 65 C68 48 78 35 90 35 C112 35 112 58 95 75 Z"/>
          <path d="M115 80 L100 65 C87 52 87 35 105 35 C114 35 120 44 115 55 C110 44 116 35 125 35 C143 35 143 52 130 65 Z"/>
          <line x1="0" y1="58" x2="60" y2="58" strokeWidth="2"/>
          <polygon points="0,58 12,52 12,64" fill="currentColor"/>
        </svg>
        
        <svg className="absolute bottom-[18%] right-6 w-28 h-36 text-white/65" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 45 L26 110 Q50 118 74 110 L80 45" strokeLinecap="round"/>
          <ellipse cx="50" cy="45" rx="32" ry="14"/>
          <path d="M68 40 Q90 20 85 0" strokeLinecap="round"/>
          <path d="M42 72 L36 66 C28 58 28 48 38 48 C44 48 48 54 42 62 C36 54 40 48 46 48 C56 48 56 58 48 66 Z" fill="currentColor"/>
          <circle cx="88" cy="8" r="4" fill="currentColor"/>
          <circle cx="92" cy="18" r="3" fill="currentColor"/>
          <path d="M95 28 L93 26 C90 23 90 19 94 19 C96 19 97 21 95 23 C93 21 94 19 96 19 C100 19 100 23 97 26 Z" fill="currentColor"/>
        </svg>
        
        <svg className="absolute bottom-[30%] left-[40%] w-12 h-12 text-white/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z"/>
        </svg>
        
        <svg className="absolute bottom-[15%] left-[25%] w-8 h-8 text-white/40" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        <svg className="absolute bottom-[10%] right-[35%] w-6 h-6 text-white/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        
        <svg className="absolute bottom-[40%] left-[60%] w-6 h-6 text-white/25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
          <path d="M50 15 L54 45 L85 50 L54 55 L50 85 L46 55 L15 50 L46 45 Z"/>
        </svg>
        <svg className="absolute top-[65%] left-[12%] w-5 h-5 text-white/30" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
        </svg>
        <svg className="absolute top-[75%] right-[15%] w-7 h-7 text-white/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M50 15 L54 45 L85 50 L54 55 L50 85 L46 55 L15 50 L46 45 Z"/>
        </svg>
      </div>
      
      {/* Section 1: Hero */}
      <div className="relative z-20">
        <HeroSection city={city} citySlug={citySlug} />
      </div>

      {/* Section 2: Top 3 - Auto-scrolling Carousel */}
      {data.top3.length > 0 && (
        <div className="relative z-20 py-12">
          <section id="top-3" className="container mx-auto px-4 space-y-6 scroll-mt-24">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {t('top3Title')}
              </h2>
              <p className="text-pink-200 text-sm">{t('top3Subtitle')}</p>
            </div>
            
            {/* Auto-scrolling carousel for Top 3 */}
            <div className="overflow-hidden">
              <PlanCarousel 
                title="" 
                plans={[...data.top3].sort((a, b) => a.rank - b.rank)} 
                autoScroll={true}
                compact={false}
                cardWidth={400}
                getTrackedLink={getTrackedLink}
                showPosition={true}
              />
            </div>
          </section>
        </div>
      )}

      {/* Section: City Info - How to Celebrate Valentine's Day in this city */}
      <CityInfoSection city={city} />

      {/* Section: Valentine's Day Ideas in City */}
      <ValentinesIdeasSection city={city} lang={lang} />

      {/* Category Navigation with Price and Date Filters - Sticky at top when scrolling */}
      <CategoryNav 
        categories={categoryNames} 
        hasCandlelight={sortedCandlelight.length > 0}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        availableDates={allAvailableDates}
        currency={currency}
      />

      {/* Main content */}
      <div className="relative z-20">
        {/* Section 3: Candlelight - Special Background with animated gradient */}
        {sortedCandlelight.length > 0 && (
          <div className="candlelight-bg py-12 border-y border-amber-900/20">
            <style jsx>{`
              .candlelight-bg {
                background: 
                  radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 90, 27, 0.3), transparent 50%),
                  radial-gradient(ellipse 60% 40% at 75% 20%, rgba(139, 90, 27, 0.25), transparent 50%),
                  radial-gradient(ellipse 60% 40% at 85% 65%, rgba(139, 90, 27, 0.2), transparent 50%),
                  radial-gradient(ellipse 70% 50% at 50% 80%, rgba(74, 42, 16, 0.3), transparent 50%),
                  linear-gradient(135deg, #0d0804, #1a0f08, #0d0804);
                background-size: 200% 200%, 200% 200%, 200% 200%, 200% 200%, 100% 100%;
                animation: candlelight-glow 10s ease infinite;
              }
              @keyframes candlelight-glow {
                0% {
                  background-position: 0% 0%, 100% 0%, 100% 100%, 50% 0%, 0% 0%;
                }
                33% {
                  background-position: 100% 50%, 50% 50%, 0% 50%, 100% 50%, 0% 0%;
                }
                66% {
                  background-position: 50% 100%, 0% 100%, 50% 0%, 0% 100%, 0% 0%;
                }
                100% {
                  background-position: 0% 0%, 100% 0%, 100% 100%, 50% 0%, 0% 0%;
                }
              }
            `}</style>
            <section id="candlelight" className="container mx-auto px-4 scroll-mt-16">
              <PlanCarousel 
                title={t('candlelightTitle')} 
                plans={sortedCandlelight}
                cardWidth={280}
                candlelight={true}
                getTrackedLink={getTrackedLink}
              />
            </section>
          </div>
        )}

        {/* Rest of the content - White background section */}
        <div className="bg-white relative">
          {/* Sticky icons container - follows scroll */}
          <div className="sticky top-0 h-0 overflow-visible pointer-events-none" style={{ zIndex: 5 }}>
            {/* Left side icons */}
            <svg className="absolute top-8 left-2 w-10 h-10 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-20 left-8 w-6 h-6 text-[#FF1493]/25" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-36 left-4 w-12 h-12 text-[#FF1493]/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-56 left-6 w-8 h-8 text-[#FF1493]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
            </svg>
            <svg className="absolute top-80 left-2 w-10 h-10 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[380px] left-4 w-7 h-7 text-[#FF1493]/30" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[450px] left-6 w-11 h-11 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[520px] left-2 w-8 h-8 text-[#FF1493]/25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
            </svg>
            <svg className="absolute top-[600px] left-4 w-14 h-14 text-[#FF1493]/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[680px] left-6 w-6 h-6 text-[#FF1493]/30" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            
            {/* Right side icons */}
            <svg className="absolute top-12 right-2 w-8 h-8 text-[#FF1493]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-28 right-6 w-10 h-10 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-48 right-4 w-14 h-14 text-[#FF1493]/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
            </svg>
            <svg className="absolute top-72 right-2 w-7 h-7 text-[#FF1493]/25" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[340px] right-4 w-12 h-12 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[420px] right-6 w-8 h-8 text-[#FF1493]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[500px] right-2 w-10 h-10 text-[#FF1493]/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"/>
            </svg>
            <svg className="absolute top-[580px] right-4 w-6 h-6 text-[#FF1493]/25" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[650px] right-6 w-11 h-11 text-[#FF1493]/35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[720px] right-2 w-8 h-8 text-[#FF1493]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            
            {/* Small icons in the middle */}
            <svg className="absolute top-16 left-[30%] w-5 h-5 text-[#FF1493]/20" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-32 right-[35%] w-4 h-4 text-[#FF1493]/15" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-52 left-[40%] w-6 h-6 text-[#FF1493]/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-72 right-[40%] w-4 h-4 text-[#FF1493]/15" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[350px] left-[35%] w-5 h-5 text-[#FF1493]/20" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[420px] right-[30%] w-6 h-6 text-[#FF1493]/15" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[500px] left-[45%] w-4 h-4 text-[#FF1493]/20" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[580px] right-[38%] w-5 h-5 text-[#FF1493]/15" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[660px] left-[32%] w-6 h-6 text-[#FF1493]/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            <svg className="absolute top-[720px] right-[42%] w-4 h-4 text-[#FF1493]/15" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
            
            {/* XOXO and LOVE text */}
            <div className="absolute top-24 left-[12%] text-[#FF1493]/20 text-2xl font-light tracking-[0.2em] -rotate-12">XOXO</div>
            <div className="absolute top-[300px] right-[8%] text-[#FF1493]/15 text-xl font-light tracking-[0.2em] rotate-6">LOVE</div>
            <div className="absolute top-[550px] left-[10%] text-[#FF1493]/15 text-xl font-light tracking-[0.15em] rotate-8">XOXO</div>
          </div>
          
          <main className="container mx-auto px-4 py-12 space-y-12 relative" style={{ zIndex: 10 }}>
            {/* Section 4: Categorized Carousels - Sorted with Valentines first */}
            {sortedCategories.map((category) => (
              <PlanCarousel 
                key={category.id} 
                id={category.id}
                title={category.name} 
                plans={category.plans}
                cardWidth={280}
                getTrackedLink={getTrackedLink}
                lightTheme={true}
              />
            ))}

            {/* Section 5: All Plans - Grid with compact cards */}
            <section id="all-experiences" className="space-y-6 pt-8 border-t-2 border-pink-200 scroll-mt-24">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#FF1493] mb-2">{t('allExperiencesTitle')}</h2>
                <p className="text-gray-600 text-sm">{t('allExperiencesSubtitle', { city })}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortedAllPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} compact={true} getTrackedLink={getTrackedLink} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
