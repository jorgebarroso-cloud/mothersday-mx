/**
 * UTM tracking utilities for Fever plan links
 * 
 * Implements consistent UTM parameter schema for all plan links:
 * - utm_source: Traffic source (default: 'google' or from incoming params)
 * - utm_medium: Traffic medium (default: 'organiclanding' or from incoming params)
 * - utm_content: Content type (default: 'valentines' or from incoming params)
 * - utm_campaign: Always {planId}_{cityCode} for precise measurement (e.g., '549909_muc')
 * 
 * This allows precise segmentation in GA:
 * - By city: filter utm_campaign ending in '_muc', '_mad', etc.
 * - By plan: filter utm_campaign starting with '549909_'
 * - By channel: use utm_source / utm_medium
 * 
 * Note: Does not add cp_landing_source parameter (belongs to other landing pages)
 */

import { getNormalizedOrigin } from '@/lib/utils';

/**
 * City slug -> UTM campaign code (3–4 chars). Must match all cities in city-keywords CITY_NAMES.
 * Used to build utm_campaign as {planId}_{cityCode} (e.g. 549909_muc).
 */
const CITY_UTM_CODES: Record<string, string> = {
  'madrid': 'mad',
  'barcelona': 'bcn',
  'valencia': 'val',
  'london': 'lon',
  'paris': 'par',
  'lyon': 'lyo',
  'new-york': 'nyc',
  'los-angeles': 'lax',
  'chicago': 'chi',
  'miami': 'mia',
  'san-francisco': 'sfo',
  'washington-dc': 'was',
  'san-diego': 'san',
  'atlanta': 'atl',
  'austin': 'aus',
  'lisbon': 'lis',
  'sao-paulo': 'sao',
  'rio-de-janeiro': 'rio',
  'mexico-city': 'mex',
  'buenos-aires': 'bue',
  'montreal': 'mtl',
  'berlin': 'ber',
  'hamburg': 'ham',
  'vienna': 'vie',
  'munchen': 'muc',
  'dublin': 'dub',
  'sydney': 'syd',
  'melbourne': 'mel',
  'brisbane': 'bri',
  'toronto': 'tor',
  'roma': 'rom',
  'milano': 'mil',
};

/** All city slugs that have a UTM code (for verification). */
export const UTM_CITY_SLUGS = Object.keys(CITY_UTM_CODES) as string[];

/**
 * Default UTM parameter values when user arrives without UTMs
 * (google/organiclanding/valentines per SEO spec)
 */
const DEFAULT_UTM_PARAMS = {
  utm_source: 'google',
  utm_medium: 'organiclanding',
  utm_content: 'mothersday',
};

/**
 * Get city code for UTM campaign from city slug
 * Falls back to 'gen' if city not in map (avoids wrong codes for hyphenated slugs like new-york)
 */
function getCityCode(citySlug: string): string {
  const normalized = citySlug.toLowerCase();
  return CITY_UTM_CODES[normalized] ?? 'gen';
}

/**
 * Clean plan ID: decode URL encoding, remove commas, spaces, and other invalid characters
 * Only keep digits (for utm_campaign format)
 */
function cleanPlanId(planId: string | null | undefined): string | null {
  if (!planId) return null;
  
  let cleaned = planId.toString();
  
  // First, decode URL encoding (e.g., %2C -> comma)
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // If decoding fails, continue with original string
  }
  
  // Remove all non-digit characters (commas, spaces, etc.)
  cleaned = cleaned.replace(/[^\d]/g, '');
  
  // Return null if empty after cleaning
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Extract plan ID from Fever URL
 * Handles formats like:
 * - https://feverup.com/m/549909
 * - https://feverup.com/m/549909?existing=params
 */
function extractPlanIdFromLink(link: string): string | null {
  // Try regex first (works for both absolute and relative URLs)
  const match = link.match(/\/m\/(\d+)/);
  if (match) return match[1];
  
  // If regex fails, try URL parsing (only for absolute URLs)
  try {
    const url = new URL(link);
    const urlMatch = url.pathname.match(/\/m\/(\d+)/);
    return urlMatch ? urlMatch[1] : null;
  } catch {
    return null;
  }
}

