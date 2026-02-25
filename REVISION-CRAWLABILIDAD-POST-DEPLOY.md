# Revisión de crawlabilidad e indexación (post-deploy)

**Fecha:** Enero 2026  
**Contexto:** Tras correcciones de deploy (Docker, baseUrl, CRLF) y conexión a GA4. Revisión completa para asegurar que el sitio sigue siendo rastreable y indexable.

---

## 1. Resumen de cambios y problemas recientes

| Tema | Qué pasó | Estado |
|------|----------|--------|
| **Deploy Cloud Build** | Fallo en paso Docker (exit 1). | ✅ Corregido: `node:20-slim`, deps nativas, CRLF en entrypoint, `GENERATE_SOURCEMAP=false`. |
| **Build Next.js (SSG)** | `ReferenceError: baseUrl is not defined` en generación estática (972 páginas). | ✅ Corregido: `baseUrl` definida en `generateCategoryPageStructuredData` (structured-data.tsx). |
| **GA4** | Conexión del site a Google Analytics 4. | ✅ Implementado en `layout.tsx`: gtag, ID `G-6G4HKV9NV7`, strategy `afterInteractive`. |
| **Hreflang (en)** | URLs en inglés apuntaban a `/madrid/` en lugar de `/en/madrid/`. | ✅ Corregido en `hreflang-links.tsx`: todas las locales usan prefijo (`/en/`, `/es/`, etc.). |

---

## 2. Indexación y robots

- **robots.ts**  
  - Genera `robots.txt` en build (static export).  
  - Reglas: `User-agent: *` permite `/_next/static/`, `/_next/image/`, `/api/public/`; disallow `/_next/`, `/api/`, `/admin/`, `/private/`.  
  - Bots de IA (GPTBot, Google-Extended, CCBot, ClaudeBot, etc.) con mismas reglas.  
  - `sitemap: https://celebratevalentines.com/sitemap.xml`.  
  - **Conclusión:** Correcto para sitio estático; no se bloquea contenido público.

- **Metadata robots (layout y páginas)**  
  - Layout raíz: `index: true`, `follow: true`; googleBot y bots de IA con index/follow.  
  - No hay `noindex` en páginas de contenido.  
  - **Conclusión:** Todo el contenido está marcado como indexable.

---

## 3. Sitemap y rutas estáticas

- **sitemap.ts**  
  - Base: `https://celebratevalentines.com`.  
  - Incluye: locales (home), ciudades por locale, categorías (`gifts`, `restaurants`, `valentines-day/ideas`, `valentines-day/last-minute`) con trailing slash.  
  - Prioridades y `changeFrequency` coherentes con sitio estacional.  
  - **Conclusión:** Sitemap alineado con la estructura de rutas del app.

- **Rutas y static export**  
  - `generateStaticParams` en: `[locale]/page`, `[locale]/[city]/page`, gifts, restaurants, ideas, last-minute.  
  - `next.config.js`: con `DOCKER`/`STATIC_EXPORT` → `output: 'export'`, `trailingSlash: true`, `basePath: ''`.  
  - **Conclusión:** Todas las rutas públicas se pregeneran; el build genera `out/` con HTML por ruta.

---

## 4. Producción (nginx) y redirects

- **Redirect raíz**  
  - `location = /` y `location = /index.html` → 301 a `https://celebratevalentines.com/en/`.  
  - **Conclusión:** Raíz no sirve HTML; redirección canónica a `/en/`.

- **Canónicos de ciudad**  
  - Redirects 301: `/locale/münchen/...` → `.../munchen/...`, `montréal` → `montreal`, `lisboa` → `lisbon`.  
  - **Conclusión:** Slugs con caracteres especiales se normalizan a versión ASCII.

- **Rutas y 404**  
  - `try_files` para locale, ciudad, categorías y `index.html`; `error_page 404 /404.html`.  
  - **Conclusión:** Rutas pregeneradas se sirven bien; 404 controlado.

