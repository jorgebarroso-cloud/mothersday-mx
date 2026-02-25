# Checklist pre-publicación — Celebrate Mother's Day UK

**Fecha revisión:** Febrero 2026  
**Dominio:** https://celebratemothersday.co.uk

---

## 1. Build y generación

| Comprobación | Estado |
|--------------|--------|
| `.\scripts\build-static.ps1` ejecuta sin errores | OK |
| 40 páginas generadas (home, legal, 8 ciudades × 5 páginas) | OK |
| `sitemap.xml` generado con 42 URLs | OK |
| CSS: `css/bundle.min.css` (variables → fonts → glide → styles → animations) | OK |
| JS: `js/main.min.js` (countdown, city search, cookie banner, header scroll, Glide) | OK |

---

## 2. SEO e indexación

| Comprobación | Estado |
|--------------|--------|
| `node scripts/verify-seo-static.js` — All checks passed | OK |
| `robots.txt`: Allow /, Disallow /data/ y /scripts/, Sitemap presente | OK |
| Sitemap: sin duplicados, todas las URLs apuntan a archivos existentes | OK |
| Canonical en home, city pages, legal, subpáginas | OK |
| Títulos únicos por ciudad/subpágina | OK |
| `404.html` con `noindex, follow` | OK |
| Home: JSON-LD (WebSite, Organization, FAQPage) | OK |
| Enlaces internos: home → 8 ciudades; ciudad → ideas/experiences/events/candlelight | OK |

---

## 3. HTML y contenido

| Comprobación | Estado |
|--------------|--------|
| Viewport, charset UTF-8, lang="en-GB" en todas las páginas | OK |
| Skip-link "Skip to main content" presente (home, city, legal, 404) | OK |
| Meta description y title en todas las páginas | OK |
| Enlaces externos (Fever, etc.) con `target="_blank"` y `rel="noopener noreferrer"` | OK |
| Footer: enlace a Cookie Policy (`/legal/cookies.html`) en todas las páginas | OK |
| Cookie banner: enlace a Cookie Policy; botones Accept/Reject | OK |
| Botones ciudad home: literales unificados "Book [City]" (incl. London) | OK |

---

## 4. Assets y rutas

| Comprobación | Estado |
|--------------|--------|
| `images/`: hero-uk.png, london.png … edinburgh.png, favicon.ico, favicon.svg | OK |
| `css/bundle.min.css` y `css/bundle.css` | OK |
| `js/main.min.js`, `js/main.js`, `js/glide.min.js` | OK |
| Legal y city pages: rutas relativas correctas (../css, ../images, ../js) | OK |

---

## 5. UX móvil y CRO

| Comprobación | Estado |
|--------------|--------|
| Top bar: solo countdown en móvil; sin CTA duplicado | OK |
| Header móvil: logo + Home en una línea; "Pick your city" oculto en header | OK |
| Hero: CTA 48px min-height; sticky CTA con safe-area | OK |
| City search: input y resultados 48px; type-ahead funcional | OK |
| Trust module: estilo mini-cards en móvil | OK |
| CRO: section__cta-wrap oculto en home móvil; section--cta-fever / section--picks sin CTAs duplicados en city pages | OK |
| Variables móvil: --container-gutter-mobile, --text-body-mobile, safe-area en container/sticky/footer/cookie | OK |

---

## 6. JavaScript

| Comprobación | Estado |
|--------------|--------|
| Countdown: Mother's Day UK (Mothering Sunday) calculado correctamente; #countdown-days en home | OK |
| City search: CITIES list, filtro, escape HTML en resultados, Escape/click outside cierra | OK |
| Cookie consent: banner visible si no hay cookie; Accept carga GA4; Reject no; cookie 1 año | OK |
| Header scroll: clase .is-scrolled al hacer scroll | OK |
| Glide: solo inicializa si existe .glide en la página | OK |

---

## 7. Legal y privacidad

| Comprobación | Estado |
|--------------|--------|
| Página Cookie Policy en `/legal/cookies.html` con canonical | OK |
| Texto UK (cookies, not biscuits); CCPA "Do Not Sell"; enlace a Privacy Fever | OK |
| GA4 solo tras Accept (G-L9EXZB0W73) | OK |

---

## 8. Seguridad y buenas prácticas

| Comprobación | Estado |
|--------------|--------|
| Enlaces externos: rel="noopener noreferrer" | OK |
| Sin inline scripts inseguros; JSON-LD estático en head | OK |
| Cookie SameSite=Lax; Secure en HTTPS | OK |

---

## Resumen

- **Build:** OK  
- **SEO:** OK (verify-seo-static.js passed)  
- **HTML/Enlaces/Legal:** OK  
- **Assets:** OK  
- **Móvil/UX/CRO:** OK  
- **JS (countdown, search, cookies, header):** OK  
- **Legal (cookies, GA4 condicional):** OK  

**Conclusión:** El sitio está **listo para publicar**. Antes de ir a producción conviene:

1. Probar en un entorno de staging con el dominio real (o localmente con rutas absolutas si aplica).
2. Comprobar que el servidor sirve `index.html` para rutas sin extensión (ej. `/london/` → `london/index.html`) y que `404.html` se usa para rutas no encontradas.
3. Verificar SSL (HTTPS) y que las cookies se marquen Secure en producción.
4. (Opcional) Validar HTML con validator.w3.org y Lighthouse (performance, accesibilidad) una vez desplegado.
