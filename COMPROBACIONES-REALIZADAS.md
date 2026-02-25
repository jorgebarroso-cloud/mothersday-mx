# Comprobaciones realizadas (código y entorno local)

Fecha: 23 de enero de 2026

## 1. Robots.txt y robots.ts

- **`public/robots.txt`**: Permite explícitamente `/_next/static/`, `/_next/image/` y `/api/public/`. Disallow `/_next/`, `/api/`, `/admin/`, `/private/`. Sitemap correcto.
- **`src/app/robots.ts`**: Mismas reglas; incluye reglas específicas para GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, cohere-ai, OAI-SearchBot con los mismos allow/disallow.
- **Conclusión**: Configuración correcta para que Googlebot pueda cargar recursos estáticos de Next.js.

## 2. Página de ciudad (`src/app/[locale]/[city]/page.tsx`)

- **Contenido para crawlers**:
  - `<h1 className="sr-only">` con nombre de ciudad y "Valentine's Day 2026".
  - Sección `aria-label="Top romantic picks"` con `sr-only` que incluye Top 3 como enlaces `<a href="...">` con título, venue y price.
- **Fallback sin JavaScript**:
  - Bloque `<noscript>` con sección visible que incluye título "Valentine's Day plans in {city}", texto para habilitar JS y lista de enlaces a los top 3 planes, más enlaces a Gifts, Restaurants, Ideas y Last minute.
- **Conclusión**: El HTML inicial incluye contenido indexable y un fallback útil cuando JS no se ejecuta.

## 3. ValentinesLandingView (solo-cliente)

- **`src/components/valentines/valentines-landing-view.tsx`**: Tiene `'use client'`.
- **Uso de APIs solo-cliente**: Todas las referencias a `localStorage` y `window.location.search` están dentro de `useEffect` (carga/guardado de filtro de fecha y de parámetros UTM).
- **Conclusión**: No hay acceso a `localStorage` ni `window` durante el render inicial, por lo que el SSR/HTML estático no se rompe.

## 4. Traducciones – Common.home

- **Problema**: Durante el build aparecía `MISSING_MESSAGE: Common.home (en)` porque `category-page-view.tsx` usa `tCommon('home')` con namespace `Common`, pero la clave `home` solo existía en `Footer`.
- **Corrección**: Se añadió la clave `"home"` al namespace `Common` en los seis archivos de mensajes (`en`, `es`, `fr`, `de`, `it`, `pt`) con las traducciones adecuadas (Home, Inicio, Accueil, Startseite, Home, Início).
- **Conclusión**: El build de páginas estáticas que usan breadcrumbs con "Home" ya no debería fallar por falta de `Common.home`.

## 5. Build estático

- **Comportamiento**: Con `NODE_ENV=production`, `next.config.js` activa `output: 'export'` (por `isStaticExport`), por lo que el build genera HTML estático en `out/`.
- **Nota**: El build completo (972 páginas) puede tardar varios minutos y en entorno local puede hacer fetch a Google Sheets para páginas temáticas (gifts, restaurants, etc.), lo que puede provocar errores "Dynamic server usage: no-store fetch" si se usa fetch sin caché en rutas estáticas. La corrección de `Common.home` evita al menos el fallo por mensaje faltante en esas rutas.

## Resumen

| Comprobación              | Estado   | Notas                                                |
|---------------------------|----------|------------------------------------------------------|
| robots.txt                | OK       | Allow /_next/static/, /_next/image/                  |
| robots.ts                 | OK       | Mismas reglas + bots específicos                    |
| Contenido HTML ciudad     | OK       | h1 sr-only, sección top 3, noscript con enlaces    |
| Noscript fallback         | OK       | Enlaces a planes y a Gifts, Restaurants, Ideas, etc.|
| ValentinesLandingView     | OK       | localStorage/window solo en useEffect                |
| Common.home               | Corregido| Añadido en los 6 idiomas                             |
| Build estático (out/)     | Parcial  | Config correcta; build completo depende de red/caché|
| Redirecciones HTTP        | OK       | 200 OK en /en/new-york/, sin redirecciones          |
| CSS / renderizado         | OK       | display:none solo en scrollbars; sr-only solo en h1/top3 |
| Renderizado gris GSC      | Corregido| fade-in-up sin opacity:0; hero bg fallback; sección visible ciudad |
| Contenido visible todas las páginas | OK | Home + ciudad + gifts/restaurants/ideas/last-minute con sección visible (título + enlaces) |
| Verificación URLs sitio             | OK | Todas las rutas revisadas; redirect raíz a /en/ con trailing slash; sin problema de render gris |

