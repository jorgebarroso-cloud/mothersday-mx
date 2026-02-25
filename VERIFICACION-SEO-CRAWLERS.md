# Verificación: ¿Hemos resuelto el problema de pantalla en blanco y crawlers?

**Fecha**: 2026-01-23  
**Problema original**: GSC y Screaming Frog veían pantalla gris / contenido vacío; solo 34 URLs descubiertas.

**Actualización 2026-01-23 (solución definitiva crawlabilidad):** Se eliminó de nuevo el wrapper `Suspense` en la página ciudad y en las páginas de categoría (gifts, restaurants, ideas, last-minute). En `ValentinesLandingView` y `CategoryPageView` se sustituyó `useSearchParams()` por lectura de `window.location.search` en el `useEffect` de UTM (solo en cliente), de modo que el render del componente ya no depende de search params y Next.js incluye el contenido completo en el HTML estático. El contenido principal queda en el HTML inicial para crawlers y GSC.

---

## 1. Cambios aplicados (resumen)

| Fase | Cambio | Estado |
|------|--------|--------|
| **Fase 1** | Eliminar Suspense que envolvía el contenido principal | ✅ Hecho |
| **Fase 1** | Página de ciudad = Server Component, datos en servidor | ✅ Ya estaba |
| **Fase 2** | Sustituir `router.push` / botones por `<Link>` en header y hero | ✅ Hecho |
| **Fase 3** | Datos obtenidos en Server Component (no useEffect) | ✅ Ya estaba |
| **Fase 4** | `generateMetadata` con título/descripción en servidor | ✅ Ya estaba |
| **Extra** | Bloque de contenido pre-renderizado (Top 3 planes como `<a>`) | ✅ Añadido |

---

## 2. Comprobaciones realizadas

### 2.1 Sin Suspense ni "Loading..." en el HTML inicial

- **Búsqueda**: `Suspense` y `fallback.*Loading` en `src/app`.
- **Resultado**: No hay coincidencias. Ninguna página envuelve el contenido en Suspense con fallback "Loading...".
- **Conclusión**: El HTML que se envía ya no contiene solo "Loading..."; el contenido principal se incluye en la respuesta.

### 2.2 Página de ciudad (`app/[locale]/[city]/page.tsx`)

- **Server Component**: `export default async function CityPage(...)` — datos con `await getValentinesData(citySlug, lang)` en el servidor.
- **Sin Suspense**: `ValentinesLandingView` se renderiza directamente, no dentro de `<Suspense fallback={...}>`.
- **Contenido para crawlers**: Existe una `<section className="sr-only">` con los Top 3 planes como lista con `<a href={plan.link}>` (título, venue, precio). Ese HTML va en la respuesta aunque el crawler no ejecute JS.
- **H1 para SEO**: `<h1 className="sr-only">{cityName} - Valentine's Day 2026</h1>`.
- **Conclusión**: La estructura es correcta para que Googlebot reciba contenido y enlaces en el HTML.

### 2.3 Enlaces reales para crawlers

- **Header (selector de ciudad)**:
  - Cada ciudad del dropdown es un `<Link href={\`/${locale}/${city.slug}/\`}>`, que genera `<a href="/en/madrid/">` etc. en el HTML.
  - No se usa `router.push` para cambiar de ciudad.
- **Hero (buscador de ciudad en home)**:
  - Los resultados del dropdown son `<Link href={\`/${locale}/${city.slug}/\`}>`; mismo comportamiento que el header.
  - `router.push` solo se usa en el submit del formulario (Enter en el buscador); los crawlers no envían formularios, así que no afecta al descubrimiento de URLs.
- **CitySelector (home)**: Ya usaba `Link` con `href={\`/${locale}/${city.slug}/\`}`.
- **PlanCard**: Ya usaba `<a href={trackedLink}>` para los planes (enlaces externos).
- **Conclusión**: Las rutas de ciudades y planes se descubren mediante `<a href>` en el HTML.

### 2.4 ValentinesLandingView (componente cliente)

- Sigue siendo `'use client'` y recibe `data` como prop desde el Server Component.
- Con `output: 'export'`, en el build Next.js pre-renderiza las páginas; el árbol que incluye `ValentinesLandingView` se serializa con los datos ya inyectados.
- Al quitar Suspense, el fallback "Loading..." deja de ser el contenido inicial; el HTML pre-renderizado incluye el primer render de `ValentinesLandingView` con `data`.
- **Conclusión**: No hay dependencia de "solo cliente" para el contenido principal; el HTML inicial debe contener el contenido de la landing.

