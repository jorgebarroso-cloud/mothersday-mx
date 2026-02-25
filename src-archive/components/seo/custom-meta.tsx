'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Map locale codes to language names for meta tag
const localeToLanguage: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
};

export function CustomMeta() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof document === 'undefined' || !document.head) {
      return;
    }

    // Extract locale from pathname
    const localeMatch = pathname.match(/^\/(en|es|fr|de|it|pt)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'en';
    const language = localeToLanguage[locale] || 'English';

    // Add custom meta tags that aren't supported by Next.js Metadata API
    // Note: Canonical and hreflang are handled by Next.js Metadata API via alternates
    const addMetaTag = (name: string, content: string) => {
      try {
        // Check if meta tag already exists
        const existing = document.querySelector(`meta[name="${name}"]`);
        if (existing && existing.parentNode) {
          existing.setAttribute('content', content);
        } else {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          if (document.head) {
            document.head.appendChild(meta);
          }
        }
      } catch (error) {
        console.debug('Error adding meta tag:', error);
      }
    };

    try {
      // Only add custom meta tags, not canonical (Next.js handles it via metadata.alternates.canonical)
      addMetaTag('language', language);
      addMetaTag('revisit-after', '7 days');
      addMetaTag('author', 'CelebrateValentines');
    } catch (error) {
      console.debug('Error updating meta tags:', error);
    }
  }, [pathname]);

  return null;
}
