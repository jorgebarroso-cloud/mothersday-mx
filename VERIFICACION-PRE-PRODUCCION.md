# Verificación pre-producción

## Estado: listo para desplegar

### 1. Normalización de ciudad (slug)

- **`src/lib/utils.ts`**: `normalizeCitySlug(raw)` — decode, minúsculas, quita acentos (NFD), `lisboa` → `lisbon`.
- **Páginas que usan slug normalizado** (metadata + componente, `notFound()` si ciudad no existe):
  - `[locale]/[city]/page.tsx`
  - `[locale]/[city]/gifts/page.tsx`
  - `[locale]/[city]/restaurants/page.tsx`
  - `[locale]/[city]/valentines-day/ideas/page.tsx`
  - `[locale]/[city]/valentines-day/last-minute/page.tsx`

### 2. Rutas estáticas (generateStaticParams)

- Las 5 páginas anteriores definen `CITIES_FOR_PARAMS = [...Object.keys(CITY_NAMES), 'lisboa']` y generan params para todos los locales y ciudades, de modo que en `out/` existan:
  - `/en/munchen/`, `/es/munchen/`, … (gifts, restaurants, ideas, last-minute)
  - `/en/montreal/`, `/es/montreal/`, …
  - `/en/lisbon/`, `/es/lisbon/`, `/en/lisboa/`, `/es/lisboa/`, …

### 3. Nginx (producción)

- **`nginx.conf`**: Redirects 301 antes de `try_files`:
  - `/[locale]/münchen/...` → `/[locale]/munchen/...`
  - `/[locale]/montréal/...` → `/[locale]/montreal/...`
  - `/[locale]/lisboa/...` → `/[locale]/lisbon/...`

### 4. Build local

- `npm run build` con `NODE_ENV=production` o `STATIC_EXPORT=true` genera export estático (`out/`).
- En local puede hacer timeout o fallar fetches a Google Sheets; en **Cloud Build / GitHub Actions** el build suele completarse (entorno con red y timeout mayor).

### Antes de ir a producción

1. **Commit y push** de los cambios (utils, páginas, nginx).
2. **Desplegar** con tu flujo habitual (Cloud Build, GitHub Actions, etc.).
3. Tras el deploy, comprobar en producción:
   - `https://tu-dominio/en/munchen/`, `.../gifts/`, `.../restaurants/`, `.../valentines-day/ideas/`, `.../valentines-day/last-minute/`
   - `https://tu-dominio/en/montreal/` (y mismas subrutas)
   - `https://tu-dominio/en/lisbon/` y `https://tu-dominio/en/lisboa/` (ambas deben responder; lisboa puede redirigir a lisbon según nginx).
   - Opcional: probar `.../münchen/` y `.../montréal/` y verificar redirect 301 al slug canónico.

Si algo falla en producción, revisar que el artefacto desplegado incluya la `nginx.conf` actualizada y que el build se haya hecho con `output: 'export'` (STATIC_EXPORT/DOCKER/GITHUB_ACTIONS o NODE_ENV=production según `next.config.js`).
