import type { Metadata } from 'next';
import { RootRedirect } from '@/components/root-redirect';

export const metadata: Metadata = {
  title: 'Redirect',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Root page (/) — not indexable, not meant to be seen.
 * Nginx returns 301 to https://celebratemothersday.com/en/ so users never hit this HTML.
 * This page is fallback only (e.g. if Nginx is bypassed); meta refresh + client redirect send to /en/.
 */
export default function RootPage() {
  return <RootRedirect />;
}
