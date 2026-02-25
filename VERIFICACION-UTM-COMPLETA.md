# Verificación UTM en todos los planes – Resumen

**Fecha:** Verificación post-implementación UTM  
**Objetivo:** Confirmar que los cambios de UTM no han roto nada y que todo el sitio sigue funcionando.

---

## 1. Build y linter

| Comprobación | Estado |
|--------------|--------|
| Compilación Next.js | OK – "Compiled successfully" |
| Generación estática | OK – 978/978 páginas generadas |
| Linter (utm, page, structured-data, category-page-view, valentines-landing-view) | OK – Sin errores |

---

## 2. Dónde se aplican los UTM (resumen)

| Ubicación | Cómo se aplica | Estado |
|-----------|----------------|--------|
| **Página de ciudad** (`/[locale]/[city]/`) | `buildPlanUtmUrl` en sr-only y noscript; `getTrackedLink` en `ValentinesLandingView` → PlanCard/PlanCarousel | OK |
| **Gifts** (`/[locale]/[city]/gifts/`) | `CategoryPageView` → `getTrackedLink` → PlanCard (sin guard SSR) | OK |
| **Restaurants** (`/restaurants/`) | Igual que gifts | OK |
| **Ideas** (`/valentines-day/ideas/`) | Igual que gifts | OK |
| **Last-minute** (`/valentines-day/last-minute/`) | Igual que gifts | OK |
| **Structured data** (JSON-LD en categorías) | `planUrl = buildPlanUtmUrl(plan.link, plan.id, citySlug)` cuando hay citySlug | OK |

---

## 3. Comportamiento que no se ha roto

- **Enlaces vacíos/inválidos:** `buildPlanUtmUrl` devuelve el link original o `#` si el link está vacío (no lanza).
- **Ciudades sin código UTM:** `getCityCode` devuelve `'gen'` (utm_campaign = `{planId}_gen`).
- **Plan sin ID:** Se intenta extraer del link (`/m/549909`); si no hay, se devuelve el link sin UTM.
- **Páginas sin planes:** Si `data.top3` está vacío, no se renderizan enlaces; no hay llamadas a `buildPlanUtmUrl` con datos incompletos.
- **Redirect raíz:** Sigue igual (localhost → `/en/`, producción → dominio canónico).
- **Cookies / GA4 / footer / sitemap / legal:** No se han tocado; comportamiento intacto.

---

## 4. Formato UTM aplicado

- **utm_source:** `google` (por defecto).
- **utm_medium:** `organiclanding`.
- **utm_content:** `valentines`.
- **utm_campaign:** `{planId}_{cityCode}` (ej. `549909_muc`).

Si el usuario llega con UTMs en la URL (o en localStorage), `utm_source`, `utm_medium` y `utm_content` se sobrescriben; `utm_campaign` siempre es `{planId}_{cityCode}`.

---

## Conclusión

El build completa correctamente, no hay errores de linter en los archivos modificados y el flujo de UTM está aplicado de forma coherente en página de ciudad, gifts, restaurants, ideas, last-minute y structured data. No se han detectado roturas en el resto del sitio.