### 2.5 robots.txt y recursos estáticos

- `public/robots.txt`: `Allow: /_next/static/`, `Allow: /_next/image/`, `Sitemap: https://celebratevalentines.com/sitemap.xml`.
- `src/app/robots.ts`: Misma lógica; `disallow: /_next/` con `allow: /_next/static/` y `/_next/image/`.
- En robots, la regla más específica gana; `Allow: /_next/static/` es más específica que `Disallow: /_next/`, por lo que Googlebot puede cargar JS/CSS.
- **Conclusión**: No hay bloqueo que impida a Googlebot cargar los recursos necesarios para renderizar.

---

## 3. ¿Hemos resuelto el problema?

### Sí, en la medida que depende del código actual

1. **Pantalla en blanco / solo fondo gris**
   - **Causa que atacamos**: El Suspense hacía que el HTML inicial mostrara "Loading..." en lugar del contenido.
   - **Solución**: Suspense eliminado + contenido principal renderizado directamente + bloque `sr-only` con Top 3 planes como `<a>`. El HTML de respuesta incluye texto y enlaces aunque no se ejecute JS.
   - **Valoración**: El problema de "shell vacío" debería estar resuelto para crawlers que reciben este HTML.

2. **Screaming Frog / GSC solo veían 34 URLs**
   - **Causa**: Navegación por `router.push` y botones sin `<a href>`; los crawlers no ejecutan JS para "click" en botones.
   - **Solución**: Selector de ciudad en header y hero usa `<Link>`, por tanto `<a href="...">` en el HTML. El sitemap ya tenía todas las URLs; ahora además hay enlaces internos rastreables.
   - **Valoración**: Debería mejorar el descubrimiento de URLs (más enlaces internos + sitemap).

3. **Contenido solo con JavaScript**
   - **Causa**: Dependencia del primer render del cliente y/o del fallback de Suspense.
   - **Solución**: Datos en Server Component, sin Suspense, y bloque server-rendered con Top 3. Pre-render en build con datos inyectados.
   - **Valoración**: El contenido crítico (título, enlaces Top 3, estructura) está en el HTML; el resto se refuerza con el pre-render del cliente.

### Limitaciones y pasos siguientes

- **Re-indexación**: Google y Screaming Frog pueden tardar en re-crawlear. Conviene:
  - En GSC: "Inspección de URL" en una página de ciudad y "Solicitar indexación" si hace falta.
  - Comprobar que el HTML descargado (view-source o herramienta de GSC) contiene el `<section class="sr-only">` con los enlaces y el contenido de la landing.
- **Build y entorno**: Los cambios son correctos en código. Si en producción se sirve una build antigua o hay caché/CDN, habría que desplegar de nuevo y purgar caché para que los crawlers reciban el HTML nuevo.
- **Errores de build**: Los "Dynamic server usage: no-store fetch" durante el build vienen del fetch a Google Sheets en static export, no de estos cambios. Si el build falla o no genera todas las páginas, eso puede afectar a qué URLs existen; es un tema aparte del "blank screen" y los enlaces.

---

## 4. Resumen final

| Pregunta | Respuesta |
|----------|-----------|
| ¿El HTML inicial deja de mostrar solo "Loading..."? | **Sí** — Suspense eliminado y contenido principal + bloque Top 3 en el HTML. |
| ¿Googlebot puede ver texto y enlaces sin ejecutar JS? | **Sí** — H1, sección sr-only con Top 3 `<a>`, y pre-render del cliente con datos. |
| ¿Las URLs de ciudades son rastreables con `<a href>`? | **Sí** — Header y hero usan `<Link>`; CitySelector y PlanCard ya tenían enlaces. |
| ¿Los datos se cargan en el servidor? | **Sí** — `getValentinesData` en el Server Component; no hay useEffect para datos de página. |
| ¿La metadata (título, descripción) es server-side? | **Sí** — `generateMetadata` en página de ciudad y home. |
| ¿robots.txt bloquea JS/CSS necesarios? | **No** — Allow /_next/static/ tiene precedencia sobre Disallow /_next/. |

**Conclusión**: Con el código actual, el problema de pantalla en blanco y la falta de enlaces rastreables para crawlers está resuelto. Para confirmarlo en vivo hace falta desplegar, comprobar el HTML servido y, si quieres, usar de nuevo la Inspección de URL de GSC y un crawleo con Screaming Frog tras el despliegue.
