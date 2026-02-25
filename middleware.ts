import createMiddleware from 'next-intl/middleware';
import { locales, type Locale } from './src/i18n';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware de Internacionalización con Detección por Geolocalización
 * 
 * CÓMO FUNCIONA LA DETECCIÓN AUTOMÁTICA DE IDIOMA (ORDEN DE PRIORIDAD):
 * 
 * 1. **Detección por URL**: Si el usuario visita /es/madrid/, el idioma es español
 * 2. **Detección por Cookie**: Si el usuario cambió el idioma antes, se guarda en cookie
 * 3. **🌍 DETECCIÓN POR GEOLOCALIZACIÓN (IP)**: 
 *    - Detecta el país del usuario por su IP
 *    - Mapea el país al idioma correspondiente
 *    - Ejemplo: Usuario desde España → /es/
 *    - Ejemplo: Usuario desde Francia → /fr/
 * 4. **Detección por Navegador (Accept-Language)**: 
 *    - Si no se puede detectar el país, usa el idioma del navegador
 * 5. **Fallback**: Si no hay match, usa inglés (/en/) como predeterminado
 * 
 * EJEMPLOS:
 * - Usuario desde España (IP) → /es/ (independientemente del idioma del navegador)
 * - Usuario desde Francia (IP) → /fr/
 * - Usuario desde Alemania (IP) → /de/
 * - Usuario desde Italia (IP) → /it/
 * - Usuario desde Portugal (IP) → /pt/
 * - Usuario desde cualquier otro país → /en/ o idioma del navegador
 * 
 * NOTA: El usuario siempre puede cambiar el idioma manualmente usando el selector de idioma
 */

// Mapeo de países (códigos ISO 3166-1) a idiomas
const countryToLocale: Record<string, Locale> = {
  // Países de habla hispana
  'ES': 'es', // España
  'MX': 'es', // México
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'CL': 'es', // Chile
  'PE': 'es', // Perú
  'VE': 'es', // Venezuela
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // República Dominicana
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panamá
  'UY': 'es', // Uruguay
  'PR': 'es', // Puerto Rico
  
  // Países de habla francesa
  'FR': 'fr', // Francia
  'BE': 'fr', // Bélgica (francés)
  'CH': 'fr', // Suiza (francés)
  'CA': 'fr', // Canadá (francés)
  'LU': 'fr', // Luxemburgo
  'MC': 'fr', // Mónaco
  
  // Países de habla alemana
  'DE': 'de', // Alemania
  'AT': 'de', // Austria
  'LI': 'de', // Liechtenstein
  
  // Países de habla italiana
  'IT': 'it', // Italia
  'SM': 'it', // San Marino
  'VA': 'it', // Ciudad del Vaticano
  
  // Países de habla portuguesa
  'PT': 'pt', // Portugal
  'BR': 'pt', // Brasil
  'AO': 'pt', // Angola
  'MZ': 'pt', // Mozambique
};

// Mapeo de idiomas del navegador a locales
const browserLanguageMap: Record<string, Locale> = {
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'it': 'it',
  'it-IT': 'it',
  'pt': 'pt',
  'pt-PT': 'pt',
  'pt-BR': 'pt',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
};

/**
 * Detecta el país del usuario desde headers de geolocalización
 * Soporta: Vercel, Cloudflare, y otros servicios comunes
 */
function detectCountryFromHeaders(request: NextRequest): string | null {
  // Vercel (si están usando Vercel)
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry;

  // Cloudflare (si están usando Cloudflare)
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry) return cfCountry;

  // Cloud Run / GCP (si hay headers personalizados)
  const gcpCountry = request.headers.get('x-country-code');
  if (gcpCountry) return gcpCountry;

  // Otros servicios comunes
  const country = request.headers.get('x-country') || 
                  request.headers.get('x-geoip-country') ||
                  request.headers.get('cloudfront-viewer-country');
  
  return country;
}

/**
 * Detecta el idioma del navegador desde Accept-Language header
 */
function detectLocaleFromBrowser(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) {
    return 'en';
  }

  // Parse Accept-Language header (e.g., "es-ES,es;q=0.9,en;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', '')) || 1;
      return { code: code.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first matching locale
  for (const { code } of languages) {
    // Try exact match first
    if (browserLanguageMap[code]) {
      return browserLanguageMap[code];
    }
    
    // Try language code only (e.g., 'es' from 'es-ES')
    const langCode = code.split('-')[0];
    if (browserLanguageMap[langCode]) {
      return browserLanguageMap[langCode];
    }
  }

  return 'en';
}

/**
 * Detecta el locale basado en geolocalización o navegador
 */
function detectPreferredLocale(request: NextRequest): Locale {
  // 1. Intentar detectar país por IP (geolocalización)
  const country = detectCountryFromHeaders(request);
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }

  // 2. Si no hay geolocalización, usar idioma del navegador
  return detectLocaleFromBrowser(request);
}

const intlMiddleware = createMiddleware({
  // Lista de todos los idiomas soportados
  locales: locales as string[],

  // Idioma por defecto si no se detecta ninguno
  defaultLocale: 'en',

  // Estrategia: Siempre mostrar prefijo de idioma en la URL
  // Esto mejora el SEO y permite compartir URLs específicas por idioma
  localePrefix: 'always',
  
  // ✅ HABILITAR detección automática de idioma
  // Esto detecta automáticamente el idioma del navegador (Accept-Language header)
  // y también guarda la preferencia en una cookie para futuras visitas
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  // Para static export, el middleware debe ser simple y no hacer redirecciones
  // durante el build. Las rutas ya están pre-generadas con generateStaticParams.
  // El middleware solo se ejecutará en runtime si hay un servidor Node.js.
  
  try {
    // Si es la raíz (/), detectar locale preferido y redirigir
    // (solo funciona en runtime con servidor, no durante build estático)
    if (request.nextUrl.pathname === '/') {
      const preferredLocale = detectPreferredLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}/`;
      // Use 301 (Permanent) redirect for SEO - tells search engines this is the canonical URL (trailing slash for consistency with sitemap)
      return NextResponse.redirect(url, { status: 301 });
    }

    // Para otras rutas, usar el middleware de next-intl
    return intlMiddleware(request);
  } catch (error) {
    // Si hay un error durante el build, simplemente pasar la solicitud
    // Esto permite que el build continúe aunque el middleware falle
    console.warn('Middleware error (non-blocking):', error);
    return NextResponse.next();
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match root and all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
