# Sitios de seasonality (Fever) — Proceso completo

Sitio estático por campaña (Mother's Day UK, San Valentín, etc.): los planes se extraen de Fever, se generan las páginas HTML por ciudad y el resultado se despliega. Este README explica **todo el proceso paso a paso** para que el equipo pueda ejecutarlo en local, entender la automatización y crear nuevos sitios.

---

## 1. ¿Qué hace este proyecto?

- **Lee la configuración** de una campaña (dominio, ciudades, URLs de Fever, textos en el idioma que toque).
- **Extrae planes de Fever** (experiences, gift cards, Candlelight) por ciudad desde las landings de Fever.
- **Genera HTML estático** por ciudad: página principal + subpáginas (ideas, experiences, events, candlelight).
- **Permite desplegar** el sitio (por ejemplo con Cloud Build / Nginx). La automatización puede actualizar los datos y regenerar las páginas sin tocar código.

Todo está pensado para **cualquier seasonality y cualquier país/idioma**: basta con crear un nuevo archivo de config y ejecutar los mismos scripts con esa campaña.

---

## 2. Requisitos previos

- **Node.js** (v18 o superior).
- **npm** (viene con Node).
- **Playwright** (solo si vas a ejecutar el fetch desde Fever): tras `npm install`, ejecutar `npx playwright install chromium`.
- Opcional: **terser** y **clean-css-cli** para minificar JS/CSS en el build (`npm install -g terser clean-css-cli`).

```bash
# Clonar e instalar
git clone <repo>
cd "Mothers Day Seasonality"
npm ci

# Si vas a hacer fetch desde Fever
npx playwright install chromium
```

---

## 3. Estructura del proyecto (resumida)

```
Mothers Day Seasonality/
├── data/
│   ├── campaigns/           # Config por campaña (un JSON por sitio)
│   │   └── mothers-day.json  # Ejemplo: Mother's Day UK
│   ├── fever-plans-uk.json  # Planes extraídos de Fever (salida del fetch)
│   └── uk-cities.json       # Fallback de ciudades si el config no define cities
├── scripts/
│   ├── fetch-fever-plans.js      # Wrapper: llama al fetch con la campaña elegida
│   ├── fetch-fever-category.js   # Lógica de extracción Fever (Playwright)
│   ├── generate-city-pages.js    # Genera HTML por ciudad desde config + JSON
│   └── build-static.ps1          # Build: CSS/JS + opcional fetch + generate
├── london/, manchester/, ...    # Carpetas de ciudad (HTML generado)
├── css/, js/, images/, legal/   # Assets estáticos
├── sitemap.xml                  # Generado por generate-city-pages
└── .github/workflows/
    └── sync-fever-plans.yml     # Automatización: fetch + generate + commit + push
```

---

## 4. Proceso paso a paso

### Paso 1: Configuración de la campaña

Cada sitio (Mother's Day UK, San Valentín España, etc.) tiene **un solo archivo** en `data/campaigns/<slug>.json`.

Ese JSON define:

- **Dominio** del sitio (`domain`).
- **URLs de Fever** por ciudad (`feverPathTemplate` con `{city}`).
- **Lista de ciudades** (`cities`: `slug` y `name`).
- **Fichero donde se guardan los planes** (`outputDataFile`).
- **Textos en el idioma del sitio**: nombre de campaña, país, CTAs, breadcrumb, mensaje de countdown (`campaignName`, `countryLabel`, `copy`, etc.).
- **Tipo de countdown** si aplica (`countdownType`: p. ej. `mothers-day-uk`, `valentines`, `none`).

Por defecto los scripts usan la campaña `mothers-day` (fichero `data/campaigns/mothers-day.json`). Para otra campaña se usa `--campaign=<slug>` o la variable de entorno `CAMPAIGN=<slug>`.

**Documentación detallada:** [docs/COMO-CREAR-OTRO-SITE.md](docs/COMO-CREAR-OTRO-SITE.md) (checklist y ejemplo para otro país/idioma).

---

### Paso 2: Extraer planes de Fever (fetch)

Este paso visita las landings de Fever por ciudad, extrae experiences y gift cards (y opcionalmente Candlelight) y escribe un JSON.

**Comando (campaña por defecto: Mother's Day UK):**

```bash
node scripts/fetch-fever-plans.js
```

**Para otra campaña:**

```bash
node scripts/fetch-fever-plans.js --campaign=valentines-es
# o
CAMPAIGN=valentines-es node scripts/fetch-fever-plans.js
```

**Requisito:** Playwright con Chromium (`npx playwright install chromium`).

**Resultado:** Se actualiza el fichero indicado en `outputDataFile` del config (por ejemplo `data/fever-plans-uk.json`). Si el fetch falla a mitad (p. ej. timeout), se puede re-ejecutar solo el enriquecimiento de imágenes sin volver a scrapear:

```bash
node scripts/fetch-fever-category.js --campaign=mothers-day --enrich-only
```

---

### Paso 3: Generar páginas HTML (generate)

Lee el config de la campaña y el JSON de planes, y genera:

- Una **página principal** por ciudad (`/london/`, `/manchester/`, …).
- **Subpáginas** por ciudad: ideas, experiences, events, candlelight.
- **sitemap.xml**.

Todos los textos (títulos, hero, breadcrumb, CTAs, SEO) salen del config (nombre de campaña, país, objeto `copy`), no están fijos en el código.

**Comando (campaña por defecto):**

```bash
node scripts/generate-city-pages.js
```

**Para otra campaña:**

```bash
node scripts/generate-city-pages.js --campaign=valentines-es
# o
CAMPAIGN=valentines-es node scripts/generate-city-pages.js
```

**Resultado:** Se crean/actualizan las carpetas de ciudad (p. ej. `london/`, `manchester/`) y `sitemap.xml`.

---

### Paso 4: Build estático (CSS/JS y opcionalmente fetch + generate)

El script de build (PowerShell):

1. Concatena y minifica CSS → `css/bundle.min.css`.
2. Minifica JS → `js/main.min.js`.
3. Opcionalmente ejecuta fetch y generate (si pasas `-RefreshFever`).
4. Si no usas `-RefreshFever`, solo vuelve a ejecutar generate (usa el JSON de planes ya existente).

**Solo CSS/JS + generate (sin volver a extraer de Fever):**

```powershell
.\scripts\build-static.ps1
```

**Incluir extracción desde Fever y luego generate:**

```powershell
.\scripts\build-static.ps1 -RefreshFever
```

**Nota:** El build actual usa la campaña por defecto (`mothers-day`). Para otra campaña hay que ejecutar fetch y generate a mano con `CAMPAIGN=<slug>` antes o después del build.

---

### Paso 5: Probar en local

Servir la raíz del proyecto (donde están los `index.html` y las carpetas de ciudad):

```bash
npm run serve
# o
npm run dev
```

Abrir en el navegador la URL que indique (p. ej. `http://localhost:3000`).

---

### Paso 6: Despliegue

El despliegue (por ejemplo con **Google Cloud Build** o un host estático) se hace sobre el contenido del repositorio: HTML generado, CSS, JS, imágenes, `sitemap.xml`, etc. No hay paso extra; un push a `main` puede disparar el build y deploy en tu CI/CD.

---

## 5. Automatización (GitHub Actions)

El workflow **Sync Fever plans** (`.github/workflows/sync-fever-plans.yml`):

- **Cuándo se ejecuta:**  
  - Por **schedule** (cron): por ejemplo 08:00 y 18:00 UTC.  
  - **Manual:** en GitHub → Actions → "Sync Fever plans" → Run workflow.

- **Qué hace:**  
  1. Checkout del repo.  
  2. Instalación de dependencias y Playwright Chromium.  
  3. **Fetch:** `node scripts/fetch-fever-plans.js` (campaña por defecto).  
  4. **Generate:** `node scripts/generate-city-pages.js`.  
  5. Obtiene la lista de carpetas de ciudad desde el config (`mothers-day.json`).  
  6. Si hay cambios, hace **commit y push** de:  
     - El JSON de planes (p. ej. `data/fever-plans-uk.json`).  
     - `sitemap.xml`.  
     - Todas las carpetas de ciudad del config.

Así, los cambios en Fever se reflejan en el sitio sin intervención manual (y el deploy se dispara con el push a `main`).

**Nota:** El workflow está configurado para la campaña **mothers-day**. Para automatizar otra campaña habría que añadir un input `campaign` en el workflow y usar ese valor en fetch, generate y en los archivos que se añaden al commit.

---

## 6. Resumen de comandos útiles

| Objetivo | Comando |
|----------|---------|
| Extraer planes de Fever (campaña por defecto) | `node scripts/fetch-fever-plans.js` |
| Extraer planes para otra campaña | `CAMPAIGN=valentines-es node scripts/fetch-fever-plans.js` |
| Generar páginas (campaña por defecto) | `node scripts/generate-city-pages.js` |
| Generar páginas para otra campaña | `CAMPAIGN=valentines-es node scripts/generate-city-pages.js` |
| Build (CSS/JS + generate) | `.\scripts\build-static.ps1` |
| Build + refrescar datos Fever | `.\scripts\build-static.ps1 -RefreshFever` |
| Servir sitio en local | `npm run serve` o `npm run dev` |

---

## 7. Crear un nuevo sitio (otra seasonality / país / idioma)

1. **Crear el config** en `data/campaigns/<slug>.json` con:  
   dominio, `feverPathTemplate`, `outputDataFile`, `cities`, y (recomendado) `campaignName`, `countryLabel`, `locale`, `copy` (textos en el idioma del sitio) y `countdownType` si aplica.

2. **Fetch y generate** con esa campaña:  
   `CAMPAIGN=<slug> node scripts/fetch-fever-plans.js` y luego `CAMPAIGN=<slug> node scripts/generate-city-pages.js`.

3. **Opcional:** Adaptar el workflow de GitHub para que acepte un input `campaign` y haga commit de los artefactos de esa campaña.

Guía detallada con checklist y ejemplo (p. ej. San Valentín España): **[docs/COMO-CREAR-OTRO-SITE.md](docs/COMO-CREAR-OTRO-SITE.md)**.

---

## 8. Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [docs/COMO-CREAR-OTRO-SITE.md](docs/COMO-CREAR-OTRO-SITE.md) | Qué datos necesitas para otro site, campos del config, ejemplo completo. |
| [docs/FEVER-SYNC-FLOW.md](docs/FEVER-SYNC-FLOW.md) | Flujo Fever → sitio, archivos implicados, automatización, comprobaciones. |
| [docs/SEASONALITY-CAMPAIGNS.md](docs/SEASONALITY-CAMPAIGNS.md) | Pipeline estándar de campañas y proceso para añadir una nueva. |

---

## 9. Resumen rápido para el equipo

- **Un JSON por campaña** en `data/campaigns/<slug>.json` define el sitio (dominio, ciudades, URLs Fever, textos e idioma).
- **Fetch** = extraer planes de Fever → se guarda un JSON.
- **Generate** = leer config + JSON y generar HTML por ciudad + sitemap.
- **Build** = CSS/JS + (opcional) fetch + generate.
- **Automatización** = el workflow hace fetch + generate y hace commit/push para que el deploy tenga los datos al día.
- **Otro sitio** = nuevo JSON en `data/campaigns/` y ejecutar fetch y generate con `CAMPAIGN=<slug>`.

Si algo no cuadra con lo que veis en repo o en producción, revisar los docs en `docs/` o el config en `data/campaigns/mothers-day.json` como referencia.
