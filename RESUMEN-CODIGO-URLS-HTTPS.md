# 📋 Resumen Completo: Código de URLs HTTPS y Visibilidad para Crawlers

## ✅ Estado General: **TODAS LAS URLs SON HTTPS Y VISIBLES POR CRAWLERS**

---

## 1. 🔧 Archivos Clave que Generan URLs

### `src/lib/utils/basepath.ts` - Función Central para URLs

```typescript
export function getNormalizedOrigin(): string {
  if (typeof window === 'undefined') {
    // Server-side: use production URL
    return 'https://celebratevalentines.com';
  }
  
  // Client-side: check if we're in production
  const hostname = window.location.hostname;
  const isProduction = hostname === 'celebratevalentines.com' || hostname === 'www.celebratevalentines.com';
  
  if (isProduction) {
    // Always use HTTPS without port in production
    return 'https://celebratevalentines.com';
  }
  
  // Development: return current origin (with port if needed)
  return window.location.origin;
}
```

**✅ Estado**: Correcto - Siempre retorna HTTPS en producción

---

### `src/app/sitemap.ts` - Generación de Sitemap

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://celebratevalentines.com';  // ✅ HTTPS absoluto
  
  const routes: MetadataRoute.Sitemap = [];
  
  // Home page for each locale
  for (const locale of locales) {
    routes.push({
      url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,  // ✅ HTTPS absoluto
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }
  
  // City pages for each locale
  for (const locale of locales) {
    for (const city of CITIES) {
      routes.push({
        url: `${baseUrl}/${locale}/${city}`,  // ✅ HTTPS absoluto
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }
  
  // Category pages
  for (const locale of locales) {
    for (const city of CITIES) {
      for (const pageType of PAGE_TYPES) {
        routes.push({
          url: `${baseUrl}/${locale}/${city}/${pageType}`,  // ✅ HTTPS absoluto
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
  }
  
  return routes;
}
```

**✅ Estado**: Correcto - Todas las URLs del sitemap son HTTPS absolutas

---

### `src/app/robots.ts` - Configuración de Robots

```typescript
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://celebratevalentines.com';  // ✅ HTTPS absoluto

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // ✅ CRITICAL: Allow /_next/static/ for Next.js rendering
        disallow: ['/api/', '/admin/'],  // ✅ No bloquea /_next/
      },
      // ✅ Explicitly allow AI bots
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // ... más bots AI
    ],
    sitemap: `${baseUrl}/sitemap.xml`,  // ✅ HTTPS absoluto
  };
}
```

**✅ Estado**: Correcto - Permite acceso a crawlers y /_next/static/

---

### `src/app/[locale]/[city]/page.tsx` - Metadata de Páginas de Ciudad

```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city } = await params;
  const citySlug = normalizeCitySlug(city);
  
  // ✅ Build URL with locale (always include locale prefix)
  const basePath = `/${locale}/${citySlug}/`;
  const canonicalUrl = `https://celebratevalentines.com${basePath}`;  // ✅ HTTPS absoluto
  
  // ✅ Skyline image URL
  const skylineImageUrl = `https://celebratevalentines.com/images/posters/skyline-${citySlug}.${skylineImageExtension}`;  // ✅ HTTPS absoluto
  
  return {
    title: seoKeywords.title,
    description: seoKeywords.description,
    openGraph: {
      title: seoKeywords.title,
      description: seoKeywords.description,
      url: canonicalUrl,  // ✅ HTTPS absoluto
      images: [{ url: skylineImageUrl }],  // ✅ HTTPS absoluto
    },
    twitter: {
      images: [skylineImageUrl],  // ✅ HTTPS absoluto
    },
    alternates: {
      canonical: canonicalUrl,  // ✅ HTTPS absoluto
      languages: {
        'en': `https://celebratevalentines.com/en/${citySlug}/`,  // ✅ HTTPS absoluto
        'es': `https://celebratevalentines.com/es/${citySlug}/`,  // ✅ HTTPS absoluto
        'fr': `https://celebratevalentines.com/fr/${citySlug}/`,  // ✅ HTTPS absoluto
        'de': `https://celebratevalentines.com/de/${citySlug}/`,  // ✅ HTTPS absoluto
        'it': `https://celebratevalentines.com/it/${citySlug}/`,  // ✅ HTTPS absoluto
        'pt': `https://celebratevalentines.com/pt/${citySlug}/`,  // ✅ HTTPS absoluto
        'x-default': `https://celebratevalentines.com/en/${citySlug}/`,  // ✅ HTTPS absoluto
      },
    },
    robots: {
      index: true,  // ✅ Indexable
      follow: true,  // ✅ Followable
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

**✅ Estado**: Correcto - Todas las URLs son HTTPS absolutas y indexables

---

### `src/app/[locale]/[city]/gifts/page.tsx` - Metadata de Página de Regalos

```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city } = await params;
  const citySlug = normalizeCitySlug(city);
  
  // ✅ Build URL with locale
  const basePath = `/${locale}/${citySlug}/gifts/`;
  const canonicalUrl = `https://celebratevalentines.com${basePath}`;  // ✅ HTTPS absoluto
  
  const skylineImageUrl = `https://celebratevalentines.com/images/posters/skyline-${citySlug}.${skylineImageExtension}`;  // ✅ HTTPS absoluto
  
  return {
    // ... metadata similar a city page
    alternates: {
      canonical: canonicalUrl,  // ✅ HTTPS absoluto
      languages: {
        'en': `https://celebratevalentines.com/en/${citySlug}/gifts/`,  // ✅ HTTPS absoluto
        'es': `https://celebratevalentines.com/es/${citySlug}/gifts/`,  // ✅ HTTPS absoluto
        // ... todos los locales con HTTPS absoluto
      },
    },
  };
}
```

**✅ Estado**: Correcto - Todas las URLs son HTTPS absolutas

---

### `src/app/[locale]/page.tsx` - Metadata de Homepage

```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    // ... metadata
    openGraph: {
      url: `https://celebratevalentines.com/${locale}/`,  // ✅ HTTPS absoluto
      images: [{
        url: 'https://celebratevalentines.com/images/posters/skyline-paris.jpg',  // ✅ HTTPS absoluto
      }],
    },
    alternates: {
      canonical: `https://celebratevalentines.com/${locale}/`,  // ✅ HTTPS absoluto
      languages: {
        'en': 'https://celebratevalentines.com/en/',  // ✅ HTTPS absoluto
        'es': 'https://celebratevalentines.com/es/',  // ✅ HTTPS absoluto
        'fr': 'https://celebratevalentines.com/fr/',  // ✅ HTTPS absoluto
        'de': 'https://celebratevalentines.com/de/',  // ✅ HTTPS absoluto
        'it': 'https://celebratevalentines.com/it/',  // ✅ HTTPS absoluto
        'pt': 'https://celebratevalentines.com/pt/',  // ✅ HTTPS absoluto
        'x-default': 'https://celebratevalentines.com/en/',  // ✅ HTTPS absoluto
      },
    },
  };
}
```

**✅ Estado**: Correcto - Todas las URLs son HTTPS absolutas

---

### `src/components/seo/hreflang-links.tsx` - Componente Hreflang

```typescript
export function HreflangLinks({ currentLocale, currentPath }: HreflangLinksProps) {
  // ... process basePath
  
  // ✅ Build URLs for each locale
  const baseUrl = 'https://celebratevalentines.com';  // ✅ HTTPS absoluto
  
  return (
    <>
      {locales.map((locale) => {
        const localePath = locale === 'en' 
          ? basePath 
          : `/${locale}${basePath}`;
        const fullUrl = `${baseUrl}${localePath}`;  // ✅ HTTPS absoluto
        
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={fullUrl}  // ✅ HTTPS absoluto
          />
        );
      })}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${basePath}`}  // ✅ HTTPS absoluto
      />
    </>
  );
}
```

**✅ Estado**: Correcto - Todas las URLs son HTTPS absolutas

---

### `src/lib/valentines/utm.ts` - UTM Tracking

```typescript
import { getNormalizedOrigin } from '@/lib/utils';  // ✅ Import correcto

export function buildPlanUtmUrl(
  planLink: string,
  planId: string | null | undefined,
  citySlug: string,
  incomingParams?: Record<string, string>
): string {
  // ... extract and clean plan ID
  
  try {
    let url: URL;
    try {
      url = new URL(planLink);
    } catch {
      // ✅ If relative URL, make it absolute using normalized origin
      const base = typeof window !== 'undefined' 
        ? getNormalizedOrigin()  // ✅ Usa getNormalizedOrigin() en lugar de window.location.origin
        : 'https://feverup.com';  // SSR fallback para planLinks de Fever
      url = new URL(planLink, base);
    }
    
    // ... add UTM params
    
    return url.toString();
  } catch (error) {
    // ... fallback
  }
}
```

**✅ Estado**: Correcto - Usa `getNormalizedOrigin()` para garantizar URL de producción

---

### `middleware.ts` - Middleware de Internacionalización

```typescript
export default function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname === '/') {
      const preferredLocale = detectPreferredLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}`;
      // ✅ Use 301 (Permanent) redirect for SEO
      return NextResponse.redirect(url, { status: 301 });
    }
    
    return intlMiddleware(request);
  } catch (error) {
    console.warn('Middleware error (non-blocking):', error);
    return NextResponse.next();
  }
}
```

**✅ Estado**: Correcto - Usa redirects 301 para SEO

---

## 2. 🤖 Configuración de Robots.txt

### `public/robots.txt` (Estático)

```
User-agent: *
Allow: /_next/static/  # ✅ Permite acceso a archivos Next.js
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://celebratevalentines.com/sitemap.xml  # ✅ HTTPS absoluto
```

**✅ Estado**: Correcto - Permite acceso a /_next/static/ y tiene sitemap HTTPS

---

### `src/app/robots.ts` (Dinámico)

```typescript
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://celebratevalentines.com';  // ✅ HTTPS absoluto

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],  // ✅ No bloquea /_next/
      },
      // ✅ Explicitly allow AI bots
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // ... más bots AI
    ],
    sitemap: `${baseUrl}/sitemap.xml`,  // ✅ HTTPS absoluto
  };
}
```

**✅ Estado**: Correcto - Permite acceso a todos los crawlers y AI bots

---

## 3. ✅ Verificaciones Completadas

### ✅ URLs Canónicas
- Todas usan `https://celebratevalentines.com` (absolutas)
- Todas son HTTPS (no HTTP)
- No hay referencias a localhost en producción

