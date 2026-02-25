# Guía para Subir a GitHub y Desplegar Online

## ✅ Paso 1: Crear Repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. **Nombre del repositorio**: `celebrate-valentines` (o el nombre que prefieras)
3. **Descripción**: "Valentine's Day landing page with city-specific content"
4. ⚠️ **IMPORTANTE**: NO marques las opciones:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. Haz clic en **"Create repository"**

## ✅ Paso 2: Conectar el Repositorio Local con GitHub

Tienes dos opciones:

### Opción A: Usar el Script Automático (Recomendado)

Ejecuta en PowerShell:
```powershell
.\configurar-github-repo.ps1
```

Cuando te pida la URL, pega la URL de tu repositorio (ejemplo: `https://github.com/TU_USUARIO/celebrate-valentines.git`)

### Opción B: Comandos Manuales

```bash
git remote add origin https://github.com/TU_USUARIO/celebrate-valentines.git
git branch -M main
git push -u origin main
```

## ✅ Paso 3: Desplegar en Vercel (Gratis y Automático)

### Opción A: Desde la Web (Más Fácil)

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Elige **"Continue with GitHub"** para conectar tu cuenta
4. Una vez dentro, haz clic en **"Add New Project"**
5. Selecciona tu repositorio `celebrate-valentines`
6. Vercel detectará automáticamente:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `.next`
7. Haz clic en **"Deploy"**
8. ⏱️ Espera 2-3 minutos mientras se despliega
9. ✅ ¡Listo! Tu sitio estará online en: `https://celebrate-valentines.vercel.app`

### Opción B: Desde la Terminal (CLI)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
```

## 🌐 Personalizar el Dominio

Después del deploy, puedes:

1. Ir a tu proyecto en Vercel
2. Settings → Domains
3. Agregar tu dominio personalizado (ej: `celebratevalentines.com`)
4. Seguir las instrucciones para configurar DNS

## 📝 Notas Importantes

- ✅ **Vercel es gratis** para proyectos personales
- ✅ **Deploy automático**: Cada vez que hagas `git push`, Vercel desplegará automáticamente
- ✅ **HTTPS incluido**: Tu sitio tendrá certificado SSL automático
- ✅ **CDN global**: Tu sitio se carga rápido desde cualquier parte del mundo

## 🔄 Actualizar el Sitio

Cada vez que quieras actualizar el sitio online:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel detectará automáticamente el cambio y desplegará la nueva versión en 2-3 minutos.

## 🆘 Solución de Problemas

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que tienes permisos de escritura
- Verifica que la URL del remote es correcta

### Error al hacer push
- Verifica tu autenticación de GitHub:
  ```bash
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu@email.com"
  ```

### El sitio no carga en Vercel
- Revisa los logs en el dashboard de Vercel
- Verifica que `npm run build` funciona localmente
- Asegúrate de que todas las variables de entorno estén configuradas

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GitHub Guides](https://guides.github.com)
