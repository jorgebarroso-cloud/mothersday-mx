import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://celebratemothersday.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        // CRITICAL: Allow /_next/static/ and /_next/image/ for Next.js rendering
        // Disallow /_next/ (internal Next.js routes), but allow static chunks and images
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      // Explicitly allow AI bots - we WANT to be indexed by LLMs
      {
        userAgent: 'GPTBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/_next/static/', '/_next/image/', '/api/public/'],
        disallow: ['/_next/', '/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