### ✅ Sitemap
- Todas las URLs son HTTPS absolutas
- Incluye todas las ciudades y locales
- Estructura correcta con prioridades

### ✅ Hreflang
- Todas las URLs son HTTPS absolutas
- Incluye self-reference automático
- Incluye x-default

### ✅ OpenGraph / Twitter Cards
- Todas las URLs de imágenes son HTTPS absolutas
- Todas las URLs de páginas son HTTPS absolutas

### ✅ Robots.txt
- Permite acceso a /_next/static/ (crítico para Next.js)
- Permite acceso a AI bots (GPTBot, Google-Extended, CCBot, ClaudeBot, etc.)
- Sitemap apunta a HTTPS absoluto

### ✅ UTM Tracking
- Usa `getNormalizedOrigin()` en lugar de `window.location.origin`
- Garantiza URLs de producción en todos los casos

### ✅ Metadata
- Todas las páginas tienen `robots: { index: true, follow: true }`
- GoogleBot configurado correctamente
- No hay `noindex` tags

---

## 4. 📊 Resumen de Archivos Verificados

| Archivo | URLs HTTPS | Visibles por Crawlers | Estado |
|---------|------------|----------------------|--------|
| `src/app/sitemap.ts` | ✅ | ✅ | Correcto |
| `src/app/robots.ts` | ✅ | ✅ | Correcto |
| `src/lib/utils/basepath.ts` | ✅ | ✅ | Correcto |
| `src/lib/valentines/utm.ts` | ✅ | ✅ | Correcto |
| `src/app/[locale]/[city]/page.tsx` | ✅ | ✅ | Correcto |
| `src/app/[locale]/[city]/gifts/page.tsx` | ✅ | ✅ | Correcto |
| `src/app/[locale]/[city]/restaurants/page.tsx` | ✅ | ✅ | Correcto |
| `src/app/[locale]/[city]/valentines-day/ideas/page.tsx` | ✅ | ✅ | Correcto |
| `src/app/[locale]/[city]/valentines-day/last-minute/page.tsx` | ✅ | ✅ | Correcto |
| `src/app/[locale]/page.tsx` | ✅ | ✅ | Correcto |
| `src/components/seo/hreflang-links.tsx` | ✅ | ✅ | Correcto |
| `middleware.ts` | ✅ | ✅ | Correcto |
| `public/robots.txt` | ✅ | ✅ | Correcto |

