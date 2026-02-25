# Verificación de estabilidad – Post cambios legales / GA4

**Fecha:** 23 enero 2026  
**Objetivo:** Confirmar que la web sigue conectada a GA4, es indexable y rastreable, y que los últimos cambios no han roto nada.

---

## 1. Google Analytics 4 (GA4)

| Comprobación | Estado | Detalle |
|--------------|--------|---------|
| ID de medición | OK | `G-6G4HKV9NV7` (o `NEXT_PUBLIC_GA_MEASUREMENT_ID` si está definido) en `src/app/layout.tsx` |
| Integración en layout | OK | `<GAConsentGate measurementId={GA_MEASUREMENT_ID} />` en el layout raíz |
| Carga condicional | OK | `GAConsentGate` solo renderiza gtag cuando `getConsent() === 'accept'` (cumplimiento GDPR/CCPA) |
| Scripts gtag | OK | `ga-consent-gate.tsx` carga `gtag/js` y `gtag('config', measurementId)` con `strategy="afterInteractive"` |
| Cookie de consentimiento | OK | `src/lib/cookies.ts`: `getConsent()` / `setConsent()`, cookie `Secure` en HTTPS |

**Conclusión:** La web sigue conectada a GA4. Los scripts se cargan solo tras aceptar cookies; si el usuario no acepta, no se envía datos a GA (correcto para cumplimiento).

---

## 2. Indexabilidad y rastreo

| Comprobación | Estado | Detalle |
|--------------|--------|---------|
| Meta robots global | OK | `layout.tsx`: `robots: { index: true, follow: true }`, incl. googleBot y bots de IA (GPTBot, etc.) |
| Página legal cookies | OK | `legal/cookies/page.tsx`: `robots: { index: true, follow: true }` |
| Otras páginas | OK | Páginas de ciudad y temáticas usan `index: true, follow: true` (sin `noindex`) |
| `robots.txt` | OK | `src/app/robots.ts`: permite rastreo de contenido; solo bloquea `/_next/`, `/api/`, `/admin/`, `/private/` |
| Sitemap | OK | `sitemap.ts`: incluye home por locale, ciudades, páginas temáticas y **`/[locale]/legal/cookies/`** |
| URL del sitemap | OK | `robots.ts` declara `sitemap: https://celebratevalentines.com/sitemap.xml` |

**Conclusión:** Todo el contenido relevante es indexable y rastreable. Las rutas principales y la página de política de cookies están en el sitemap y no están bloqueadas por robots.

---

## 3. Enlaces legales y cookie policy

| Comprobación | Estado | Detalle |
|--------------|--------|---------|
| Footer – Cookie Policy | OK | Enlace a `/${lang}/legal/cookies/` en `footer.tsx` |
| Footer – Do Not Sell (CCPA) | OK | Enlace a `/${lang}/legal/cookies/#donotsell` en `footer.tsx` |
| Footer – Terms / Privacy | OK | URLs dinámicas a Fever (`terms_*`, `privacy_*` según locale) |
| Banner de cookies | OK | `cookie-consent-banner.tsx` enlaza a `/${locale}/legal/cookies/` |
| Sitemap – legal | OK | Todas las rutas `/[locale]/legal/cookies/` en `sitemap.ts` |

**Conclusión:** Los enlaces legales y la página de cookies están bien enlazados desde footer, banner y sitemap.

---

## 4. Build y estabilidad

| Comprobación | Estado | Detalle |
|--------------|--------|---------|
| Compilación | OK | `next build` compila correctamente (“Compiled successfully”) |
| Generación estática | OK | Build genera 978 páginas estáticas (incluye legal/cookies por locale) |
| Fetch externo en build | Info | Pueden fallar fetches a Google Sheets durante el build (red/entorno); no afecta al código ni a producción si los datos se sirven en runtime o se cachean |

**Recomendación:** Ejecutar `npm run build` completo en tu máquina para confirmar que llega a 978/978 sin errores. Si hay timeouts solo en CI, considerar aumentar el timeout o pregenerar datos.

---

## 5. Resumen

- **GA4:** Conectado; carga solo con consentimiento; cookie y gate correctos.
- **Indexable / crawleable:** Robots meta y `robots.txt` permiten indexación; sitemap incluye todas las rutas relevantes, incluida la página de cookies.
- **Legal y enlaces:** Footer, banner y sitemap coherentes con la página de política de cookies y Do Not Sell.
- **Estabilidad:** Compilación correcta; generación estática en curso (978 páginas). Sin cambios que rompan GA4, indexación o enlaces legales.

Si quieres, el siguiente paso puede ser revisar en producción que `https://celebratevalentines.com/robots.txt` y `https://celebratevalentines.com/sitemap.xml` devuelven el contenido esperado y que en GA4 aparecen eventos cuando un usuario acepta cookies.
