import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import Link from 'next/link';

const FULL_COOKIE_POLICY_URL = 'https://docs.google.com/document/d/17FTyssWyH8JRpxiO4odyUtVgbECJxpTWV5FYa8B7Qfs/pub';
const FEVER_PRIVACY_BASE = 'https://feverup.com/legal';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LegalCookies' });
  return {
    title: t('title'),
    description: t('metaDescription'),
    robots: { index: true, follow: true },
  };
}

export default async function LegalCookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LegalCookies' });
  const privacyUrl = `${FEVER_PRIVACY_BASE}/privacy_${['en', 'es', 'fr', 'de', 'it', 'pt'].includes(locale) ? locale : 'es'}.html`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-gray-300">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('title')}</h1>

      <p className="mb-4">{t('intro')}</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">{t('whoWeAre')}</h2>
        <p className="mb-2">{t('operator')}</p>
        <p>{t('domain')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">{t('whatCookies')}</h2>
        <p className="mb-2">{t('cookiesWeUse')}</p>
        <ul className="list-disc pl-6 space-y-1 mb-2">
          <li>{t('cookieConsent')}</li>
          <li>{t('analytics')}</li>
        </ul>
        <p>{t('youCanReject')}</p>
      </section>

      <section id="donotsell" className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">{t('doNotSellTitle')}</h2>
        <p>{t('doNotSellText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">{t('moreInfo')}</h2>
        <ul className="space-y-2">
          <li>
            <a href={FULL_COOKIE_POLICY_URL} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">
              {t('fullCookiePolicy')}
            </a>
          </li>
          <li>
            <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">
              {t('privacyPolicy')}
            </a>
          </li>
        </ul>
      </section>

      <p className="text-sm text-gray-500">{t('lastUpdated')}</p>

      <div className="mt-8">
        <Link href={`/${locale}/`} className="text-pink-400 hover:text-pink-300 font-medium">
          ← {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
