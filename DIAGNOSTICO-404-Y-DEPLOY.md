# Diagnóstico: Error 404 en producción y deploy que no actualiza

## Resumen

Hay **dos causas** principales:

1. **El deploy no se ejecuta** porque el trigger de Cloud Build está configurado para la rama **`main`**, pero el repositorio usa **`master`** como rama por defecto. Los pushes a `master` no disparan el build.
2. **El 404** puede deberse a que no existía `not-found.tsx`, por lo que el export estático no generaba `404.html` y nginx no podía servir una página de error correcta para rutas inexistentes.

---

## 1. Por qué no se despliega la última versión estable

### Causa: Rama del trigger ≠ rama por defecto

- En tu repo, **`origin/HEAD` apunta a `origin/master`** → la rama por defecto en GitHub es **`master`**.
- La documentación del proyecto indica que el trigger de Cloud Build está configurado con **Branch: `^main$`** (solo la rama `main`).
- Consecuencia: cada vez que haces **push a `master`**, **no se ejecuta ningún build**. Solo se despliega cuando alguien hace push a **`main`**. Por eso producción puede seguir con una versión antigua.

### Qué hacer

**Opción A – Usar `main` para desplegar (recomendado)**  
1. En GitHub: **Settings → Default branch** → cambiar a **`main`**.  
2. Si todo tu trabajo está en `master`:  
   - Crear/actualizar `main` desde `master`:  
     `git checkout main && git merge master && git push origin main`  
   - O hacer push de `master` a `main`:  
     `git push origin master:main`  
3. A partir de ahí, trabajar en `main` y hacer push a `main` para que Cloud Build despliegue.

**Opción B – Hacer que el trigger use `master`**  
1. En Google Cloud Console: **Cloud Build → Triggers**.  
2. Editar el trigger que despliega celebrate-valentines.  
3. En **Event → Branch**, cambiar `^main$` por **`^master$`** y guardar.  
4. A partir de entonces, cada push a `master` disparará el deploy.

Comprueba en **Cloud Build → History** que, tras un push a la rama configurada, aparece un nuevo build y termina en éxito.

---

## 2. Por qué aparece 404 en el sitio en producción

### Posibles causas

1. **Rutas no generadas**  
   Con `output: 'export'`, solo existen las rutas que Next.js genera en el build (p. ej. con `generateStaticParams`). Una URL que no coincida con ninguna ruta generada (locale o ciudad inexistente, typo, etc.) no tendrá HTML en `out/` y nginx devolverá 404.

2. **Falta de página 404**  
   Nginx está configurado con `error_page 404 /404.html`. Si en el export estático **no existe** `404.html` (porque no había `not-found.tsx` en el App Router), nginx no puede servir una página 404 personalizada y se ve el 404 por defecto o un comportamiento raro.

3. **Trailing slash**  
   La app usa `trailingSlash: true`. Si en producción se accede sin barra final (p. ej. `/en/madrid` en vez de `/en/madrid/`), según la configuración de nginx puede no encontrarse el archivo y devolverse 404.

### Qué se ha hecho en el proyecto

- Se ha añadido **`src/app/not-found.tsx`** para que, con `output: 'export'`, Next.js genere **`404.html`** en la raíz de `out/`. Así nginx puede servir una página 404 coherente con el resto del sitio cuando la ruta no existe.

### Qué revisar si sigues viendo 404

- **URL exacta** que devuelve 404 (con o sin barra final, locale, ciudad).  
- Que esa URL corresponda a un **locale** y **ciudad** que estén en `generateStaticParams` (y en `CITY_NAMES` / lista de ciudades).  
- En **Cloud Build → History**: que el último build haya terminado correctamente y que el servicio en Cloud Run esté usando la imagen de ese build (revisar revisión/etiqueta de la imagen desplegada).

---

## Checklist rápido

| Comprobación | Cómo verlo |
|--------------|------------|
| Rama del trigger | Cloud Build → Triggers → Branch (`main` o `master`) |
| Rama por defecto en GitHub | Repo → Settings → Default branch |
| Último build exitoso | Cloud Build → History |
| Imagen desplegada en producción | Cloud Run → celebrate-valentines → Revisions / Image |
| Existencia de `404.html` en el build | Revisar en el paso del Dockerfile que copia `out/` (o artefacto del build) |

Si quieres, en el siguiente paso podemos revisar juntos la URL concreta que devuelve 404 y la configuración exacta del trigger (rama y nombre del repo).
