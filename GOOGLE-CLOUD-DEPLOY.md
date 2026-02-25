# Google Cloud Deployment - Celebrate Valentine's

## 📦 Archivos Creados

1. **Dockerfile**: Multi-stage build para Next.js static export
2. **nginx.conf**: Configuración de Nginx para servir archivos estáticos
3. **.dockerignore**: Archivos a excluir del build de Docker
4. **next.config.js**: Actualizado para soportar builds en Docker

## 🚀 Configuración del Dockerfile

El Dockerfile usa un build multi-stage:
- **Stage 1 (builder)**: Construye la aplicación Next.js
- **Stage 2 (production)**: Usa Nginx para servir los archivos estáticos

## ⚙️ Configuración para Google Cloud

### Variables de Entorno en Dockerfile

- `DOCKER=true`: Activa el modo de export estático
- `NODE_ENV=production`: Modo producción
- `CUSTOM_DOMAIN=true`: Sin basePath (para dominio personalizado)

### Puerto

El contenedor expone el puerto **80** (estándar para HTTP).

## 📋 Comandos Útiles

### Build Local (para probar)

```bash
docker build -t celebrate-valentines .
docker run -p 8080:80 celebrate-valentines
```

Luego accede a: `http://localhost:8080`

### Push a Google Cloud

Dependiendo de tu configuración en Google Cloud:

1. **Cloud Run**:
   ```bash
   gcloud run deploy celebrate-valentines \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Cloud Build + Container Registry**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/celebrate-valentines
   ```

3. **Artifact Registry**:
   ```bash
   gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT-ID/REPO/celebrate-valentines
   ```

## 🔧 Configuración de Nginx

El archivo `nginx.conf` incluye:
- Compresión Gzip
- Headers de seguridad
- Cache para assets estáticos
- Manejo de rutas de Next.js
- Manejo de errores 404

## 📝 Notas Importantes

- El build genera archivos estáticos en `/app/out`
- Nginx sirve desde `/usr/share/nginx/html`
- Todas las rutas se resuelven a `index.html` (SPA behavior)
- Los assets estáticos tienen cache de 1 año

## 🌐 Dominio Personalizado

Si ya tienes el dominio configurado en Google Cloud:
- El Dockerfile está configurado para `basePath: ''`
- No necesita cambios adicionales
- Nginx maneja todas las rutas correctamente

## 🔍 Verificar el Deploy

Después del deploy, verifica:
1. El contenedor está corriendo
2. El sitio responde en el dominio configurado
3. Las rutas de Next.js funcionan correctamente
4. Los assets (CSS, JS, imágenes) se cargan

## 🆘 Troubleshooting

### El sitio no carga
- Verifica que el contenedor esté corriendo
- Revisa los logs: `gcloud run logs read SERVICE-NAME`
- Verifica que el puerto 80 esté expuesto

### Rutas no funcionan
- Verifica que `nginx.conf` esté copiado correctamente
- Revisa que `try_files` esté configurado correctamente

### Assets no cargan
- Verifica que los archivos estén en `/usr/share/nginx/html`
- Revisa las rutas en el código (deben ser relativas)
