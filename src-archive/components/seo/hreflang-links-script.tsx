'use client';

/**
 * HreflangLinksScript Component
 * 
 * NOTE: This component is kept for backward compatibility but Next.js Metadata API
 * already handles hreflang tags via alternates.languages in generateMetadata.
 * 
 * This component can be removed if hreflang tags are working correctly via metadata.
 * However, keeping it as a fallback ensures hreflang tags are present even if
 * metadata generation fails or for client-side navigation.
 * 
 * The component only adds hreflang if they don't already exist from metadata.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

export function HreflangLinksScript() {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /es/madrid/ -> 'es', /madrid/ -> 'en')
  const localeMatch = pathname.match(/^\/(en|es|fr|de|it|pt)(\/|$)/);
  const locale = (localeMatch ? localeMatch[1] : 'en') as Locale;
  
  useEffect(() => {
    // Only run on client side
    if (typeof document === 'undefined' || !document.head) {
      return;
    }

    // Check if hreflang tags already exist from Next.js metadata
    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    
    // If hreflang tags already exist from metadata, don't add duplicates
    // Next.js Metadata API handles this via alternates.languages
    if (existingHreflang.length > 0) {
      // Verify they're correct - if they exist, metadata is working
      return;
    }
    
    // Fallback: Only add hreflang if metadata didn't add them
    // This ensures hreflang tags are present even if metadata generation fails
    
    // Remove locale prefix from pathname to get the base path
    let basePath = pathname.replace(/^\/(en|es|fr|de|it|pt)/, '') || '/';
    
    // Ensure basePath starts with / and ends with / for consistency
    if (!basePath.startsWith('/')) {
      basePath = `/${basePath}`;
    }
    if (!basePath.endsWith('/') && basePath !== '/') {
      basePath = `${basePath}/`;
    }
    
    // Build URLs for each locale
    const baseUrl = 'https://celebratemothersday.com';
    
    // Create and append hreflang links (always include locale prefix)
    locales.forEach((loc) => {
      const localePath = `/${loc}${basePath}`;
      const fullUrl = `${baseUrl}${localePath}`;
      
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = loc;
      link.href = fullUrl;
      
      // Verify head exists before appending
      if (document.head) {
        document.head.appendChild(link);
      }
    });
    
    // Add x-default (points to English)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}/en${basePath}`;
    
    // Verify head exists before appending
    if (document.head) {
      document.head.appendChild(defaultLink);
    }
  }, [pathname, locale]);
  
  return null;
}
