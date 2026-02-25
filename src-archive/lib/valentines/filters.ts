/**
 * Filter functions for category-specific pages
 * Filters ValentinePlan arrays based on page type requirements
 */

import { ValentinePlan } from './service';

export type PageType = 'gifts' | 'restaurants' | 'ideas' | 'last-minute';

/**
 * Filter plans by page type
 * Each page type has specific filtering logic
 */
export function filterPlansByPageType(
  plans: ValentinePlan[],
  pageType: PageType
): ValentinePlan[] {
  switch (pageType) {
    case 'gifts':
      return filterGifts(plans);
    case 'restaurants':
      return filterRestaurants(plans);
    case 'ideas':
      return filterIdeas(plans);
    case 'last-minute':
      return filterLastMinute(plans);
    default:
      return plans;
  }
}

/**
 * Filter for Gifts page
 * Includes: valentines-related-events, workshops-and-activities, wellness-and-relaxation
 * Excludes: pure food-only plans (unless they're also in other categories)
 */
function filterGifts(plans: ValentinePlan[]): ValentinePlan[] {
  return plans.filter(plan => {
    // Include plans that have gift-worthy categories
    const hasGiftCategory = plan.categories.some(cat => 
      cat === 'valentines-related-events' ||
      cat === 'workshops-and-activities' ||
      cat === 'wellness-and-relaxation' ||
      cat === 'concerts-musicals-theater'
    );
    
    // Exclude plans that are ONLY food (no other categories)
    const isOnlyFood = plan.categories.length === 1 && plan.categories[0] === 'food';
    
    return hasGiftCategory && !isOnlyFood;
  }).sort((a, b) => a.rank - b.rank);
}

/**
 * Filter for Restaurants page
 * Includes: Only plans with 'food' category
 */
function filterRestaurants(plans: ValentinePlan[]): ValentinePlan[] {
  return plans.filter(plan => 
    plan.categories.includes('food')
  ).sort((a, b) => a.rank - b.rank);
}

/**
 * Filter for Ideas page
 * Includes: All plans except pure food-only
 * Excludes: Plans that are ONLY food category
 */
function filterIdeas(plans: ValentinePlan[]): ValentinePlan[] {
  return plans.filter(plan => {
    // Exclude plans that are ONLY food (no other categories)
    const isOnlyFood = plan.categories.length === 1 && plan.categories[0] === 'food';
    return !isOnlyFood;
  }).sort((a, b) => a.rank - b.rank);
}

/**
 * Filter for Last-Minute page
 * Includes: Plans with event dates within the next 14 days
 * Prioritizes plans with dates available soon
 */
function filterLastMinute(plans: ValentinePlan[]): ValentinePlan[] {
  const now = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(now.getDate() + 14);
  
  return plans.filter(plan => {
    // If plan has event dates, check if any are within 14 days
    if (plan.eventDates && plan.eventDates.length > 0) {
      return plan.eventDates.some(date => {
        const eventDate = new Date(date);
        return eventDate >= now && eventDate <= twoWeeksFromNow;
      });
    }
    
    // If no dates specified, include all plans (they might be available)
    // This ensures we don't exclude plans that could be booked last-minute
    return true;
  }).sort((a, b) => {
    // Sort by: earliest available date first, then by rank
    const aEarliest = a.eventDates.length > 0 
      ? Math.min(...a.eventDates.map(d => d.getTime()))
      : Infinity;
    const bEarliest = b.eventDates.length > 0
      ? Math.min(...b.eventDates.map(d => d.getTime()))
      : Infinity;
    
    if (aEarliest !== bEarliest) {
      return aEarliest - bEarliest;
    }
    
    return a.rank - b.rank;
  });
}
