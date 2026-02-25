'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
};

/** Path without locale prefix, with leading/trailing slash (e.g. /new-york/ or /) */
function getPathWithoutLocale(pathname: string): string {
  let path = pathname.replace(/^\/(en|es|fr|de|it|pt)(\/|$)/, '$2') || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  return path;
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const localeMatch = pathname.match(/^\/(en|es|fr|de|it|pt)(\/|$)/);
  const locale = (localeMatch ? localeMatch[1] : 'en') as Locale;
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if ref still exists and is mounted
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    // Use capture phase to catch events earlier
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      try {
        document.removeEventListener('mousedown', handleClickOutside, true);
      } catch (error) {
        // Ignore cleanup errors
        console.debug('Error removing click listener:', error);
      }
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors text-xs md:text-sm font-medium text-gray-700 min-h-[44px] min-w-[44px] justify-center md:justify-start"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span className="hidden md:inline">{localeNames[locale]}</span>
        <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop - high z so it sits above page content (e.g. category nav z-[100]) */}
          <div
            className="fixed inset-0 z-[199]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown - z-[200] above backdrop so menu is clickable */}
          <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-xl border z-[200] overflow-hidden" role="listbox">
            {locales.map((loc) => {
              const href = `/${loc}${pathWithoutLocale}`;
              return (
                <Link
                  key={loc}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full px-4 py-3 md:py-2.5 text-left hover:bg-pink-50 transition-colors min-h-[44px] ${
                    loc === locale ? 'bg-pink-100 text-pink-600 font-medium' : 'text-gray-700'
                  }`}
                  role="option"
                  aria-selected={loc === locale}
                >
                  <span className="text-sm md:text-base">{localeNames[loc]}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
