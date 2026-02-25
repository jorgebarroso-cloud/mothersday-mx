# Auditoría detallada del sitio — Mother's Day UK (estático)

**Fecha:** 11 febrero 2026  
**Objetivo:** Comprobar que todo funciona, que no hay fallos y que el sitio es indexable, rastreable y crawlable para tráfico orgánico.

---

## 1. Build y assets

| Comprobación | Estado |
|--------------|--------|
| `build-static.ps1` termina sin error | OK |
| CSS: variables, fonts, glide, styles, animations → bundle.css → bundle.min.css | OK |
| JS: main.js → main.min.js (o copia si no hay terser) | OK |
| Generador: 40 páginas + sitemap.xml | OK |
| Imágenes referenciadas existen (hero-uk.png, london.png … 8 ciudades) | OK |
| Rutas en home: `css/`, `js/`, `images/` (relativas a raíz) | OK |
| Rutas en legal: `../css/`, `../js/`, `../images/` | OK |
| Rutas en city index: `../css/`, `../images/{slug}.png` | OK |
| Rutas en subpáginas (ideas/experiences/…): `../../css/`, `../../images/` | OK |
| Glide.js: stub presente (no rompe si no se descarga el CDN) | OK |

**Conclusión:** Build y assets correctos. No hay referencias rotas.

---

## 2. HTML: estructura y semántica

| Comprobación | Estado |
|--------------|--------|
| Doctype HTML5, `lang="en-GB"`, charset UTF-8, viewport | OK |
| Un único `<h1>` por página (home: "Mother's Day UK"; city: "Mother's Day in {City}") | OK |
| `<main id="main-content">`, `<header role="banner">`, `<footer role="contentinfo">` | OK |
| Secciones con `aria-labelledby` donde aplica | OK |
| Skip link "Skip to main content" → `#main-content` | OK |
| City search: `<label for="city-search">` asociado al input | OK |
| Top bar con `role="complementary"` y `aria-label` | OK |

**Conclusión:** Estructura y semántica correctas.

---

## 3. Enlaces

| Comprobación | Estado |
|--------------|--------|
| Enlaces externos (Fever): `target="_blank"` + `rel="noopener noreferrer"` | OK (todos) |
| Home → 8 ciudades (grid estático) | OK |
| Home → legal/cookies.html | OK |
| City index → ideas, experiences, events, candlelight (rutas absolutas /city/xxx/) | OK |
| City pages → Home (/), otras ciudades (/manchester/, etc.), legal | OK |
| Breadcrumb en city: UK → Ciudad; en subpágina: UK → Ciudad → Subpágina | OK |
| 404: enlace "Back to home" (/) y "Pick your city" (/#city-selector) | OK |

**Conclusión:** Enlaces internos y externos correctos y seguros.

---

## 4. SEO: indexabilidad y crawlability

| Comprobación | Estado |
|--------------|--------|
| robots.txt: `Allow: /`, `Disallow: /data/`, `Disallow: /scripts/`, `Sitemap:` | OK |
| Sitemap: 42 URLs, sin duplicados, dominio correcto | OK |
| Todas las URLs del sitemap existen como archivos (index.html o carpeta/index.html) | OK |
| Páginas de contenido: canonical, title, meta description presentes | OK |
| No hay `noindex` en páginas indexables | OK |
| Solo 404.html tiene `meta name="robots" content="noindex, follow"` | OK |
| Títulos únicos entre city y subpáginas | OK (script verify-seo-static) |
| Home enlaza a las 8 ciudades; city page enlaza a 4 subpáginas | OK |
| JSON-LD en home (WebSite, Organization, FAQPage) | OK |
| JSON-LD en city pages (BreadcrumbList, LocalBusiness, CollectionPage, ItemList) | OK |

**Script ejecutado:** `node scripts/verify-seo-static.js` → **All checks passed. Site is indexable and crawlable.**

**Conclusión:** El sitio está preparado para ser indexado y rastreado; contenido clave y enlaces en HTML estático.

---

## 5. JavaScript (main.js)

| Comprobación | Estado |
|--------------|--------|
| IIFE, 'use strict', sin variables globales expuestas | OK |
| initCountdownBar: solo actúa si existe `#countdown-days` (solo en home) | OK |
| initCitySearch: solo actúa si existen `#city-search` y `#city-search-results` (solo en home) | OK |
| CITIES: 8 ciudades (slug + name) alineadas con el grid | OK |
| City search: resultados con `href="/{slug}/"`; Escape y clic fuera cierran | OK |
| Escape de HTML en nombres mostrados en resultados del buscador (evita XSS) | OK (añadido) |
| Cookie banner, GA4 condicional, Glide con comprobación de `window.Glide` | OK |
| initNavigation: rel en enlaces externos del header | OK |
| Sin errores de linter | OK |

**Conclusión:** JS estable; no rompe en city pages (sin countdown/search); búsqueda y countdown solo en home.

---

## 6. Generador (generate-city-pages.js)

| Comprobación | Estado |
|--------------|--------|
| getEasterSunday(year): algoritmo Pascua gregoriana | OK |
| getMothersDayUK(year): 2 semanas antes de Pascua (Mothering Sunday) | OK |
| getDaysUntilMothersDayUK(): días hasta el próximo Mother's Day UK | OK |
| Barra countdown en layout: "Hurry! Mother's Day is in {days} days. Book now in {cityName}." | OK |
| countdownDays pasado en cityMainPage y citySubPage | OK |
| escapeHtml() para atributos y contenido HTML | OK |
| escapeJson() para cadenas en JSON-LD (\, ", \n) | OK |
| BreadcrumbList, LocalBusiness, CollectionPage, ItemList con datos escapados | OK |
| Enlaces externos con escapeHtml y rel="noopener noreferrer" | OK |

**Conclusión:** Generador consistente y seguro; fechas UK correctas; JSON-LD y HTML bien escapados.

---

## 7. Accesibilidad y buenas prácticas

| Comprobación | Estado |
|--------------|--------|
| Skip link visible al focus | OK (estilos .skip-link) |
| Imágenes decorativas: alt="" | OK |
| Imágenes de contenido: alt descriptivo | OK |
| Input de búsqueda: label, aria-label, aria-controls, aria-expanded | OK |
| Listbox de resultados: role="listbox", aria-label="Cities", ítems role="option" | OK |
| Botones del cookie banner: type="button" | OK |
| Enlaces de ciudad con aria-label o texto/title descriptivo | OK |

**Conclusión:** Buenas prácticas y accesibilidad básica cubiertas.

---

## 8. Resumen final

- **Funcionamiento:** Build correcto; no se detectan rutas rotas ni errores de JS que impidan el uso del sitio.
- **Estabilidad:** Uso de escapes (HTML/JSON) y comprobaciones de elemento antes de usar el DOM; enlaces externos con rel seguro.
- **Indexabilidad / rastreo:** robots.txt, sitemap, canonicals, meta, sin noindex en contenido; datos estructurados y enlaces en HTML estático adecuados para tráfico orgánico.

**Cambio realizado durante la auditoría:** En `js/main.js`, escape de HTML para los nombres de ciudad mostrados en los resultados del buscador (buena práctica frente a XSS si en el futuro los nombres fueran dinámicos).

---

*Auditoría ejecutada con comprobaciones automáticas (build, verify-seo-static.js) y revisión manual de HTML, JS, generador y rutas.*
