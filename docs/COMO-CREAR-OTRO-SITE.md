# Cómo funciona el script y qué necesitas para crear otro site

Este documento explica el flujo de datos y **qué información tienes que dar** para lanzar un nuevo sitio (otra seasonality, otro país, otro idioma).

---

## Cómo funciona (resumen)

1. **Config de campaña**  
   Un único JSON en `data/campaigns/<slug>.json` define: dominio del sitio, URLs de Fever por ciudad, lista de ciudades, fichero donde se guardan los planes, textos (copy) y tipo de countdown.

2. **Fetch (extraer planes de Fever)**  
   `fetch-fever-plans.js` (o `fetch-fever-category.js --campaign=<slug>`) usa ese config para:
   - Visitar la URL de Fever por ciudad (ej. `https://feverup.com/en/{city}/mothers-day`).
   - Extraer experiences, gift cards y (opcional) Candlelight.
   - Guardar todo en el JSON indicado en `outputDataFile` (ej. `data/fever-plans-uk.json`).

3. **Generate (generar HTML)**  
   `generate-city-pages.js` lee el mismo config + el JSON de planes y genera:
   - Una página principal por ciudad (`/london/`, `/manchester/`, …).
   - Subpáginas por ciudad: ideas, experiences, events, candlelight.
   - Todos los textos (títulos, CTAs, breadcrumb, SEO) salen del config (nombre de campaña, país, `copy`).
   - El countdown (si aplica) depende de `countdownType`.

4. **Build y deploy**  
   El build estático y el deploy son los mismos; solo cambia qué campaña usas al ejecutar fetch y generate (por defecto `mothers-day`, o `--campaign=<slug>` / `CAMPAIGN=<slug>`).

---

## Qué insights tienes que dar para crear otro site

Para **cada nuevo sitio** (ej. San Valentín España, Father's Day UK, Mother's Day Francia) necesitas definir **un solo archivo**: el config de campaña. Con eso ya puedes ejecutar fetch y generate para esa campaña.

### 1. Crear el config: `data/campaigns/<slug>.json`

El **slug** es el identificador de la campaña (ej. `valentines-es`, `fathers-day`, `mothers-day-fr`). Ese mismo slug se usa en `--campaign=<slug>` o `CAMPAIGN=<slug>`.

### 2. Campos obligatorios (mínimo para que funcione)

| Campo | Qué es | Ejemplo (UK) | Ejemplo (España, otro idioma) |
|-------|--------|---------------|--------------------------------|
| `slug` | Id de la campaña (nombre del fichero sin .json) | `mothers-day` | `san-valentin-es` |
| `domain` | URL canónica del sitio que vas a publicar | `https://celebratemothersday.co.uk` | `https://sanvalentin.es` |
| `feverPathTemplate` | URL de la landing de Fever por ciudad. Usa literal `{city}` | `https://feverup.com/en/{city}/mothers-day` | `https://feverup.com/es/{city}/san-valentin` |
| `outputDataFile` | Ruta donde se guardarán los planes extraídos | `data/fever-plans-uk.json` | `data/fever-plans-valentines-es.json` |
| `cities` | Array de `{ "slug": "...", "name": "..." }`. El `slug` es el que se sustituye en `{city}` en las URLs | 8 ciudades UK | Madrid, Barcelona, Valencia, … |

### 3. Campos recomendados (nombre de campaña, país, textos, idioma)

Para que el sitio no diga “Mother's Day UK” en todos lados, define:

| Campo | Uso en el sitio | Ejemplo UK | Ejemplo España |
|-------|------------------|------------|----------------|
| `locale` | Idioma del sitio (meta, atributos lang) | `en-GB` | `es` o `es-ES` |
| `campaignName` | Nombre de la temporada/campaña en títulos, SEO, CTAs | `Mother's Day` | `San Valentín` |
| `countryLabel` | Etiqueta del país/región (breadcrumb, SEO) | `UK` | `España` |
| `siteName` | Nombre del sitio (header, footer, og:site_name) | `Celebrate Mother's Day` | `San Valentín` |
| `copy` | Textos que se repiten (en el idioma del sitio) | Ver abajo | Ver abajo |

### 4. Objeto `copy` (textos por idioma)

Todos son opcionales; si no los pones, se usan valores por defecto en inglés.