/**
 * Build UTM-tracked URL for a Fever plan link
 * 
 * @param planLink - Original Fever plan URL (e.g., 'https://feverup.com/m/549909')
 * @param planId - Plan ID (e.g., '549909'). If not provided, will try to extract from planLink
 * @param citySlug - City slug (e.g., 'munchen')
 * @param incomingParams - Optional UTM params from URL/localStorage (will override defaults)
 * @returns URL with UTM parameters appended
 * 
 * @example
 * buildPlanUtmUrl(
 *   'https://feverup.com/m/549909',
 *   '549909',
 *   'munchen',
 *   { utm_source: 'google', utm_medium: 'cpc' }
 * )
 * // Returns: 'https://feverup.com/m/549909?utm_source=google&utm_medium=cpc&utm_content=valentines&utm_campaign=549909_muc'
 */
export function buildPlanUtmUrl(
  planLink: string,
  planId: string | null | undefined,
  citySlug: string,
  incomingParams?: Record<string, string>
): string {
  // Guard: invalid or empty link (avoids new URL('') throwing on server/client)
  if (!planLink || typeof planLink !== 'string' || !planLink.trim()) {
    return typeof planLink === 'string' ? planLink : '#';
  }
  // Extract plan ID if not provided, then clean it (remove commas, spaces, etc.)
  const rawPlanId = planId || extractPlanIdFromLink(planLink);
  const finalPlanId = cleanPlanId(rawPlanId);
  
  if (!finalPlanId) {
    console.warn('Could not determine plan ID for UTM tracking:', planLink);
    // Return original link with incoming params if any
    if (incomingParams && Object.keys(incomingParams).length > 0) {
      try {
        const url = new URL(planLink);
        Object.entries(incomingParams).forEach(([key, value]) => {
          if (key && value) {
            url.searchParams.set(key, value);
          }
        });
        return url.toString();
      } catch {
        return planLink;
      }
    }
    return planLink;
  }

  // Get city code
  const cityCode = getCityCode(citySlug);
  
  // Build utm_campaign: always {planId}_{cityCode}
  const utmCampaign = `${finalPlanId}_${cityCode}`;

  try {
    // Parse the plan link (ensure it's absolute)
    let url: URL;
    try {
      url = new URL(planLink);
    } catch {
      // If relative URL, make it absolute using normalized origin (guarantees production URL)
      // Note: PlanLinks from Fever should always be absolute, but this is a safety fallback
      // In production, getNormalizedOrigin() returns https://celebratemothersday.com
      // For Fever planLinks, we use https://feverup.com as base (planLinks are from Fever domain)
      const base = typeof window !== 'undefined' 
        ? getNormalizedOrigin() 
        : 'https://feverup.com'; // SSR fallback: planLinks are from Fever, not celebratevalentines
      url = new URL(planLink, base);
    }
    
    // Start with default UTM params
    const utmParams: Record<string, string> = {
      ...DEFAULT_UTM_PARAMS,
    };
    
    // Override with incoming params (from URL/localStorage) for source, medium, content
    if (incomingParams) {
      if (incomingParams.utm_source) {
        utmParams.utm_source = incomingParams.utm_source;
      }
      if (incomingParams.utm_medium) {
        utmParams.utm_medium = incomingParams.utm_medium;
      }
      if (incomingParams.utm_content) {
        utmParams.utm_content = incomingParams.utm_content;
      }
      // Preserve other incoming params (but don't override utm_campaign)
      Object.entries(incomingParams).forEach(([key, value]) => {
        if (key && value && !key.startsWith('utm_')) {
          // Don't override if already in URL
          if (!url.searchParams.has(key)) {
            url.searchParams.set(key, value);
          }
        }
      });
    }
    
    // Always set utm_campaign to {planId}_{cityCode}
    utmParams.utm_campaign = utmCampaign;
    
    // Add all UTM params to URL (don't override if already present in original link)
    Object.entries(utmParams).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    // Fallback: append params as query string if URL parsing fails
    console.warn('Error building UTM URL, using fallback:', error);
    const params = new URLSearchParams();
    
    // Add defaults
    Object.entries(DEFAULT_UTM_PARAMS).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    // Override with incoming
    if (incomingParams) {
      if (incomingParams.utm_source) params.set('utm_source', incomingParams.utm_source);
      if (incomingParams.utm_medium) params.set('utm_medium', incomingParams.utm_medium);
      if (incomingParams.utm_content) params.set('utm_content', incomingParams.utm_content);
    }
    
    // Always set campaign
    params.set('utm_campaign', utmCampaign);
    
    const separator = planLink.includes('?') ? '&' : '?';
    return `${planLink}${separator}${params.toString()}`;
  }
}
