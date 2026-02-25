# Verificación de crawlabilidad en producción — celebratevalentines.com

**Fecha**: 23 enero 2026  
**Dominio**: https://celebratevalentines.com (uso exclusivo, fin SEO y posicionamiento orgánico)  
**URL principal**: https://celebratevalentines.com/en/

---

## 1. Resumen ejecutivo

| Comprobación | Estado | Notas |
|--------------|--------|--------|
| **robots.txt** | OK | Permite a Google y a IAs; Sitemap declarado |
| **Contenido visible /en/** | OK | Título, H1, Global Guide, ciudades, testimonios, Why Celebrate, Why Choose Us |
| **Contenido visible /en/new-york/** | OK | Título NYC, Top 3, enlaces Fever, Ideas (Gifts, Restaurants, Ideas, Last minute), categorías, planes |
| **HTTPS** | OK | Servido por HTTPS; ForceHttps en código para redirigir HTTP→HTTPS si aplica |
| **Meta indexación** | OK | Sin noindex en páginas importantes; index, follow en layout |
| **Sitemap** | OK | Responde 200; ~170 KB de URLs (home, locales, ciudades, categorías) |
| **Structured Data** | En código | WebSite + Organization (home); CollectionPage/ItemList (ciudad) |

**Conclusión**: El sitio en producción es **crawleable** por Google y por bots de IA; el contenido principal es **detectable** en el HTML servido.

---

## 2. robots.txt (producción)

**URL comprobada**: https://celebratevalentines.com/robots.txt

- **User-Agent: \*** — Allow: `/_next/static/`, `/_next/image/`, `/api/public/`; Disallow: `/_next/`, `/api/`, `/admin/`, `/private/`
- **GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, cohere-ai, OAI-SearchBot** — Mismas reglas; todos pueden rastrear el sitio y cargar recursos estáticos.
- **Sitemap**: `https://celebratevalentines.com/sitemap.xml`

Los bots de Google y de IA tienen permiso explícito y pueden cargar JS/CSS necesarios para el renderizado.

---

## 3. Contenido visible para crawlers

### 3.1 Página principal (https://celebratevalentines.com/en/)

Contenido comprobado en la respuesta HTML (texto extraído):

- **Título**: "Valentine's Day 2026: Best Romantic Plans & Dinners"
- **H1**: "Unforgettable Valentine's Day 2026: Romantic Plans & Experiences"
- **Global Guide**: "Your Global Guide to Valentine's Day", descripción, "Explore All Cities"
- **Ciudades**: Enlaces a New York, Los Angeles, Chicago, London, Sydney, Melbourne, Toronto, Madrid, Barcelona, Ciudad de México, Buenos Aires, Paris, Montréal, Berlin, München, Vienna, Lisboa, Roma, Milano (con URLs absolutas a celebratevalentines.com)
- **Testimonios**: Sofia & Marc (Rome), Alex (NYC), Emma & James (Paris)
- **Why Celebrate Valentine's Day**: Strengthen Your Bond, Create Lasting Memories, Express Your Love, Reconnect & Rekindle
- **Why Choose Us**: Curated Experiences, Instant Booking, Verified Reviews, Unique Gifts & Ideas, Romantic Experiences in Top Cities, Global Guide 2026
- **Footer**: Popular Cities, All Cities, Resources, Legal

Todo el contenido anterior está en el HTML servido y es **detectable** por Google y por IAs sin depender de ejecución de JavaScript.

### 3.2 Página de ciudad (https://celebratevalentines.com/en/new-york/)

Contenido comprobado:

- **Título**: "Valentine's Day 2026 in NYC: Best Gifts & Ideas"
- **Top 3 Romantic Picks**: SUBMERGE, Candlelight: Valentine's Day Special, Ballet of Lights (con enlaces a feverup.com)
- **Why New York is Perfect**: Iconic Skyline, World-Class Dining, Broadway & Candlelight
- **Valentine's Day Ideas**: Gifts, Restaurants, Ideas, Last-Minute (enlaces a celebratevalentines.com/en/new-york/...)
- **Categorías**: Candlelight, Valentine's Specials, Concerts, Food & Drinks, Workshops, All Experiences
- **Planes**: Lista completa de experiencias con título, venue, fechas, precio y enlaces "Get Tickets"

En el código existen además `<h1 class="sr-only">` y una sección `sr-only` con el Top 3 como enlaces `<a>` para crawlers; el bloque `<noscript>` ofrece enlaces cuando JS está desactivado. El contenido visible en la respuesta coincide con lo que un bot puede indexar.

---

## 4. HTTP / HTTPS

- El sitio se sirve por **HTTPS** (las peticiones a https://celebratevalentines.com/en/ y /robots.txt responden correctamente).
- En el código, **ForceHttps** (`src/components/security/force-https.tsx`) redirige de HTTP a HTTPS en producción (celebratevalentines.com y www) si el usuario entra por HTTP. En entornos como Cloud Run, el balanceador suele forzar HTTPS antes de llegar a la app.
- Todas las URLs canónicas, Open Graph y alternates en el código usan `https://celebratevalentines.com`.

---

## 5. Indexación y meta robots

- En **src**: no hay `noindex` en páginas de contenido.
- **layout.tsx**: `robots: { index: true, follow: true }` y permisos explícitos para googleBot, GPTBot, Google-Extended, CCBot, ClaudeBot.
- Páginas de locale y ciudad usan `generateMetadata` con `robots: { index: true, follow: true }`.

No hay bloqueos de indexación para las páginas destinadas a SEO.

---

## 6. Sitemap

- **robots.txt** declara: `Sitemap: https://celebratevalentines.com/sitemap.xml`
- **Comprobado en producción**: https://celebratevalentines.com/sitemap.xml responde **200 OK**, contenido XML válido (~170 KB) con `<urlset>`, incluye `<loc>https://celebratevalentines.com/</loc>`, `/es/`, `/fr/`, y el resto de locales, ciudades y categorías generados por `src/app/sitemap.ts`.
- Todas las URLs usan `https://celebratevalentines.com` y trailing slash.

---

## 7. Structured Data (JSON-LD)

- **Home**: WebSite (nombre, url, SearchAction, description) + Organization (nombre, url, logo, description).
- **Ciudad**: CollectionPage + ItemList con planes (nombre, descripción, url, mainEntity).
- **Categorías**: Páginas de gifts, restaurants, ideas, last-minute con structured data específico.

Ayuda a que Google y asistentes entiendan el tipo de contenido y mejora la posibilidad de rich results.

---

## 8. Recomendaciones para mantener crawlabilidad y SEO

1. **Sitemap**: Comprobado — https://celebratevalentines.com/sitemap.xml responde 200 y contiene todas las URLs (home, locales, ciudades, categorías).
2. **Google Search Console**: Comprobar en "Inspección de URL" para https://celebratevalentines.com/en/ que "La URL está en Google" y que el HTML mostrado incluye el contenido esperado.
3. **HTTP**: Si el hosting no fuerza HTTPS en el edge, el componente ForceHttps seguirá redirigiendo en el cliente; idealmente HTTP→HTTPS se hace en servidor/CDN.
4. **Contenido**: No añadir `noindex` ni bloquear en robots.txt las rutas de contenido; mantener enlaces internos (ciudades, categorías) en el HTML como hasta ahora.

---

## 9. Conclusión

El sitio **https://celebratevalentines.com/en/** en producción está configurado para ser:

- **Crawleable** por Google (y bots estándar) y por IAs (GPTBot, Google-Extended, CCBot, ClaudeBot, etc.): robots.txt los permite y no bloquea contenido.
- **Visible** en contenido: el HTML servido incluye títulos, H1, texto de secciones, enlaces a ciudades y a planes (Fever), sin depender de que el bot ejecute JavaScript.
- **Servido correctamente por HTTPS**, con redirección HTTP→HTTPS en código para producción.
- **Orientado a indexación**: meta robots index, follow; canonical y hreflang en metadata; structured data para sitio y páginas de ciudad.

El dominio está en condiciones de uso exclusivo para SEO y posicionamiento orgánico según la configuración y el contenido verificados en producción.