| Clave | Dónde se usa | Placeholders | Ejemplo ES |
|-------|--------------|--------------|------------|
| `countdownMessage` | Barra de countdown (si hay countdown) | `{campaignName}`, `{days}` | `¡Quedan {days} días para {campaignName}!` |
| `heroCta` | Botón principal del hero | `{campaignName}` | `Ver experiencias de {campaignName}` |
| `seeAllOnFever` | “Ver todo en Fever”, CTAs sticky | — | `Ver todo en Fever` |
| `breadcrumbHome` | Primera parte del breadcrumb (ej. país) | — | `España` |

### 5. Countdown (opcional)

| Campo | Valores | Efecto |
|-------|--------|--------|
| `countdownType` | `mothers-day-uk` | Cuenta atrás hasta Mother's Day UK (4º domingo de Cuaresma). |
| | `valentines` | Cuenta atrás hasta 14 de febrero. |
| | `none` o omitir | No se muestra barra de countdown. |

Si en el futuro añades otro tipo (ej. Father's Day UK), se puede extender `getCountdownDays()` en `generate-city-pages.js`.

### 6. Opcionales técnicos

- **`feverCandlelightPathTemplate`**: si usas Candlelight por ciudad (ej. `https://feverup.com/en/{city}/candlelight-{city}`). Si no, el script puede usar solo la URL principal.
- **`feverBase`**: base de Fever (por defecto `https://feverup.com`).
- **`maxExperiencesPerCity`** / **`maxGiftCardsPerCity`**: límites al extraer (por defecto 24 y 12).
- **`cities[].feverUrl`**: si una ciudad tiene URL de Fever distinta a la del template, ponla aquí.

---

## Ejemplo: config para San Valentín España

```json
{
  "slug": "valentines-es",
  "locale": "es",
  "domain": "https://sanvalentin.es",
  "feverBase": "https://feverup.com",
  "feverPathTemplate": "https://feverup.com/es/{city}/san-valentin",
  "outputDataFile": "data/fever-plans-valentines-es.json",
  "cities": [
    { "slug": "madrid", "name": "Madrid" },
    { "slug": "barcelona", "name": "Barcelona" },
    { "slug": "valencia", "name": "Valencia" }
  ],
  "maxExperiencesPerCity": 24,
  "maxGiftCardsPerCity": 12,
  "campaignName": "San Valentín",
  "countryLabel": "España",
  "siteName": "San Valentín",
  "countdownType": "valentines",
  "copy": {
    "countdownMessage": "¡Quedan {days} días para {campaignName}!",
    "heroCta": "Ver experiencias de {campaignName}",
    "seeAllOnFever": "Ver todo en Fever",
    "breadcrumbHome": "España"
  }
}
```

### Comandos para ese sitio

```bash
# Extraer planes de Fever para esa campaña
CAMPAIGN=valentines-es node scripts/fetch-fever-plans.js

# Generar todas las páginas (Madrid, Barcelona, Valencia + subpáginas)
CAMPAIGN=valentines-es node scripts/generate-city-pages.js
```

El HTML generado usará “San Valentín”, “España”, los textos en español y el countdown hasta el 14 de febrero.

---

## Resumen: checklist para un nuevo site

1. **URLs de Fever**  
   - URL de la landing por ciudad (con `{city}`).  
   - (Opcional) URL Candlelight por ciudad si aplica.

2. **Dominio**  
   - URL canónica del sitio (`domain`).

3. **Ciudades**  
   - Lista de `slug` y `name` (y `feverUrl` solo si alguna ciudad es distinta).

4. **Idioma y textos**  
   - `locale`, `campaignName`, `countryLabel`, `siteName`.  
   - Objeto `copy` en el idioma del sitio (countdownMessage, heroCta, seeAllOnFever, breadcrumbHome).

5. **Countdown**  
   - `countdownType`: `mothers-day-uk`, `valentines` o `none`.

6. **Fichero de salida**  
   - `outputDataFile`: path al JSON de planes (ej. `data/fever-plans-<campaña>.json`).

Con ese único JSON en `data/campaigns/<slug>.json` puedes crear otro site sin tocar el código; solo ejecutar fetch y generate con `--campaign=<slug>` (o variable `CAMPAIGN`). Para automatizar, el workflow de GitHub puede aceptar un input `campaign` y hacer commit del `outputDataFile` y de las carpetas de ciudad de ese config.
