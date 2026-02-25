import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // With App Router, locale comes from route params via middleware
  // If locale is undefined, it means middleware didn't set it properly
  if (!locale) {
    // This should not happen with proper middleware setup
    // But we'll default to 'en' as a fallback
    locale = 'en';
  }

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    console.error(`Invalid locale: ${locale}`);
    notFound();
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    notFound();
  }
});
