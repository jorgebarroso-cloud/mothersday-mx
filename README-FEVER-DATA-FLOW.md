# Flujo de datos Fever: extracción, clasificación y distribución de planes

Este documento explica cómo obtenemos los planes de Fever de forma automática (Mother's Day y Candlelight), cómo los clasificamos en categorías y cómo se muestran en la web. Sirve como referencia para el equipo y como **plantilla de funcionamiento** para otros países y futuras webs de seasonalities (San Valentín, Black Friday, etc.).

---

## 1. Resumen del flujo

```
Fever (web)  →  Scripts de extracción (Playwright)  →  JSON por ciudad
                                                              ↓
Páginas HTML estáticas  ←  Generador (generate-city-pages.js)  ←  Clasificación (ideas / experiences / events / candlelight)
                                                              ↑
                                              Cada card enlaza a Fever (plan concreto o landing)
```

- **Extracción:** visitamos las landings de Fever por ciudad, extraemos enlaces a planes (`/m/xxx`), nombre, precio y imagen. Guardamos todo en un JSON.
- **Clasificación:** con ese JSON, clasificamos cada plan en **events**, **experiences** o **ideas** (y Candlelight va aparte) usando reglas heurísticas sobre el texto (fechas, “gift”, etc.).
- **Generación:** el generador lee el JSON y la configuración de campaña, y genera las páginas HTML estáticas. Cada **card** enlaza al plan concreto en Fever (`https://feverup.com/m/xxx`) o, si no hay URL, a la landing de la ciudad en Fever.

---

## 2. Extracción automática desde Fever

### 2.1 Qué se extrae

Visitamos **dos tipos de páginas** por ciudad:

| Origen | URL (ejemplo UK) | Qué guardamos |
|--------|------------------|----------------|
| **Mother's Day** | `https://feverup.com/en/{city}/mothers-day` | `experiences` (planes principales) y `giftCards` (gift cards de la sección “Gift Cards”) |
| **Candlelight** | `https://feverup.com/en/{city}/candlelight-{city}` | `candlelightExperiences` |

Por cada plan extraído guardamos:

- `name`: texto del enlace / título de la card (tal como aparece en Fever).
- `url`: enlace al plan en Fever (ej. `https://feverup.com/m/163280`).
- `priceText`: texto de precio (ej. `"From £35.00"` o `"From £22.05 4.8"` si incluye valoración).
- `image`: URL de la imagen (de la card o, si falta, de `og:image` del plan).

Fever no nos da “tags” ni categorías; solo tenemos nombre y precio. Por eso la clasificación en nuestra web se hace después con **heurísticas sobre ese texto**.

### 2.2 Scripts que hacen la extracción

- **`scripts/fetch-fever-category.js`**  
  Script genérico que, dado un **config de campaña**, visita la URL de Fever por ciudad y extrae experiences y gift cards. Si el config tiene `feverCandlelightPathTemplate`, además visita la landing de Candlelight y rellena `candlelightExperiences`.

- **`scripts/fetch-fever-plans.js`**  
  Wrapper que carga el config `mothers-day` y llama a `fetch-fever-category.js`. Es el que se usa en el build con `-RefreshFever`.

**Requisitos:** Node.js, Playwright y Chromium:

```bash
npm install -D playwright
npx playwright install chromium
```

**Ejecución:**

```bash
# Extraer datos de la campaña por defecto (mothers-day)
node scripts/fetch-fever-category.js

# O especificar campaña
node scripts/fetch-fever-category.js --campaign=mothers-day
CAMPAIGN=mothers-day node scripts/fetch-fever-category.js
```

El script:

1. Abre la URL de Mother's Day por cada ciudad del config.
2. Busca todos los enlaces que contienen `/m/` (planes) o `/en/{city}/`.
3. Separa **gift cards** de **experiences**:  
   - Si hay una sección con título tipo “Gift Cards”, los enlaces dentro van a `giftCards`.  
   - Si no, los que en el nombre llevan “gift card” van a `giftCards` y el resto a `experiences`.
4. Si existe `feverCandlelightPathTemplate`, hace lo mismo con la URL de Candlelight y rellena `candlelightExperiences`.
5. Opcionalmente enriquece planes sin imagen visitando la ficha del plan y leyendo `og:image`.
6. Escribe el resultado en el archivo indicado en el config (ej. `data/fever-plans-uk.json`).

### 2.3 Configuración de campaña (origen de URLs y datos)

La campaña se define en **`data/campaigns/{campaignId}.json`** (ej. `mothers-day.json`). Ahí se configura:

- **URLs de Fever:** `feverPathTemplate` (Mother's Day) y `feverCandlelightPathTemplate` (Candlelight).
- **Dominio de nuestra web:** `domain`.
- **Ciudades:** lista con `slug` y `name`.
- **Archivo de salida:** `outputDataFile` (ej. `data/fever-plans-uk.json`).
- **Límites:** `maxExperiencesPerCity`, `maxGiftCardsPerCity`.

Ejemplo (UK Mother's Day):

```json
{
  "slug": "mothers-day",
  "domain": "https://celebratemothersday.co.uk",
  "feverBase": "https://feverup.com",
  "feverPathTemplate": "https://feverup.com/en/{city}/mothers-day",
  "feverCandlelightPathTemplate": "https://feverup.com/en/{city}/candlelight-{city}",
  "outputDataFile": "data/fever-plans-uk.json",
  "cities": [
    { "slug": "london", "name": "London" },
    { "slug": "manchester", "name": "Manchester" },
    { "slug": "birmingham", "name": "Birmingham" }
  ],
  "maxExperiencesPerCity": 24,
  "maxGiftCardsPerCity": 12
}
```

La campaña UK incluye actualmente **8 ciudades**: London, Manchester, Birmingham, Liverpool, Leeds, Bristol, Brighton y Edinburgh. Al ejecutar `node scripts/fetch-fever-plans.js` (o `.\scripts\build-static.ps1 -RefreshFever`) el script visita la landing de Mother's Day y, si está configurado, la de Candlelight **por cada ciudad** del config y escribe todo en `data/fever-plans-uk.json`. Las ciudades nuevas sin datos en Fever mostrarán el fallback "Top picks" hasta que exista contenido en Fever para esa ciudad.

Para **otro país o seasonality** se crea un nuevo JSON en `data/campaigns/` (ej. `valentines-day.json`, `mothers-day-es.json`) y se cambian `domain`, `feverPathTemplate`, `feverCandlelightPathTemplate`, `outputDataFile` y `cities`. El mismo `fetch-fever-category.js` sirve para todos.

---

## 3. Estructura del JSON de datos (`fever-plans-uk.json`)

El archivo es un objeto **por ciudad** (slug). Por cada ciudad hay tres listas:

```json
{
  "london": {
    "experiences": [
      { "name": "...", "url": "https://feverup.com/m/163280", "priceText": "From £35.00", "image": "..." }
    ],
    "giftCards": [
      { "name": "Candlelight Gift Card - London...", "url": "https://feverup.com/m/95252", "priceText": "From £25.00", "image": "..." }
    ],
    "candlelightExperiences": [
      { "name": "Central Hall Westminster Candlelight: Best of Bridgerton...", "url": "...", "priceText": "From £22.05 4.8", "image": "..." }
    ]
  },
  "manchester": { ... },
  "birmingham": { ... }
}
```

- **experiences:** planes de la landing Mother's Day (excluidas gift cards).
- **giftCards:** gift cards detectadas en esa misma landing.
- **candlelightExperiences:** planes de la landing Candlelight de esa ciudad.

El generador de páginas lee este JSON y, para cada ciudad, usa `experiences` y `giftCards` para clasificar en **ideas / experiences / events**, y usa `candlelightExperiences` solo para la sección Candlelight.

---

## 4. Clasificación de planes (ideas / experiences / events)

Como Fever no nos da categorías, clasificamos con **reglas heurísticas** sobre `name` y `priceText` en `scripts/generate-city-pages.js` (función `classifyPlans`).

### 4.1 Categorías en nuestra web

| Categoría | Ruta (ejemplo) | Contenido |
|-----------|-----------------|-----------|
| **Ideas** | `/{city}/ideas/` | Gift cards + planes “idea de regalo” (Gift, Package, etc.) + hasta 8 experiencias extra para no dejar vacía la página. |
| **Experiences** | `/{city}/experiences/` | Planes con rango de fechas largo, rango abierto o sin fecha reconocible (experiencias “evergreen”). |
| **Events** | `/{city}/events/` | Planes con fecha única o rango corto de fechas (eventos con fecha concreta). |
| **Candlelight** | `/{city}/candlelight/` | Siempre los planes de `candlelightExperiences`; no pasan por la clasificación de Mother's Day. |

Un mismo plan puede aparecer en **events** y **experiences** (por ejemplo un concierto con rango corto de fechas).

### 4.2 Reglas heurísticas (resumen)

- **Events:**  
  - Patrón “fecha única”: tipo `DD Mon From` (ej. `01 Mar From`) en el nombre/precio, **sin** que forme parte de un rango `DD Mon - DD Mon`.  
  - O rango de fechas **corto**: `DD Mon - DD Mon` con diferencia ≤ 45 días (aproximada por meses).
- **Experiences:**  
  - Rango **largo** (> 45 días), o rango abierto (`DD Mon -` sin segunda fecha), o sin patrón de fecha.  
  - Los de rango corto pueden estar también aquí (events + experiences).
- **Ideas:**  
  - Todos los `giftCards`.  
  - Planes de `experiences` cuyo nombre contiene “Gift”, “Package”, “Experience gift”, etc.  
  - Hasta 8 experiencias más (que no estén ya en ideas) para rellenar si hace falta.

Si para una ciudad **events**, **experiences** o **ideas** quedan vacíos, se usa un **fallback**: los primeros 6 planes de `experiences` (o gift cards + experiences para ideas) para que la página no quede vacía.

### 4.3 Límite de planes mostrados por página

En cada sección (ideas, experiences, events, candlelight) se muestran como máximo **6 planes** (constante `FEATURED_PLANS_MAX`). El resto se puede ver en Fever con el botón “See all on Fever”.

---

## 5. A dónde llevan nuestras cards

- **Cada card de plan** enlaza al **plan concreto en Fever**: `pick.url` (ej. `https://feverup.com/m/163280`). Se abre en nueva pestaña (`target="_blank"`).
- Si un plan no tiene `url`, se usa la URL de la **landing de la página** en la que está:  
  - Páginas ideas/experiences/events: `https://feverup.com/en/{city}/mothers-day`  
  - Página Candlelight: `https://feverup.com/en/{city}/candlelight-{city}`
- Los botones tipo **“See all on Fever”** y el **sticky CTA** llevan a esa misma landing (Mother's Day o Candlelight según la página).

Resumen:

| Ubicación | Destino del enlace de la card | Destino “See all” / CTA |
|-----------|-------------------------------|---------------------------|
| Home (picks) | Plan en Fever (`/m/xxx`) o landing Mother's Day | Landing Mother's Day ciudad |
| Ciudad (picks) | Plan en Fever o landing Mother's Day | Landing Mother's Day ciudad |
| Gift cards (carousel) | Plan en Fever o landing Mother's Day | Landing Mother's Day ciudad |
| Ideas / Experiences / Events | Plan en Fever o landing Mother's Day | Landing Mother's Day ciudad |
| Candlelight | Plan en Fever o landing Candlelight | Landing Candlelight ciudad |

---

## 6. Páginas que se generan

El generador (`scripts/generate-city-pages.js`) usa:

- **Config de campaña** (`data/campaigns/{campaign}.json`): dominio, ciudades, `outputDataFile`, `feverPathTemplate`, etc.
- **Datos** del archivo indicado en `outputDataFile` (ej. `fever-plans-uk.json`).

Genera:

1. **Home** (`index.html`): selector de ciudad, enlaces a cada ciudad.
2. **Por ciudad:**  
   - `/{city}/` → página de la ciudad (hero, picks de Mother's Day, gift cards, bloques Ideas / Experiences / Events / Candlelight con enlaces a subpáginas).
   - `/{city}/ideas/` → planes clasificados como ideas (máx. 6).
   - `/{city}/experiences/` → planes clasificados como experiences (máx. 6).
   - `/{city}/events/` → planes clasificados como events (máx. 6).
   - `/{city}/candlelight/` → planes de `candlelightExperiences` (máx. 6).

Todo es HTML estático; no hay backend. Las cards se construyen en el generador a partir del JSON.

---

## 7. Build completo (extracción + generación)

Script principal: **`scripts/build-static.ps1`** (Windows PowerShell).

1. Concatena y opcionalmente minifica CSS → `css/bundle.min.css`.
2. Minifica JS → `js/main.min.js`.
3. **Opcional:** si se pasa **`-RefreshFever`**, ejecuta `node scripts/fetch-fever-plans.js` para refrescar `fever-plans-uk.json` desde Fever (requiere Playwright).
4. Ejecuta `node scripts/generate-city-pages.js` (usa el campaign config por defecto o `--campaign=...`) y genera todas las páginas.

Ejemplo:

```powershell
.\scripts\build-static.ps1           # Solo CSS/JS + generación con datos actuales
.\scripts\build-static.ps1 -RefreshFever   # Refrescar datos de Fever y luego generar
```

Para otros países/seasonalities se puede llamar al generador con otra campaña (y otro `outputDataFile` en el config) una vez tengamos el JSON de datos para esa campaña.

---

## 8. Plantilla para otros países y seasonalities

Para **replicar** este flujo en otro país o en otra seasonality (San Valentín, Black Friday, etc.):

1. **Nuevo config de campaña** en `data/campaigns/`, por ejemplo `mothers-day-es.json` o `valentines-day.json`:
   - `domain`: dominio de la nueva web.
   - `feverPathTemplate`: URL de la landing en Fever (ej. `https://feverup.com/es/{city}/dia-de-la-madre`).
   - `feverCandlelightPathTemplate`: URL Candlelight para esa ciudad (si aplica).
   - `outputDataFile`: ruta del JSON de datos (ej. `data/fever-plans-es.json`).
   - `cities`: lista de ciudades con `slug` y `name`.

2. **Extracción:** ejecutar `fetch-fever-category.js` con ese campaign id para generar el JSON. Asegurarse de que las URLs de Fever existan y tengan la misma estructura de enlaces `/m/` y secciones (experiences / gift cards).

3. **Generación:** el mismo `generate-city-pages.js` puede usarse; hay que pasarle la campaña correspondiente (por ejemplo `--campaign=mothers-day-es`). El script ya lee `outputDataFile` y `domain` del config. Si la nueva web usa otros textos o rutas, habría que parametrizar en el generador (títulos, slugs de sección, etc.) o duplicar/adaptar el generador para esa campaña.

4. **Clasificación:** las reglas de `classifyPlans` dependen de patrones en inglés (Jan, Feb, “From”, “Gift”, “Package”). Para otro idioma habría que añadir patrones equivalentes o un config por locale.

Con esto, el flujo “Fever → JSON → clasificación → HTML y enlaces a Fever” queda documentado y reutilizable para otros países y seasonalities.
