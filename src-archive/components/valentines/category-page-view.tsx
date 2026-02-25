'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ValentinePlan } from '@/lib/valentines/service';
import { PlanCard } from '@/components/valentines/plan-card';
import { FilterSidebar } from '@/components/valentines/filter-sidebar';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { getNormalizedOrigin } from '@/lib/utils';
import { buildPlanUtmUrl } from '@/lib/valentines/utm';

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
  'toronto': 'CA$',
  'buenos-aires': 'ARS$',
  'montreal': 'CA$',
  'munchen': '€',
  'roma': '€',
  'milano': '€',
  'mexico-city': 'MX$',
};

// UTM Storage key for localStorage persistence
const UTM_STORAGE_KEY = 'valentines_utm_params';
const DATE_FILTER_STORAGE_KEY = 'valentines_date_filter';

export type CategoryPageType = 'gifts' | 'restaurants' | 'ideas' | 'last-minute';

interface CategoryPageViewProps {
  plans: ValentinePlan[];
  city: string;
  citySlug: string;
  pageType: CategoryPageType;
  lang?: string;
}

export function CategoryPageView({ plans, city, citySlug, pageType, lang = 'en' }: CategoryPageViewProps) {
  const t = useTranslations('CategoryPages');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [trackingParams, setTrackingParams] = useState<Record<string, string>>({});
  
  // Category-specific filters
  const [cuisineType, setCuisineType] = useState<string[]>([]);
  const [ambiance, setAmbiance] = useState<string[]>([]);
  // Recipient filter removed for gifts per user request
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  const currency = CITY_CURRENCY[citySlug.toLowerCase()] || '€';
  
  // Get page-specific translations
  const pageTranslations = t.raw(pageType === 'last-minute' ? 'lastMinute' : pageType) as any;
  
  // Collect all available dates from plans
  const allAvailableDates = useMemo(() => {
    const dates: Date[] = [];
    plans.forEach(plan => {
      plan.eventDates.forEach(date => dates.push(date));
    });
    return dates;
  }, [plans]);
  
  // Load date filter from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DATE_FILTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.start && parsed.end) {
          const start = new Date(parsed.start);
          const end = new Date(parsed.end);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            setDateRange([start, end]);
          }
        }
      }
    } catch (e) {
      console.error('Error loading date filter from storage:', e);
    }
  }, []);
  
  // Save date filter to localStorage
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
  
  // Capture and persist UTM parameters (client-only; no useSearchParams so static HTML includes full content)
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
    return buildPlanUtmUrl(
      link,
      planId || null,
      citySlug,
      trackingParams
    );
  }, [trackingParams, citySlug]);
  
  // Filter plans by all criteria (price, date, and category-specific)
  const filteredPlans = useMemo(() => {
    let filtered = [...plans];
    
    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(plan => {
        const price = plan.priceValue;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    
    // Filter by date range (only for last-minute)
    if (dateRange && pageType === 'last-minute') {
      filtered = filtered.filter(plan => {
        if (plan.eventDates.length === 0) return true; // Include plans without dates
        return plan.eventDates.some(date => {
          const eventDate = new Date(date);
          return eventDate >= dateRange[0] && eventDate <= dateRange[1];
        });
      });
    }
    
    // Category-specific filters
    if (pageType === 'restaurants') {
      // Filter by cuisine type (based on plan title/venue keywords)
      if (cuisineType.length > 0) {
        filtered = filtered.filter(plan => {
          const searchText = `${plan.title} ${plan.venue}`.toLowerCase();
          return cuisineType.some(cuisine => 
            searchText.includes(cuisine.toLowerCase())
          );
        });
      }
      
      // Filter by ambiance (based on plan title/venue keywords)
      if (ambiance.length > 0) {
        filtered = filtered.filter(plan => {
          const searchText = `${plan.title} ${plan.venue}`.toLowerCase();
          return ambiance.some(amb => 
            searchText.includes(amb.toLowerCase())
          );
        });
      }
    }
    
    // Recipient filter removed for gifts per user request
    
    if (pageType === 'last-minute') {
      // Filter by time slots (based on event dates)
      if (timeSlots.length > 0) {
        filtered = filtered.filter(plan => {
          if (plan.eventDates.length === 0) return true;
          return plan.eventDates.some(date => {
            const hour = new Date(date).getHours();
            if (timeSlots.includes('Morning') && hour >= 6 && hour < 12) return true;
            if (timeSlots.includes('Afternoon') && hour >= 12 && hour < 17) return true;
            if (timeSlots.includes('Evening') && hour >= 17 && hour < 21) return true;
            if (timeSlots.includes('Night') && (hour >= 21 || hour < 6)) return true;
            return false;
          });
        });
      }
    }
    
    return filtered.sort((a, b) => a.rank - b.rank);
  }, [plans, priceRange, dateRange, pageType, cuisineType, ambiance, timeSlots]);
  
  // Clear all filters
  const handleClearAll = () => {
    setPriceRange(null);
    setDateRange(null);
    setCuisineType([]);
    setAmbiance([]);
    // Recipient filter removed
    setTimeSlots([]);
  };
  
  // Calculate price range for filter (use all plans, not filtered)
  const priceStats = useMemo(() => {
    if (plans.length === 0) return { min: 0, max: 0 };
    const prices = plans.map(p => p.priceValue).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [plans]);

  // Initialize price range when stats are available
  useEffect(() => {
    if (!priceRange && priceStats.min > 0 && priceStats.max > 0 && priceStats.min !== priceStats.max) {
      setPriceRange([priceStats.min, priceStats.max]);
    }
  }, [priceStats.min, priceStats.max]); // Initialize when stats change
  
  // Get skyline image
  const skylineImageExtension = (citySlug === 'toronto' || citySlug === 'buenos-aires' || citySlug === 'montreal' || citySlug === 'munchen' || citySlug === 'roma' || citySlug === 'milano') ? 'png' : 'jpg';
  const skylineImage = `/images/posters/skyline-${citySlug}.${skylineImageExtension}`;
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: tCommon('home'), href: `/${locale}/` },
    { label: city, href: `/${locale}/${citySlug}/` },
    { label: pageTranslations?.title?.replace('{city}', city) || pageType },
  ];
  
  // Category icons for visual cues
  const categoryIcons: Record<CategoryPageType, string> = {
    'gifts': '🎁',
    'restaurants': '🍽️',
    'ideas': '💡',
    'last-minute': '⚡',
  };

  const categoryIcon = categoryIcons[pageType];

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section */}
      <div className="relative w-full h-[200px] md:h-[250px] overflow-hidden bg-gradient-to-br from-[#FF1493] via-[#FF3366] to-[#FF6B9D]">
        <Image
          src={skylineImage}
          alt={`${city} skyline`}
          fill
          priority
          className="object-cover opacity-30"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-white/80 mb-3" aria-label="Breadcrumb">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="w-3 h-3 text-white/60" />}
                  {index < breadcrumbItems.length - 1 ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{item.label}</span>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Compact Hero Content */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {categoryIcon} {pageTranslations?.heroTitle?.replace('{city}', city) || pageTranslations?.title?.replace('{city}', city)}
                </h1>
                <p className="text-sm md:text-base text-white/90 drop-shadow-md max-w-2xl">
                  {pageTranslations?.heroSubtitle || pageTranslations?.subtitle}
                </p>
              </div>
              <Link
                href={`/${locale}/${citySlug}/`}
                className="flex items-center text-white/90 hover:text-white transition-colors text-xs md:text-sm"
              >
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                <span className="hidden sm:inline">{tCommon('backTo')} </span> {city}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Marketplace Layout: Sidebar + Grid */}
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Advanced Filters (Sticky on Desktop) */}
            <aside className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                pageType={pageType}
                priceStats={priceStats}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                availableDates={allAvailableDates}
                currency={currency}
                plans={plans}
                cuisineType={cuisineType}
                onCuisineTypeChange={setCuisineType}
                ambiance={ambiance}
                onAmbianceChange={setAmbiance}
                // Recipient filter removed for gifts
                timeSlots={timeSlots}
                onTimeSlotsChange={setTimeSlots}
                onClearAll={handleClearAll}
              />
            </aside>

            {/* Right Column - Main Grid */}
            <main className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredPlans.length} {filteredPlans.length === 1 ? tCommon('plan') : tCommon('plans')} {tCommon('available')}
                  </h2>
                  {filteredPlans.length < plans.length && (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {filteredPlans.length} of {plans.length} plans
                    </p>
                  )}
                </div>
              </div>

              {/* Plans Grid */}
              {filteredPlans.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <p className="text-gray-600 text-lg mb-4">
                    {tCommon('noPlansFound')}
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="px-6 py-2 bg-[#FF1493] text-white rounded-lg hover:bg-[#FF3366] transition-colors"
                  >
                    {tCommon('clearFilters')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      getTrackedLink={getTrackedLink}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* SEO Content Section - Premium Design */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Intro Content - Hero Style */}
            {pageTranslations?.introSection && (
              <div className="mb-12 md:mb-16">
                <div className="relative">
                  {/* Decorative accent */}
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#FF1493] to-[#FF6B9D] rounded-full"></div>
                  
                  <div className="pl-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] bg-clip-text text-transparent">
                        {pageTranslations.introSection.title?.replace('{city}', city)}
                      </span>
                    </h2>
                    
                    <div className="space-y-4 text-lg md:text-xl text-gray-700 leading-relaxed">
                      {pageTranslations.introSection.paragraph1 && (
                        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#FF1493] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                          {pageTranslations.introSection.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.introSection.paragraph2 && (
                        <p>
                          {pageTranslations.introSection.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.introSection.paragraph3 && (
                        <p>
                          {pageTranslations.introSection.paragraph3.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Additional Content Sections - Premium Cards */}
            <div className="grid gap-8 md:gap-10">
              {pageType === 'gifts' && pageTranslations?.giftsForHer && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.giftsForHer.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.giftsForHer.paragraph1 && (
                        <p className="pl-4 border-l-4 border-pink-200">
                          {pageTranslations.giftsForHer.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.giftsForHer.paragraph2 && (
                        <p>
                          {pageTranslations.giftsForHer.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.giftsForHer.paragraph3 && (
                        <p>
                          {pageTranslations.giftsForHer.paragraph3.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            
              {pageType === 'gifts' && pageTranslations?.giftsForHim && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💼</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.giftsForHim.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.giftsForHim.paragraph1 && (
                        <p className="pl-4 border-l-4 border-blue-200">
                          {pageTranslations.giftsForHim.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.giftsForHim.paragraph2 && (
                        <p>
                          {pageTranslations.giftsForHim.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.giftsForHim.paragraph3 && (
                        <p>
                          {pageTranslations.giftsForHim.paragraph3.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'gifts' && pageTranslations?.lastMinuteGifts && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.lastMinuteGifts.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.lastMinuteGifts.paragraph1 && (
                        <p className="pl-4 border-l-4 border-amber-200">
                          {pageTranslations.lastMinuteGifts.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.lastMinuteGifts.paragraph2 && (
                        <p>
                          {pageTranslations.lastMinuteGifts.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            
              {/* Restaurants sections */}
              {pageType === 'restaurants' && pageTranslations?.fineDining && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.fineDining.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.fineDining.paragraph1 && (
                        <p className="pl-4 border-l-4 border-purple-200">
                          {pageTranslations.fineDining.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.fineDining.paragraph2 && (
                        <p>
                          {pageTranslations.fineDining.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'restaurants' && pageTranslations?.intimateVenues && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💕</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.intimateVenues.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.intimateVenues.paragraph1 && (
                        <p className="pl-4 border-l-4 border-rose-200">
                          {pageTranslations.intimateVenues.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.intimateVenues.paragraph2 && (
                        <p>
                          {pageTranslations.intimateVenues.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'restaurants' && pageTranslations?.restaurantsWithViews && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🌆</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.restaurantsWithViews.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.restaurantsWithViews.paragraph1 && (
                        <p className="pl-4 border-l-4 border-sky-200">
                          {pageTranslations.restaurantsWithViews.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            
              {/* Ideas sections */}
              {pageType === 'ideas' && pageTranslations?.romanticExperiences && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💝</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.romanticExperiences.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.romanticExperiences.paragraph1 && (
                        <p className="pl-4 border-l-4 border-pink-200">
                          {pageTranslations.romanticExperiences.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.romanticExperiences.paragraph2 && (
                        <p>
                          {pageTranslations.romanticExperiences.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'ideas' && pageTranslations?.uniqueDateIdeas && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.uniqueDateIdeas.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.uniqueDateIdeas.paragraph1 && (
                        <p className="pl-4 border-l-4 border-indigo-200">
                          {pageTranslations.uniqueDateIdeas.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.uniqueDateIdeas.paragraph2 && (
                        <p>
                          {pageTranslations.uniqueDateIdeas.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'ideas' && pageTranslations?.coupleActivities && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🎭</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.coupleActivities.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.coupleActivities.paragraph1 && (
                        <p className="pl-4 border-l-4 border-emerald-200">
                          {pageTranslations.coupleActivities.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            
              {/* Last-minute sections */}
              {pageType === 'last-minute' && pageTranslations?.sameDayReservations && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.sameDayReservations.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.sameDayReservations.paragraph1 && (
                        <p className="pl-4 border-l-4 border-orange-200">
                          {pageTranslations.sameDayReservations.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.sameDayReservations.paragraph2 && (
                        <p>
                          {pageTranslations.sameDayReservations.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'last-minute' && pageTranslations?.urgentGiftIdeas && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.urgentGiftIdeas.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.urgentGiftIdeas.paragraph1 && (
                        <p className="pl-4 border-l-4 border-red-200">
                          {pageTranslations.urgentGiftIdeas.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                      {pageTranslations.urgentGiftIdeas.paragraph2 && (
                        <p>
                          {pageTranslations.urgentGiftIdeas.paragraph2.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {pageType === 'last-minute' && pageTranslations?.availableNow && (
                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 md:p-10 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {pageTranslations.availableNow.title?.replace('{city}', city)}
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                      {pageTranslations.availableNow.paragraph1 && (
                        <p className="pl-4 border-l-4 border-green-200">
                          {pageTranslations.availableNow.paragraph1.replace(/{city}/g, city)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CTA - Premium Style */}
            {pageTranslations?.cta && (
              <div className="mt-12 md:mt-16 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-xl">
                    <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                      {pageTranslations.cta.replace(/{city}/g, city)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
