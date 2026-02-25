import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { UpdateHtmlLang } from '@/components/layout/update-html-lang';
import { HreflangLinksScript } from '@/components/seo/hreflang-links-script';
import { Header } from '@/components/layout/header';
import { CookieConsentBanner } from '@/components/compliance/cookie-consent-banner';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // Pass locale explicitly to getMessages
  const messages = await getMessages({ locale: locale as Locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <UpdateHtmlLang locale={locale as Locale} />
      <HreflangLinksScript />
      <Header />
      <main className="min-h-screen pt-14 md:pt-16">
        {children}
      </main>
      <CookieConsentBanner />
    </NextIntlClientProvider>
  );
}
