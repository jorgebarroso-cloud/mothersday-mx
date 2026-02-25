# Revisión completa Home — UX, UI y SEO

**Fecha:** Febrero 2026  
**Ámbito:** index.html (home) — listo para pasar a city pages.

---

## 1. SEO

### ✅ Implementado y correcto
- **Título:** "Mother's Day UK 2026 — Best Ideas, Experiences & Gifts" (< 60 caracteres).
- **Meta description:** Clara, con ciudades y CTA (~155 caracteres).
- **Canonical:** https://celebratemothersday.co.uk/
- **Open Graph y Twitter Cards:** type, title, description, image, url, locale, site_name.
- **JSON-LD:** WebSite (nombre, url, descripción, inLanguage, publisher, potentialAction SearchAction) y FAQPage (5 preguntas alineadas con el contenido).
- **H1 único:** "Mother's Day UK" en hero.
- **Jerarquía de headings:** H1 → H2 (section__title en cada sección) → H3 (section__local-title, feature-card__title).
- **Imágenes:** alt descriptivos, width/height, loading lazy (hero con loading=eager, fetchpriority=high).
- **Internal links:** Enlaces a london/, manchester/, birmingham/ en city cards, footer y bloque SEO.
- **Palabras clave:** mothers day uk, ideas, experiences, gifts, London, Manchester, Birmingham en títulos, intro y bloque SEO.

### 🔧 Mejoras aplicadas en esta revisión
- Enlace "pick your city" en el bloque SEO que apunta a `#city-selector`.
- Enlace "pick your city above" en section__local a `#city-selector`.
- Enlaces a city pages en el segundo párrafo del bloque SEO (London, Manchester, Birmingham).

### Recomendaciones para city pages
- Canonical absoluto por página.
- Meta description única por ciudad (y por subpágina si aplica).
- Un H1 por página (ej. "Mother's Day London").
- Breadcrumb en HTML y, si se quiere, BreadcrumbList en JSON-LD.

---

## 2. UX

### ✅ Implementado y correcto
- **Flujo:** Hero → Features → Trust → City selector → Testimonials → FAQ → SEO. Orden lógico y progresivo.
- **CTAs "Pick your city":** Todos apuntan a `#city-selector` (top bar, header, hero, features, sticky CTA).
- **Scroll:** smooth scroll y `scroll-margin-top` en la sección city selector para que no quede bajo el header sticky.
- **City selector:** Tres tarjetas iguales, visibles en una ventana en desktop; grid escalable (auto-fill) para más ciudades.
- **Sticky CTA:** Solo en móvil (max-width 767px); footer con padding-bottom extra para que no tape contenido.
- **Enlaces contextuales:** "pick your city" en texto del bloque SEO y en section__local llevan al city selector.

### 🔧 Mejoras aplicadas en esta revisión
- **Skip link:** "Skip to main content" al inicio del body; visible solo al focus (teclado / lectores de pantalla).
- **Role del top bar:** De `role="banner"` a `role="complementary"` para evitar dos banners (solo el header es banner).
- **aria-label en city cards:** Cada enlace de ciudad tiene aria-label descriptivo ("See Mother's Day ideas and experiences in [City]").

### Detalle opcional
- London: "Send Love to London" vs Manchester/Birmingham: "Book Manchester" / "Book Birmingham". Diferencia intencional de copy; si se prefiere homogeneizar, se puede unificar a "See [City]" o "Book [City]".

---

## 3. UI

### ✅ Implementado y correcto
- **Sistema de diseño:** variables.css (Spring in London), tipografía Playfair + Lato, paleta coherente.
- **Contraste:** Texto y fondos dentro de rango WCAG; botones verde sobre blanco con suficiente contraste.
- **Touch targets:** CTAs min-height 48px (44px en cards); enlaces de navegación con padding y min-height 44px.
- **Focus visible:** outline en `:focus-visible` para enlaces y botones.
- **Componentes:** Top bar, header sticky con blur, hero con overlay, cards con hover (translateY, sombra), FAQ con `<details>`, footer con marca y columnas.
- **Responsive:** Grids y secciones con breakpoints 640px, 900px, 1024px; city grid en 3 columnas desde 900px.

### Sin cambios necesarios en esta revisión
- Estilos ya cubren accesibilidad y consistencia visual.

---

## 4. Accesibilidad (A11y)

### ✅ Implementado y correcto
- **Semántica:** `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<blockquote>`, `<cite>`.
- **ARIA:** aria-labelledby en secciones, aria-label en navegación, CTAs y top bar; aria-hidden en decorativos; aria-label en estrellas de testimonios.
- **Headings visibles/ocultos:** trust-heading con clase visually-hidden (solo para lectores de pantalla).
- **FAQ:** `<details>`/`<summary>` nativo, accesible por teclado.

### 🔧 Mejoras aplicadas
- Skip link para saltar al contenido principal.
- Un solo `role="banner"` (header); top bar como complementary.
- aria-label en los enlaces de las city cards.

---

## 5. Resumen de archivos tocados en esta revisión

| Archivo      | Cambios |
|-------------|---------|
| index.html  | Skip link, top-bar role, enlaces #city-selector en SEO y section__local, enlaces a city pages en SEO, aria-label en city-card__link |
| css/styles.css | Estilos .skip-link (visible solo al focus) |

---

## 6. Próximos pasos: City pages

- Revisar london/, manchester/, birmingham/ (y subpáginas: ideas, experiences, events, candlelight).
- Asegurar mismo nivel de UX/UI/SEO: canonical, meta, H1, enlaces internos, breadcrumb, CTA "Pick your city" a `/#city-selector` donde aplique.
- Revisar consistencia de cabecera/footer y sticky CTA en city pages.
