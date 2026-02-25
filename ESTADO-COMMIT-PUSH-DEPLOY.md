# Estado: commit, push y deploy (cookies / legal)

## ✅ Commit — SÍ realizado

- **Commit:** `21bcfde`
- **Fecha:** 3 feb 2026, 17:14
- **Mensaje:** Legal: política cookies, consent GA4, footer y sitemap…

**Archivos incluidos (18):**
- `src/app/[locale]/legal/cookies/page.tsx` (nueva)
- `src/components/compliance/cookie-consent-banner.tsx` (nueva)
- `src/components/compliance/ga-consent-gate.tsx` (nueva)
- `src/lib/cookies.ts` (nueva)
- `src/app/layout.tsx` (GAConsentGate, redirección)
- `src/app/[locale]/layout.tsx` (banner)
- `src/app/sitemap.ts` (URLs /legal/cookies/)
- `src/components/layout/footer.tsx` (Cookie Policy, Do Not Sell, Terms/Privacy)
- `src/components/seo/hreflang-links.tsx`
- `src/messages/*.json` (en, es, fr, de, it, pt) — LegalCookies, etc.
- Docs: VERIFICACION-ESTABILIDAD-*.md, REVISION-CRAWLABILIDAD-POST-DEPLOY.md

---

## ✅ Push — SÍ realizado

- **Remoto:** `origin` → `https://github.com/mario-palencia/celebrate-valentines.git`
- **Rama:** `main`
- **Estado:** `origin/main` está en el mismo commit `21bcfde` que tu `main` local.

El código de cookies/legal está en GitHub.

---

## ⚠️ Deploy en producción — hay que comprobarlo

El deploy **no lo hace Git**: lo hace **Google Cloud Build** cuando detecta un push a `main`.

- Si el trigger está activo y asociado a la rama `main`, **debería** haberse ejecutado al hacer push.
- Si el trigger falló, está desactivado o no está ligado a este repo/rama, **producción puede seguir con la versión anterior**.

**Qué hacer:**

1. **Comprobar si el deploy se ejecutó**
   - Google Cloud Console → **Cloud Build** → **History**
   - Buscar un build reciente (después del 3 feb 2026) con el commit `21bcfde` o el mensaje "Legal: política cookies…".
   - Si el build está en verde (éxito), el deploy a Cloud Run ya se hizo con esa versión.

2. **Forzar un deploy con el código actual (recomendado)**
   - Cloud Build → **Triggers**
   - Abrir el trigger de celebrate-valentines
   - Pulsar **Run** (ejecutar manualmente) y elegir rama `main`
   - Así se vuelve a construir la imagen y se despliega en Cloud Run con el commit `21bcfde`.

3. **Comprobar en producción**
   - Abrir: `https://celebratevalentines.com/en/legal/cookies/`
   - Si ves la página de política de cookies, el banner de cookies y los enlaces del footer (Cookie Policy, Do Not Sell), la versión desplegada es la de cookies/legal.

---

## Resumen

| Paso    | Estado | Nota |
|--------|--------|------|
| Commit | ✅ Hecho | `21bcfde` con todos los cambios de cookies/legal |
| Push   | ✅ Hecho | `main` en GitHub = `21bcfde` |
| Deploy | ⚠️ Por confirmar | Revisar Cloud Build History o lanzar el trigger manualmente |

Si quieres, el siguiente paso es ejecutar el trigger manualmente en Cloud Build para asegurar que producción tiene exactamente esta versión.
