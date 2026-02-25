'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getConsent } from '@/lib/cookies';

export function GAConsentGate({ measurementId }: { measurementId: string | undefined }) {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const value = getConsent();
    setConsent(value);

    const handler = () => setConsent(getConsent());
    window.addEventListener('cookieConsentUpdated', handler);
    return () => window.removeEventListener('cookieConsentUpdated', handler);
  }, []);

  if (!measurementId || consent !== 'accept') return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
