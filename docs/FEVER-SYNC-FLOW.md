# Flujo de sincronización Fever → sitio

Este documento describe cómo se actualiza la información y los planes extraídos de Fever en cada ciudad, cómo funciona la automatización y cómo comprobar que los cambios en Fever se reflejan en el sitio.

## Flujo (Fever → sitio)

1. **Config** — `data/campaigns/mothers-day.json` define: `slug`, `locale`, `domain`, `feverPathTemplate`, `feverCandlelightPathTemplate`, `outputDataFile`, `cities` (8), `maxExperiencesPerCity`, `maxGiftCardsPerCity`.

2. **Fetch** — `scripts/fetch-fever-plans.js` carga ese config y llama a `scripts/fetch-fever-category.js`. Este usa Playwright para visitar `https://feverup.com/en/{city}/mothers-day` (y opcionalmente la URL candlelight por ciudad), extrae enlaces `/m/`, separa experiences vs gift cards por sección/nombre, enriquece con `og:image` y escribe `data/fever-plans-uk.json`.

3. **Generación** — `scripts/generate-city-pages.js` lee el mismo campaign config, asigna `FEVER_PLANS_PATH` y `DOMAIN` desde el config, carga `fever-plans-uk.json`, genera HTML por ciudad (index + ideas/experiences/events/candlelight) y escribe `sitemap.xml`. La lista de ciudades sale de `campaignConfig.cities`; si está vacía, hace fallback a `data/uk-cities.json`.

4. **Build local** — `scripts/build-static.ps1` con `-RefreshFever` ejecuta fetch + generate; sin flag solo CSS/JS + generate.

Así, **cualquier cambio en los planes de Fever** se refleja en el sitio solo después de: (1) ejecutar fetch (actualizar JSON) y (2) ejecutar generate (regenerar HTML y sitemap). La automatización es la que hace eso y sube los cambios.

## Archivos implicados

| Archivo | Rol |
|--------|-----|
| `data/campaigns/mothers-day.json` | Config de la campaña: URLs Fever, ciudades, fichero de salida, dominio. |
| `scripts/fetch-fever-plans.js` | Wrapper que carga config "mothers-day" y llama a fetch-fever-category. |
| `scripts/fetch-fever-category.js` | Lógica genérica: Playwright, scraping, escritura de JSON. Reutilizable con `--campaign=<id>`. |
| `data/fever-plans-uk.json` | Salida del fetch: planes por ciudad (experiences, giftCards, candlelightExperiences). |
| `scripts/generate-city-pages.js` | Lee config + JSON, genera HTML por ciudad y `sitemap.xml`. |
| `london/` … `edinburgh/` | Carpetas de ciudad generadas (index + ideas/experiences/events/candlelight). |
| `sitemap.xml` | Generado por generate-city-pages. |

## Automatización (GitHub Actions)

- **Workflow:** `.github/workflows/sync-fever-plans.yml`
- **Cuándo:** cron `0 8,18 * * *` (08:00 y 18:00 UTC) y `workflow_dispatch` (manual).
- **Qué hace:** checkout → Node 20 → `npm ci` → Playwright Chromium → `node scripts/fetch-fever-plans.js` → `node scripts/generate-city-pages.js` → obtiene la lista de carpetas de ciudad desde `data/campaigns/mothers-day.json` → si hay cambios, commit y push de:
  - `data/fever-plans-uk.json`
  - `sitemap.xml`
  - Todas las carpetas de ciudad definidas en el config (london/, manchester/, birmingham/, liverpool/, leeds/, bristol/, brighton/, edinburgh/).

La lista de carpetas a añadir al commit se construye de forma **dinámica** desde el config; si se añade una ciudad en `data/campaigns/mothers-day.json`, no hace falta tocar el YAML.

## Comprobar que todo funciona

1. **Automático:** El job corre 2 veces al día; si Fever cambia planes, el siguiente run actualiza JSON → regenerate → commit (todas las ciudades + sitemap) → push. El deploy (p. ej. Cloud Build on push to main) desplegaría esa versión.
2. **Manual:** En GitHub → Actions → "Sync Fever plans" → "Run workflow". Revisar que el commit generado incluya las 8 ciudades + sitemap + fever-plans-uk.json.
3. **Local:** `.\scripts\build-static.ps1 -RefreshFever` y luego commit/push manual de `data/fever-plans-uk.json`, todas las carpetas de ciudad y `sitemap.xml`.

## Cómo añadir una nueva seasonality / otro site

- **Guía paso a paso y checklist:** [docs/COMO-CREAR-OTRO-SITE.md](COMO-CREAR-OTRO-SITE.md) — qué datos necesitas (URLs Fever, dominio, ciudades, copy en tu idioma, countdown) y ejemplo de config para otro país/idioma.
- **Proceso estándar y pipeline:** [docs/SEASONALITY-CAMPAIGNS.md](SEASONALITY-CAMPAIGNS.md) — crear `data/campaigns/<slug>.json`, usar `--campaign=<slug>` en fetch y generate, y (opcional) adaptar el workflow para esa campaña.
