import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ForceHttps } from '@/components/security/force-https';
import { CustomMeta } from '@/components/seo/custom-meta';
import { GAConsentGate } from '@/components/compliance/ga-consent-gate';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6G4HKV9NV7';

// Montserrat font for headings and body (modern and elegant)
const fontHeadline = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-headline',
  display: 'swap',
});

// Montserrat font for body (same font family, different weights)
const fontBody = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://celebratemothersday.com'),
  title: {
    default: "Mother's Day 2026: Best Gifts & Experiences",
    // template: "%s | Celebrate Mother's Day"
  },
  description: "Explore the best Mother's Day 2026 gifts and experiences. Book dinners, concerts, workshops & unique plans in NYC, Paris, Madrid & more. Make her day special.",
  keywords: [
    "mother's day",
    "mother's day gifts",
    "mother's day ideas",
    "gifts for mom",
    "mother's day experiences",
    "mother's day dinner",
    "last minute mother's day gifts",
    "mother's day 2026",
    "best mother's day gifts",
    "unique mother's day gifts",
    "mother's day activities",
    "celebrate mother's day"
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://celebratemothersday.com',
    siteName: "Celebrate Mother's Day",
    title: "Mother's Day 2026: Best Gifts & Experiences",
    description: "Explore the best Mother's Day 2026 gifts and experiences. Book dinners, concerts, workshops & unique plans in NYC, Paris, Madrid & more.",
    images: [
      {
        url: 'https://celebratemothersday.com/images/brand/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Celebrate Mother's Day - Unforgettable Mother's Day 2026",
        type: 'image/jpeg',
      },
      {
        url: 'https://celebratemothersday.com/images/posters/skyline-madrid.jpg',
        width: 1200,
        height: 630,
        alt: "Celebrate Mother's Day - Gifts & Experiences",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mother's Day 2026: Best Gifts & Experiences",
    description: "Explore the best Mother's Day 2026 gifts and experiences. Book dinners, concerts, workshops & unique plans in NYC, Paris, Madrid & more.",
    images: [
      {
        url: 'https://celebratemothersday.com/images/brand/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Celebrate Mother's Day - Unforgettable Mother's Day 2026",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    // Allow AI bots to index
    'GPTBot': { index: true, follow: true },
    'Google-Extended': { index: true, follow: true },
    'CCBot': { index: true, follow: true },
    'ClaudeBot': { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#FF1493'
      }
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", fontHeadline.variable, fontBody.variable)}>
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="DbtxwhGsdiLqrbDAznXKnm5fdzP7OaD5W3VjDzy9ncI" />
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Google Sheets API (used for data fetching) */}
        <link rel="dns-prefetch" href="https://docs.google.com" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#FF1493" />
        <meta name="msapplication-TileColor" content="#FF1493" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Redirect raíz a /en/ (en local: mismo host; en producción: dominio canónico) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=typeof window!=='undefined'?window.location.pathname:'';if(p==='/'||p===''){var isLocal=typeof window!=='undefined'&&(window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1');window.location.replace(isLocal?'/en/':'https://celebratemothersday.com/en/');}})();`,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <CustomMeta />
        <ForceHttps />
        <GAConsentGate measurementId={GA_MEASUREMENT_ID || undefined} />
        {/* Header moved to LocaleLayout to be inside NextIntlClientProvider */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

