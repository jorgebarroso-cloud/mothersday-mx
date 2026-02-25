# Preview de la web online

Cómo obtener un enlace público para enseñar el sitio (por ejemplo a tu jefe).

---

## Opción 1: GitHub Pages (ya configurado)

El workflow `.github/workflows/deploy-preview.yml` despliega la rama **feature/colvin-design** a GitHub Pages cada vez que haces push.

### Activar GitHub Pages (solo una vez)

1. En GitHub: **Settings** del repositorio → **Pages** (menú izquierdo).
2. En **Build and deployment** → **Source**: elige **GitHub Actions**.
3. Guarda. No hace falta elegir rama: el workflow se encarga del despliegue.

### Enlace de preview

Cuando el workflow termine (unos minutos después del push), el sitio estará en:

- **Si el repo es `jorgebarroso-cloud/mothersday-uk`:**
  **https://jorgebarroso-cloud.github.io/mothersday-uk/**

- **Si el repo es `mario-palencia/mothersday-uk`:**
  **https://mario-palencia.github.io/mothersday-uk/**

Sustituye `usuario` y `repo` por tu usuario y nombre del repo en GitHub.

Puedes enviar ese enlace a tu jefe para que vea el preview.

---

## Opción 2: Vercel (preview en raíz, sin /repo/)

Si prefieres una URL del tipo `https://mothersday-uk-xxx.vercel.app` (sin carpeta en la ruta):

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. **Add New** → **Project** → importa el repo **mothersday-uk**.
3. Deja las opciones por defecto (Framework: Other, Root Directory: .) y **Deploy**.
4. Te dará una URL de producción y, si conectas la rama, una URL de preview por rama (ej. `feature-colvin-design-mothersday-uk.vercel.app`).

Así puedes pasar un solo link de preview sin depender de GitHub Pages.
