# Mothers Day Seasonality – GitHub y Deploy en Producción

Este proyecto es una copia independiente basada en Valentines. Tiene su propio repositorio Git (sin historial de Valentines).

---

## 1. Crear repositorio en GitHub y hacer push

1. **Crear el repo en GitHub**
   - Ve a [GitHub](https://github.com/new).
   - Nombre del repositorio: p. ej. `mothers-day-seasonality` (o el que prefieras).
   - Deja el repo **vacío** (sin README, sin .gitignore).
   - Crea el repositorio.

2. **Conectar y hacer push desde tu máquina**
   En la carpeta del proyecto (`C:\Users\FEVER\Documents\Mothers Day Seasonality`):

   ```powershell
   git remote add origin https://github.com/<TU-USUARIO>/<NOMBRE-REPO>.git
   git push -u origin main
   ```

   Sustituye `<TU-USUARIO>` y `<NOMBRE-REPO>` por tu usuario de GitHub y el nombre del repo (ej. `mario-palencia/mothers-day-seasonality`).

A partir de aquí, el código de Mothers Day está en GitHub y separado del repo de Valentines.

---

## 2. Deploy en producción (Cloud Build + Cloud Run)

El mismo `cloudbuild.yaml` del proyecto sirve para Mothers Day. Solo hay que crear un **nuevo trigger** en Cloud Build que apunte a este repo y use un **nuevo nombre de servicio** en Cloud Run.

### Mismo proyecto GCP (recomendado)

1. **Google Cloud Console** → **Cloud Build** → **Triggers**.
2. **Create Trigger**.
3. Configuración:
   - **Name:** p. ej. `mothers-day-seasonality-deploy`.
   - **Event:** Push to a branch.
   - **Source:** Conecta GitHub si no está conectado; elige el **repositorio de Mothers Day** (no el de Valentines).
   - **Branch:** `^main$`.
   - **Configuration:** Cloud Build configuration file (yaml or json).
   - **Location:** Repository.
   - **Cloud Build configuration file:** `cloudbuild.yaml`.

4. **Variables de sustitución** (importante):
   - `_SERVICE_NAME` = `mothers-day-seasonality` (o el nombre que quieras para el servicio en Cloud Run).
   - `_REGION` = la misma que usas en Valentines (p. ej. `us-east4`).
   - `_REPOSITORY` = el mismo Artifact Registry que Valentines (p. ej. `docker-repo`).

5. Guarda el trigger.

Cada **push a `main`** del repo de Mothers Day disparará un build y desplegará el **servicio** `mothers-day-seasonality` en Cloud Run (sin tocar el servicio de Valentines).

### Dominio

- En **Cloud Run** → tu servicio `mothers-day-seasonality` → **Domain mappings**, asigna el dominio de Mothers Day (p. ej. `celebratemothersday.com` o el subdominio que uses).
- El dominio actualmente configurado en el código es **celebratemothersday.com** (placeholder). Si usas otro, búscalo y reemplázalo en: `layout.tsx`, `robots.ts`, `sitemap.ts`, `basepath.ts`, y en los mensajes i18n si aplica.

---

## 3. Resumen de cambios respecto a Valentines

| Aspecto | Valentines | Mothers Day |
|--------|------------|-------------|
| **package name** | fever-valentines-landing | fever-mothers-day-landing |
| **Dominio** | celebratevalentines.com | celebratemothersday.com (cambiable) |
| **UTM content** | valentines | mothersday |
| **Datos** | `NEXT_PUBLIC_MOTHERS_DAY_CSV_URL` (opcional) y `NEXT_PUBLIC_MOTHERS_DAY_CATEGORIES_CSV_URL` para tu Google Sheet |
| **Cloud Run service** | celebrate-valentines | mothers-day-seasonality (en el trigger) |

---

## 4. Variables de entorno opcionales (Mothers Day)

- **NEXT_PUBLIC_MOTHERS_DAY_CSV_URL:** URL pública (CSV) de tu Google Sheet de planes Mother's Day.
- **NEXT_PUBLIC_MOTHERS_DAY_CATEGORIES_CSV_URL:** URL del sheet de traducciones de categorías (si usas uno distinto).
- **NEXT_PUBLIC_GA_MEASUREMENT_ID:** ID de GA4 para este sitio (si es distinto al de Valentines).

Configúralas en Cloud Run (Variables & Secrets) o en el trigger si las inyectas en el build.