- **robots.txt y sitemap.xml en producción**  
  - Next.js genera `out/robots.txt` y `out/sitemap.xml` en el build.  
  - Nginx sirve todo desde `root /usr/share/nginx/html` (copia de `out/`); `try_files $uri ...` sirve ambos archivos.  
  - **Conclusión:** Crawlers pueden acceder a `/robots.txt` y `/sitemap.xml`.

---

## 5. Structured data y hreflang

- **Structured data (JSON-LD)**  
  - `structured-data.tsx`: `baseUrl` definida en componente principal y en `generateCategoryPageStructuredData` (corregido para SSG).  
  - Tipos: home, city, categorías (gifts, restaurants, ideas, last-minute); breadcrumbs y organización.  
  - **Conclusión:** Sin errores de `baseUrl` en build; datos estructurados correctos.

- **Hreflang**  
  - `hreflang-links.tsx`: corregido para que la versión en inglés use siempre prefijo `/en/` (p. ej. `/en/madrid/`) y `x-default` apunte a la URL en inglés.  
  - `hreflang-links-script.tsx`: ya usaba `/${loc}${basePath}` para todas las locales; coherente con la corrección anterior.  
  - **Conclusión:** Alternativas por idioma y x-default correctas.

- **Canonicals**  
  - Páginas revisadas (home, city) usan `alternates.canonical` con URL absoluta HTTPS y trailing slash.  
  - **Conclusión:** Canonicals correctos.

---

## 6. Dockerfile y build (impacto en crawlabilidad)

- **Contenido servido**  
  - Se copia `out/` completo a nginx; no se excluyen HTML, JS, CSS ni rutas.  
  - `.dockerignore` excluye `node_modules`, `.next`, `out`, `.git`, etc.; no excluye `public/` ni `src/` (el build genera `out/` desde el código).  
  - **Conclusión:** El deploy no elimina ni bloquea rutas necesarias para crawlers.

- **Assets**  
  - Con `output: 'export'` y `trailingSlash: true`, Next genera `out/_next/static/...` y páginas con `index.html`.  
  - Nginx sirve estáticos con cache largo y `try_files` adecuado.  
  - **Conclusión:** Assets y rutas siguen siendo accesibles.

---

## 7. Checklist final de crawlabilidad

| Comprobación | Estado |
|--------------|--------|
| robots.txt generado y servido | ✅ |
| sitemap.xml generado y referenciado en robots | ✅ |
| Sin noindex en contenido público | ✅ |
| Redirect 301 raíz → /en/ | ✅ (nginx) |
| Canonicals HTTPS con trailing slash | ✅ |
| Hreflang con prefijo /en/ y x-default al inglés | ✅ (corregido) |
| Structured data sin errores de variable (baseUrl) | ✅ (corregido) |
| 404 manejado (404.html) | ✅ |
| GA4 cargado (afterInteractive) | ✅ |
| Build Docker no rompe rutas ni assets | ✅ |

---

## 8. Recomendaciones

1. **Verificación en vivo (cuando el deploy esté activo)**  
   - Comprobar en el navegador:  
     - `https://celebratevalentines.com/robots.txt`  
     - `https://celebratevalentines.com/sitemap.xml`  
   - En Google Search Console: comprobar cobertura y que las URLs del sitemap se descubren e indexan sin errores.

2. **Hreflang**  
   - Tras el próximo deploy, revisar en una página de ciudad que los `<link rel="alternate" hreflang="en" href="...">` y `x-default` apunten a `https://celebratevalentines.com/en/...` (no a `/madrid/` sin prefijo).

3. **Mantener**  
   - Misma estructura de URLs (trailing slash, prefijo de locale).  
   - No añadir `noindex` en páginas de contenido.  
   - No cambiar `output: 'export'` sin ajustar nginx y despliegue.

---

**Conclusión:** Tras las correcciones de deploy y la corrección de hreflang, el sitio está configurado para ser correctamente rastreable e indexable. Los archivos `robots.txt` y `sitemap.xml` se generan en build y se sirven en producción; las URLs canónicas, hreflang y structured data son coherentes con la estructura del sitio.
