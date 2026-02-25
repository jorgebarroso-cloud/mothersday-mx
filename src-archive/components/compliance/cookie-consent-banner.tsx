'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getConsent, setConsent } from '@/lib/cookies';

export function CookieConsentBanner() {
  const t = useTranslations('CookieBanner');
  const tFooter = useTranslations('Footer');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const cookiePolicyUrl = `/${locale}/legal/cookies/`;

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) setVisible(true);
  }, []);

  const handleAccept = () => {
    setConsent('accept');
    setVisible(false);
  };

  const handleReject = () => {
    setConsent('reject');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm px-4 py-3 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-gray-300 flex-1">
          {t('message')}{' '}
          <Link
            href={cookiePolicyUrl}
            className="text-pink-400 hover:text-pink-300 underline"
          >
            {tFooter('cookiePolicy')}
          </Link>
        </p>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {t('reject')}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