---

## 5. 🎯 Conclusión

**✅ TODAS LAS URLs SON HTTPS Y VISIBLES POR CRAWLERS**

- ✅ No hay URLs HTTP en código de producción
- ✅ No hay referencias a localhost en código de producción
- ✅ Todas las URLs canónicas son HTTPS absolutas
- ✅ Todas las URLs de hreflang son HTTPS absolutas
- ✅ Todas las URLs del sitemap son HTTPS absolutas
- ✅ robots.txt permite acceso a /_next/static/ y a todos los crawlers
- ✅ UTM tracking usa `getNormalizedOrigin()` para garantizar URLs de producción
- ✅ Todas las páginas tienen `robots: { index: true, follow: true }`

**Estado Final**: ✅ **LISTO PARA PRODUCCIÓN Y CRAWLERS**

---

## 6. 📝 Notas sobre Advertencias del Script

Las advertencias del script de debug sobre "URLs relativas" son **falsos positivos**:

- `/apple-touch-icon.png` - Es correcto que sea relativa (Next.js la resuelve automáticamente)
- Template strings como `` `${baseUrl}/${locale}` `` - Son correctos, se resuelven en runtime
- Variables como `basePath` - Son correctos, se usan para construir URLs absolutas

**El código está correcto y todas las URLs generadas en runtime son HTTPS absolutas.**
