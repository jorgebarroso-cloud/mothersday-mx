'use client';

import { locales, type Locale } from '@/i18n';

interface HreflangLinksProps {
  currentLocale: Locale;
  currentPath?: string;
}

export function HreflangLinks({ currentLocale, currentPath }: HreflangLinksProps) {
  // Remove locale prefix from pathname to get the base path
  // If currentPath is provided, use it; otherwise construct from currentLocale
  let basePath = currentPath || '/';
  
  // Remove locale prefix if present
  basePath = basePath.replace(/^\/(en|es|fr|de|it|pt)/, '') || '/';
  
  // Ensure basePath starts with / and ends with / for consistency
  if (!basePath.startsWith('/')) {
    basePath = `/${basePath}`;
  }
  if (!basePath.endsWith('/') && basePath !== '/') {
    basePath = `${basePath}/`;
  }
  
  // Build URLs for each locale (all use prefix: /en/, /es/, /fr/, etc. — root redirects to /en/)
  const baseUrl = 'https://celebratemothersday.com';
  const enPath = basePath === '/' ? '/en/' : `/en${basePath}`;
  
  return (
    <>
      {locales.map((locale) => {
        const localePath = locale === 'en' ? enPath : `/${locale}${basePath}`;
        const fullUrl = `${baseUrl}${localePath}`;
        
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={fullUrl}
          />
        );
      })}
      {/* x-default points to English (default locale) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${enPath}`}
      />
    </>
  );
}
