import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export basePath utilities
export { getBasePath, withBasePath, getNormalizedOrigin } from './utils/basepath'

/**
 * Normalizes city slug from URL: decode, lowercase, remove accents (münchen -> munchen),
 * and map locale variants to canonical slug (lisboa -> lisbon).
 */
export function normalizeCitySlug(raw: string): string {
  let slug = raw.toLowerCase();
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Already decoded
  }
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (slug === 'lisboa') return 'lisbon';
  return slug;
}