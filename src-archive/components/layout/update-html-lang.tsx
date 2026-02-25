'use client';

import { useEffect } from 'react';
import { type Locale } from '@/i18n';

interface UpdateHtmlLangProps {
  locale: Locale;
}

export function UpdateHtmlLang({ locale }: UpdateHtmlLangProps) {
  useEffect(() => {
    // Update HTML lang attribute based on locale
    if (typeof document !== 'undefined' && document.documentElement) {
      try {
        document.documentElement.lang = locale;
      } catch (error) {
        // Ignore errors during navigation
        console.debug('Error updating HTML lang attribute:', error);
      }
    }
  }, [locale]);

  return null;
}
