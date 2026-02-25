# Verificación de estabilidad (post-cambios legal/cookies)

**Fecha:** Febrero 2026  
**Objetivo:** Confirmar que los últimos cambios (cookie banner, GA4 consent, página legal cookies, Do Not Sell, footer) no han roto nada y que la web sigue estable, indexable, rastreable y conectada a GA4.

---

## 1. Build y rutas estáticas

- **Build:** `npm run build` con `DOCKER=true` / `STATIC_EXPORT=true` completa correctamente.
- **Páginas generadas:** 978 (incluidas 6 de `/ [locale]/legal/cookies/`).
- **Salida:** `out/` contiene `robots.txt`, `sitemap.xml`, `en/legal/cookies/index.html`, y el resto de rutas por locale/ciudad/categoría.
- **Conclusión:** Compilación estable; todas las rutas se pregeneran.

---

## 2. GA4

- **Layout raíz:** Usa `GAConsentGate` con `measurementId={GA_MEASUREMENT_ID}` (G-6G4HKV9NV7 por defecto).
- **GAConsentGate:** Solo renderiza los scripts de gtag cuando `getConsent() === 'accept'`. Si el usuario no ha aceptado, no se carga GA (cumplimiento). Si acepta, se cargan los scripts y se dispara el evento `cookieConsentUpdated`.
- **Conclusión:** La web sigue conectada a GA4; la carga depende del consentimiento y el flujo es correcto.

---

## 3. Indexación y crawlabilidad

| Comprobación | Estado |
|--------------|--------|
| **robots.txt** | Generado en `out/robots.txt`; Sitemap: https://celebratevalentines.com/sitemap.xml; sin disallow de contenido público. |
| **sitemap.xml** | Incluye locales, ciudades, categorías y **6 URLs** de `/[locale]/legal/cookies/`. |
| **Metadata robots (layout)** | `index: true`, `follow: true`; googleBot y bots de IA permitidos. |
| **Página legal cookies** | `robots: { index: true, follow: true }` en metadata. |
| **Ningún noindex en contenido** | No se ha añadido noindex en páginas públicas. |
| **Nginx** | `location /` y reglas con `try_files` sirven `/[locale]/legal/cookies/` como `.../legal/cookies/index.html`. |

**Conclusión:** Todo el contenido relevante (incluida la política de cookies) es indexable y accesible para crawlers.

---

## 4. Enlaces y navegación

- **Banner de cookies:** Enlace "Cookie Policy" → `/[locale]/legal/cookies/` (Link interno, locale correcto).
- **Footer – Cookie Policy:** Link a `/${lang}/legal/cookies/`.
- **Footer – Do Not Sell:** Link a `/${lang}/legal/cookies/#donotsell`.
- **Footer – Términos / Privacidad:** Siguen apuntando a Fever (`termsUrl`, `privacyUrl` por idioma).
- **Página legal cookies:** Enlaces a "Full Cookie Policy" (Google Doc) y "Privacy Policy" (Fever); "Back to home" → `/[locale]/`.
- **Conclusión:** Sin enlaces rotos; rutas internas y externas coherentes.

---

## 5. Consentimiento y cookie

- **Cookie `cookie_consent`:** Se escribe con `path=/`, `max-age=1 año`, `SameSite=Lax`; en HTTPS se añade `Secure`.
- **Evento `cookieConsentUpdated`:** GAConsentGate lo escucha y vuelve a leer consentimiento para cargar GA al aceptar.
- **Conclusión:** Flujo de consentimiento y cookie estable y alineado con GA4.

---

## 6. Resumen

- **Estabilidad:** Build correcto; 978 páginas estáticas generadas; sin errores de compilación en los archivos tocados.
- **GA4:** Conectado vía GAConsentGate; solo se carga tras aceptar cookies.
- **Indexable:** robots.txt, sitemap.xml, metadata y rutas legales permiten indexación.
- **Crawleable:** Rutas servidas por nginx con `try_files`; contenido público accesible.
- **Cambios recientes:** Banner, página legal cookies, Do Not Sell, footer y cookie Secure no han introducido regresiones detectadas en build ni en la lógica revisada.

**Recomendación:** Tras el próximo deploy, comprobar en producción:  
`/robots.txt`, `/sitemap.xml`, `/[locale]/legal/cookies/` (p. ej. `/en/legal/cookies/`) y que al aceptar cookies en el banner se carguen las peticiones a `googletagmanager.com` en la pestaña Red del navegador.