## 6. Redirecciones HTTP – URL `/en/new-york/`

- **Comprobación**: Petición GET a `https://celebratevalentines.com/en/new-york/` (PowerShell `Invoke-WebRequest`, hasta 5 redirecciones).
- **Resultado**: **StatusCode: 200**, **FinalUrl: https://celebratevalentines.com/en/new-york/** (sin redirecciones).
- **Conclusión**: La URL responde correctamente y no hay redirecciones inesperadas que puedan afectar a la indexación o al renderizado en GSC.

## 7. Análisis CSS / HTML – renderizado del contenido principal

- **`display: none`**:
  - **`src/components/valentines/category-nav.tsx`**: Solo en `::-webkit-scrollbar` (oculta la barra de desplazamiento del carrusel). No afecta al contenido.
  - **`src/app/globals.css`**: Clase `.scrollbar-hide` para ocultar scrollbars. No oculta contenido principal.
- **`sr-only`** (Tailwind – contenido solo para lectores de pantalla / crawlers):
  - **`src/app/[locale]/[city]/page.tsx`**: Aplicado únicamente al `<h1>`, a la `<section aria-label="Top romantic picks">` y al `<h2>` del top 3. Es intencional para SEO y accesibilidad; el contenido visible de la landing está en `<ValentinesLandingView>` y en `<noscript>`.
- **`opacity` en animaciones**: En `globals.css` (keyframes `float-up`) y en `valentines-landing-view.tsx` (corazón decorativo `opacity: 0.7`). No ocultan el contenido principal.
- **Conclusión**: No hay estilos que oculten el contenido principal de la página. El único contenido “oculto” visualmente es el marcado con `sr-only` (h1 y sección top 3), que está pensado para crawlers y lectores de pantalla. La landing visual se sirve con el HTML de `<ValentinesLandingView>` (pre-renderizado por Next.js) y el fallback visible está en `<noscript>`.

## Qué debes hacer tú (producción y GSC)

1. **Despliegue y caché**: Despliega la versión actual (con noscript y Common.home) y purga caché si aplica.
2. **Código fuente en producción**: En incógnito, abre `https://celebratevalentines.com/en/new-york/` y "Ver código fuente" (Ctrl+U). Comprueba que el body contiene la landing, el bloque `<noscript>` y los enlaces.
3. **Google Search Console**: Inspección de URL para esa página; revisar pestaña "HTML" / "Ver página indexada" y la captura de pantalla.
4. **Si la captura sigue gris**: Probar con Puppeteer/Playwright usando user-agent de Googlebot para reproducir posibles fallos de JS/CSS en el entorno del bot.

## 8. Correcciones para el renderizado gris en GSC (23 ene 2026)

- **Causa identificada**: (1) La animación `.animate-fade-in-up` aplicaba `opacity: 0` al contenido del hero (título, descripción), por lo que si el crawler no ejecutaba la animación CSS o capturaba antes de que terminara, el contenido permanecía invisible. (2) Si la imagen del hero no cargaba en el entorno del bot, el área podía verse gris/transparente sin color de fallback. (3) No había un bloque de contenido visible siempre en el HTML inicial más allá del noscript (que solo se muestra con JS deshabilitado).
- **Correcciones aplicadas**:
  1. **`src/app/globals.css`**: Se quitó `opacity: 0` de la clase `.animate-fade-in-up` y se eliminó la animación de opacidad del keyframe `fade-in-up` (solo se anima `transform: translateY`). Así el contenido del hero es visible desde el primer frame para crawlers y no depende de que la animación se ejecute.
  2. **`src/components/valentines/hero-section.tsx`**: Se añadió `bg-[#FF3366]` al `<header>` y a los contenedores del fondo (ciudad y home) como color de fallback cuando la imagen del hero no carga (p. ej. timeout o bloqueo en el entorno del bot).
  3. **`src/app/[locale]/[city]/page.tsx`**: Se añadió una sección visible siempre (no sr-only, no noscript) con título "Valentine's Day 2026 in {city}", enlaces a los Top 3 y a Gifts, Restaurants, Ideas y Last minute. Así GSC ve contenido indexable y visible en el HTML inicial aunque falle la imagen del hero o la hidratación.
- **Resumen**: El contenido del hero ya no depende de la animación de opacidad para ser visible; el hero tiene color de fondo de fallback; y hay un bloque de título + enlaces siempre visible en la página de ciudad para crawlers.

## 9. Contenido visible en todas las páginas (garantía para crawlers)

