'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, DollarSign, Calendar, UtensilsCrossed, Heart, Clock } from 'lucide-react';
import { DateFilter } from './date-filter';
import { CategoryPageType } from './category-page-view';
import { useTranslations } from 'next-intl';
import { ValentinePlan } from '@/lib/valentines/service';

interface FilterSidebarProps {
  pageType: CategoryPageType;
  priceStats: { min: number; max: number };
  priceRange: [number, number] | null;
  onPriceRangeChange: (range: [number, number] | null) => void;
  dateRange: [Date, Date] | null;
  onDateRangeChange: (range: [Date, Date] | null) => void;
  availableDates: Date[];
  currency: string;
  plans: ValentinePlan[]; // All available plans to filter options
  // Category-specific filters
  cuisineType?: string[];
  onCuisineTypeChange?: (types: string[]) => void;
  ambiance?: string[];
  onAmbianceChange?: (ambiances: string[]) => void;
  // Recipient filter removed per user request
  timeSlots?: string[];
  onTimeSlotsChange?: (slots: string[]) => void;
  onClearAll?: () => void;
}

export function FilterSidebar({
  pageType,
  priceStats,
  priceRange,
  onPriceRangeChange,
  dateRange,
  onDateRangeChange,
  availableDates,
  currency,
  plans,
  cuisineType = [],
  onCuisineTypeChange,
  ambiance = [],
  onAmbianceChange,
  // Recipient filter removed
  timeSlots = [],
  onTimeSlotsChange,
  onClearAll,
}: FilterSidebarProps) {
  const t = useTranslations('Common');
  const tFilters = useTranslations('Filters');
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to check if a price tier has plans
  const hasPlansInPriceRange = (min: number, max: number): boolean => {
    return plans.some(plan => {
      const price = plan.priceValue;
      return price > 0 && price >= min && price <= max;
    });
  };

  // Helper function to check if a time slot has plans
  const hasPlansInTimeSlot = (slot: string): boolean => {
    return plans.some(plan => {
      if (plan.eventDates.length === 0) return false;
      return plan.eventDates.some(date => {
        const hour = new Date(date).getHours();
        if (slot === 'Morning' && hour >= 6 && hour < 12) return true;
        if (slot === 'Afternoon' && hour >= 12 && hour < 17) return true;
        if (slot === 'Evening' && hour >= 17 && hour < 21) return true;
        if (slot === 'Night' && (hour >= 21 || hour < 6)) return true;
        return false;
      });
    });
  };

  // Price tier quick-select - filter out tiers without plans
  const allPriceTiers = [
    { label: '$', min: priceStats.min, max: priceStats.min + (priceStats.max - priceStats.min) * 0.33 },
    { label: '$$', min: priceStats.min + (priceStats.max - priceStats.min) * 0.33, max: priceStats.min + (priceStats.max - priceStats.min) * 0.66 },
    { label: '$$$', min: priceStats.min + (priceStats.max - priceStats.min) * 0.66, max: priceStats.max },
  ];
  const priceTiers = allPriceTiers.filter(tier => hasPlansInPriceRange(tier.min, tier.max));

  // Helper function to check if a cuisine type has plans
  const hasPlansInCuisineType = (cuisine: string): boolean => {
    return plans.some(plan => {
      const searchText = `${plan.title} ${plan.venue}`.toLowerCase();
      return searchText.includes(cuisine.toLowerCase());
    });
  };

  // Helper function to check if an ambiance has plans
  const hasPlansInAmbiance = (amb: string): boolean => {
    return plans.some(plan => {
      const searchText = `${plan.title} ${plan.venue}`.toLowerCase();
      return searchText.includes(amb.toLowerCase());
    });
  };

  // Category-specific filter options - filtered by available plans
  const allCuisineTypes = ['Italian', 'French', 'Japanese', 'Spanish', 'Mediterranean', 'American', 'Asian Fusion'];
  const cuisineTypes = allCuisineTypes.filter(cuisine => hasPlansInCuisineType(cuisine));
  
  const allAmbiances = ['Romantic', 'Intimate', 'Rooftop', 'Waterfront', 'Historic', 'Modern', 'Cozy'];
  const ambiances = allAmbiances.filter(amb => hasPlansInAmbiance(amb));
  
  const allTimeSlotOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const timeSlotOptions = allTimeSlotOptions.filter(slot => hasPlansInTimeSlot(slot));

  const handlePriceTierClick = (tier: typeof priceTiers[0]) => {
    onPriceRangeChange([tier.min, tier.max]);
  };

  const hasActiveFilters = priceRange || 
    (pageType === 'last-minute' && dateRange) ||
    (pageType === 'restaurants' && (cuisineType.length > 0 || ambiance.length > 0)) ||
    (pageType === 'last-minute' && timeSlots.length > 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#FF1493] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#FF3366] transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="bg-white text-[#FF1493] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {[priceRange ? 1 : 0, (pageType === 'last-minute' && dateRange) ? 1 : 0, cuisineType.length, ambiance.length, timeSlots.length].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        h-full lg:h-auto
        w-full lg:w-80
        bg-white lg:bg-transparent
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
        lg:transition-none
        overflow-y-auto lg:overflow-visible
        shadow-xl lg:shadow-none
      `}>
        <div className="p-6 lg:p-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Sections */}
          <div className="space-y-6">
            {/* Price Filter - Dual Range */}
            {priceStats.max > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[#FF1493]" />
                  <h3 className="font-bold text-gray-900">{tFilters.priceRange || t('priceRange')}</h3>
                </div>
                
                {/* Quick Select Tiers */}
                <div className="flex gap-2 mb-4">
                  {priceTiers.map((tier, index) => (
                    <button
                      key={index}
                      onClick={() => handlePriceTierClick(tier)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${priceRange && priceRange[0] >= tier.min && priceRange[1] <= tier.max
                          ? 'bg-[#FF1493] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>

                {/* Dual Range Slider */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Min: {currency}{priceRange?.[0] || priceStats.min}
                    </label>
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceRange?.[1] || priceStats.max}
                      value={priceRange?.[0] || priceStats.min}
                      onChange={(e) => {
                        const min = parseInt(e.target.value);
                        const max = priceRange?.[1] || priceStats.max;
                        if (min <= max) {
                          onPriceRangeChange([min, max]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF1493]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Max: {currency}{priceRange?.[1] || priceStats.max}
                    </label>
                    <input
                      type="range"
                      min={priceRange?.[0] || priceStats.min}
                      max={priceStats.max}
                      value={priceRange?.[1] || priceStats.max}
                      onChange={(e) => {
                        const max = parseInt(e.target.value);
                        const min = priceRange?.[0] || priceStats.min;
                        if (max >= min) {
                          onPriceRangeChange([min, max]);
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF1493]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date Filter - Only shown for last-minute */}
            {pageType === 'last-minute' && availableDates.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#FF1493]" />
                  <h3 className="font-bold text-gray-900">{tFilters.date || 'Date'}</h3>
                </div>
                <DateFilter
                  onDateRangeChange={onDateRangeChange}
                  availableDates={availableDates}
                  currentRange={dateRange}
                />
              </div>
            )}

            {/* Restaurants: Cuisine Type - Only show if there are options with plans */}
            {pageType === 'restaurants' && onCuisineTypeChange && cuisineTypes.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UtensilsCrossed className="w-5 h-5 text-[#FF1493]" />
                  <h3 className="font-bold text-gray-900">{tFilters.cuisineType || 'Cuisine Type'}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cuisineTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = cuisineType.includes(type)
                          ? cuisineType.filter(t => t !== type)
                          : [...cuisineType, type];
                        onCuisineTypeChange(newTypes);
                      }}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${cuisineType.includes(type)
                          ? 'bg-[#FF1493] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants: Ambiance - Only show if there are options with plans */}
            {pageType === 'restaurants' && onAmbianceChange && ambiances.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-[#FF1493]" />
                  <h3 className="font-bold text-gray-900">{tFilters.ambiance || 'Ambiance'}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ambiances.map((amb) => (
                    <button
                      key={amb}
                      onClick={() => {
                        const newAmb = ambiance.includes(amb)
                          ? ambiance.filter(a => a !== amb)
                          : [...ambiance, amb];
                        onAmbianceChange(newAmb);
                      }}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${ambiance.includes(amb)
                          ? 'bg-[#FF1493] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {amb}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gifts: Recipient - REMOVED per user request */}

            {/* Last-Minute: Time Slots */}
            {pageType === 'last-minute' && onTimeSlotsChange && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#FF1493]" />
                  <h3 className="font-bold text-gray-900">{tFilters.timeSlots || 'Time Slots'}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {timeSlotOptions.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        const newSlots = timeSlots.includes(slot)
                          ? timeSlots.filter(s => s !== slot)
                          : [...timeSlots, slot];
                        onTimeSlotsChange(newSlots);
                      }}
                      className={`
                        px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                        ${timeSlots.includes(slot)
                          ? 'bg-[#FF1493] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear All Button */}
            {hasActiveFilters && onClearAll && (
              <button
                onClick={onClearAll}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {tFilters.clearAll || 'Clear All Filters'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[-1]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
