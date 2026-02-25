# Crear el repositorio mothersday-uk en tu GitHub

Solo tienes que hacer **2 pasos** (una vez que hagas el paso 1, no tendrás que repetirlo en el futuro).

---

## Paso 1: Iniciar sesión en GitHub (solo la primera vez)

Abre una **terminal** en esta carpeta (o en Cursor: Terminal → New Terminal) y ejecuta:

```powershell
gh auth login
```

- Pulsa **Enter** para GitHub.com.
- Elige **HTTPS**.
- Elige **Login with a web browser**.
- Copia el código que te muestre, pulsa Enter para abrir el navegador, pega el código y autoriza.

Cuando termine, verás algo como: `Logged in as jorgebarroso-cloud`.

---

## Paso 2: Crear el repo y subir el código

En la misma terminal:

```powershell
cd "c:\Users\FEVER\Documents\Mothers Day Seasonality"
.\scripts\crear-repo-mothersday-uk.ps1
```

El script creará el repositorio **mothersday-uk** en tu cuenta con la descripción indicada y subirá todo el código.

**URL del repo:** https://github.com/jorgebarroso-cloud/mothersday-uk

---

Si prefieres crear el repo a mano: ve a https://github.com/new, nombre **mothersday-uk**, descripción *Repository created for the generic landing page for Mother's Day seasonality in the UK.*, sin README. Luego ejecuta el script del paso 2 para configurar `origin` y hacer push.