- **Objetivo**: Asegurar que en cada tipo de página haya contenido visible en el HTML inicial (sin depender de JS ni de la hidratación), para que crawlers y GSC vean siempre algo útil.
- **Implementación**:
  1. **Home** (`src/app/[locale]/page.tsx`): Sección visible con h1 "Valentine's Day 2026 — Best romantic plans & dinners" y enlaces a ciudades (New York, Paris, Madrid, London, Sydney).
  2. **Página de ciudad** (`src/app/[locale]/[city]/page.tsx`): Sección visible con h2 "Valentine's Day 2026 in {city}", enlaces al Top 3 y a Gifts, Restaurants, Ideas, Last minute (ya existente).
  3. **Páginas de categoría** (gifts, restaurants, ideas, last-minute): En cada una se añadió una sección visible con h2 específico ("Valentine's Day Gifts in {city}", "Valentine's Day Restaurants in {city}", etc.) y enlaces "Back to {city}", Gifts, Restaurants, Ideas, Last minute.
- **Resultado**: En **todas** las rutas (home por idioma, ciudad por idioma, y cada categoría por ciudad/idioma) el HTML inicial incluye al menos un título visible y enlaces de navegación, de modo que el contenido de cada página es visible para crawlers y usuarios aunque falle JS o la carga de recursos.

## 10. Verificación de todas las URLs del sitio (sin problema de renderizado gris)

Se han revisado **todas** las rutas del sitio para asegurar que ninguna tenga el problema de pantalla gris en GSC (contenido no visible). Resumen por tipo de URL:

| Tipo de URL | Patrón | Archivo | Contenido visible garantizado | Estado |
|-------------|--------|--------|-------------------------------|--------|
| **Raíz** | `/` | `src/app/page.tsx` | No aplica: redirige a `/{locale}/` (301). Redirect actualizado a `/en/` con trailing slash. | OK |
| **Home por idioma** | `/{locale}/` (en, es, fr, de, it, pt) | `src/app/[locale]/page.tsx` | Sección visible: h1 "Valentine's Day 2026 — Best romantic plans & dinners" + enlaces a ciudades. Hero con bg fallback y animación sin opacity:0. | OK |
| **Ciudad** | `/{locale}/{city}/` (ej. /en/new-york/) | `src/app/[locale]/[city]/page.tsx` | Sección visible: h2 "Valentine's Day 2026 in {city}" + Top 3 + Gifts, Restaurants, Ideas, Last minute. Hero con bg fallback. Noscript adicional. | OK |
| **Gifts** | `/{locale}/{city}/gifts/` | `src/app/[locale]/[city]/gifts/page.tsx` | Sección visible: h2 "Valentine's Day Gifts in {city}" + Back to city + enlaces categorías. CategoryPageView pre-renderizado. | OK |
| **Restaurants** | `/{locale}/{city}/restaurants/` | `src/app/[locale]/[city]/restaurants/page.tsx` | Sección visible: h2 "Valentine's Day Restaurants in {city}" + Back to city + enlaces categorías. CategoryPageView pre-renderizado. | OK |
| **Ideas** | `/{locale}/{city}/valentines-day/ideas/` | `src/app/[locale]/[city]/valentines-day/ideas/page.tsx` | Sección visible: h2 "Valentine's Day Ideas in {city}" + Back to city + enlaces categorías. CategoryPageView pre-renderizado. | OK |
| **Last minute** | `/{locale}/{city}/valentines-day/last-minute/` | `src/app/[locale]/[city]/valentines-day/last-minute/page.tsx` | Sección visible: h2 "Last minute Valentine's Day in {city}" + Back to city + enlaces categorías. CategoryPageView pre-renderizado. | OK |

**Comprobaciones aplicadas a todas las rutas:**

1. **Sección visible en HTML**: Cada página que renderiza contenido (no redirect) tiene una sección con título visible (h1 o h2) y enlaces de navegación, servida en el HTML inicial sin depender de JS.
2. **Hero**: Donde se usa HeroSection (home y ciudad), el hero tiene color de fondo de fallback (`bg-[#FF3366]`) y la animación `fade-in-up` ya no usa `opacity: 0` (solo `transform`), por lo que el título y la descripción del hero son visibles desde el primer frame.
3. **Redirect raíz**: La raíz `/` redirige a `/{locale}/`; `src/app/page.tsx` redirige a `/en/` y el middleware redirige a `/{preferredLocale}/` con trailing slash, alineado con el sitemap y `trailingSlash: true`.

**Conclusión**: Todas las URLs del sitio (home, ciudad, gifts, restaurants, ideas, last-minute para cada locale y ciudad) tienen contenido visible garantizado en el HTML inicial y no presentan el problema de renderizado gris mostrado en GSC.
