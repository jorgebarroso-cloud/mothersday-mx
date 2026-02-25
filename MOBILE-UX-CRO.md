# UX móvil y CRO — Resumen de cambios

## Objetivo
Mejorar la experiencia en móvil (UX/UI) y la conversión (CRO) reduciendo ruido visual y priorizando un CTA principal.

---

## UX móvil aplicada

### Base y tipografía (≤767px)
- **Variables:** `--container-gutter-mobile`, `--text-body-mobile`, `--section-padding-y-mobile`, `--color-bg-soft` (hover city search).
- **Body:** font-size 1rem, line-height 1.6.
- **Container:** padding con safe-area (left/right) en 767px; en 480px gutter ligeramente menor.
- **Secciones:** intro, why-block, idea-card desc con line-height 1.6; títulos con clamp y márgenes coherentes.

### Header y top bar (≤639px)
- **Header:** Logo + "Home" en una sola línea (`white-space: nowrap`, fuente 0.875rem). "Pick your city" oculto en header (solo top bar + hero CTA).
- **Top bar:** Solo cuenta atrás ("Hurry! Mother's Day is in X days."); sin enlace "Book now — pick your city". Texto centrado, compacto.

### Hero
- Contenido, subtítulo y CTA con más espacio; CTA min-height 48px.

### City selector
- Búsqueda type-ahead: input y resultados con min-height 48px; lista con max-height y scroll táctil.
- City grid: gap reducido en ≤639px para no apretar.

### Feature cards, trust, pick cards, idea cards
- Touch targets 44–48px; padding y tap highlight donde aplica; títulos y texto legibles (1rem, line-clamp 2 en picks).

### Gift cards (scroll horizontal)
- En móvil: `.gift-card` con `width: min(260px, 78vw)`; enlace sin tap highlight molesto; "See all" con min-height 44px.

### Sticky CTA
- Padding con safe-area (left, right, bottom); botón con tap highlight desactivado.
- Footer con padding-bottom extra en móvil para no quedar tapado.

### Legal y subpáginas
- `.section--legal`: padding y tipografía móvil; `.link--back` con min-height 44px.
- `.section--subpage-actions`: padding ajustado en móvil.
- **Breadcrumb** y **skip-link:** touch targets 44–48px; skip-link con `padding-left: max(..., env(safe-area-inset-left))` en móvil.

### Cookie banner (≤639px)
- Columna, texto centrado; botones full-width, min-height 48px, tap highlight desactivado; safe-area bottom.

---

## CRO móvil (≤767px)

- **Home:** "Pick your city" oculto en header; `.section__cta-wrap` (botón tras features) oculto. Top bar solo countdown.
- **City/subpáginas:** Ocultos el párrafo con botón "See all on Fever" en `.section--cta-fever` y los `p:has(.cta-button)` en `.section--picks` y `.section--empty-state`.
- Un **CTA principal** (hero) + **sticky CTA**; sin duplicados arriba.

---

## Revisión completa (UX/UI/CRO móvil) — comprobado

- **Home:** Top bar (solo countdown), header (logo + Home en una línea), hero (CTA 48px), features (gap, CTA wrap oculto), trust, city search (48px input/items), city grid (gap), sticky CTA, footer (padding-bottom por sticky).
- **City pages:** Mismo header compacto; hero city; picks (CTAs duplicados ocultos); gift cards (scroll, 78vw); sticky CTA Fever; breadcrumb.
- **Subpáginas (ideas/experiences/events/candlelight):** Hero subpage (48px CTA), link--back 44px, section--subpage-actions.
- **Legal:** section--legal móvil, link--back.
- **Accesibilidad:** Skip-link (safe-area left), focus visible, aria en top bar/header/nav.
- **Safe-area:** Container, sticky CTA, footer, cookie banner, skip-link.

---

## Pendiente opcional (refinamiento)

- Prueba en dispositivos reales (iOS/Android) para safe-area y gestos.

---

## Archivos tocados

- `css/variables.css` — Variables móvil.
- `css/styles.css` — Media queries móvil y reglas CRO (header, top-bar, hero, sections, city-search, city-card, pick-card, idea-card, why-block, gift-card, sticky-cta, section--legal, section--subpage-actions, footer, skip-link, breadcrumb).
- `index.html` — Estructura del city selector y top bar.

Build: `.\scripts\build-static.ps1`. SEO: `node scripts/verify-seo-static.js`.
