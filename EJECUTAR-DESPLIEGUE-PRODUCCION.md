# 🚀 Ejecutar Despliegue a Producción

## ✅ Estado Actual

- ✅ Código desplegado en GitHub (rama `main`)
- ✅ Último commit: `6fc38f6` - "Remove GitHub Actions workflow for GitHub Pages deployment"
- ✅ Sin referencias a GitHub Pages
- ✅ Dockerfile y nginx.conf configurados para GCP

## 🔄 Opción 1: Despliegue Automático (Recomendado)

El trigger de Cloud Build debería ejecutarse automáticamente cuando se hace push a `main`. 

**Verifica en Google Cloud Console:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Cloud Build → History
3. Busca el build más reciente (debería estar ejecutándose o completado)

## 🚀 Opción 2: Ejecutar Despliegue Manualmente

Si el trigger no se ejecuta automáticamente, puedes ejecutarlo manualmente:

### Desde Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **Cloud Build** → **Triggers**
4. Busca el trigger relacionado con `celebrate-valentines`
   - Nombre del trigger puede ser: `rmgpgab-celebrate-valentines-us-east4-mario-palencia-celebralhz` o similar
5. Haz clic en el trigger
6. Haz clic en **Run** (botón de ejecutar)
7. Selecciona:
   - **Branch**: `main`
   - **Commit**: El más reciente (o déjalo en "HEAD")
8. Haz clic en **Run**

### Desde la Terminal (si tienes gcloud CLI instalado):

```bash
# Listar triggers disponibles
gcloud builds triggers list

# Ejecutar el trigger manualmente (reemplaza TRIGGER_NAME con el nombre real)
gcloud builds triggers run TRIGGER_NAME \
  --branch=main \
  --region=us-east4
```

## ⏱️ Tiempo de Despliegue

- **Build**: 2-3 minutos
- **Push**: 30 segundos - 1 minuto
- **Deploy**: 1-2 minutos
- **Total**: 3-5 minutos aproximadamente

## 🔍 Verificar el Despliegue

### Durante el Build:

1. Ve a **Cloud Build** → **History**
2. Haz clic en el build en ejecución
3. Revisa los logs en tiempo real:
   - **Step 0: Build** - Construcción de la imagen Docker
   - **Step 1: Push** - Subida a Container Registry
   - **Step 2: Deploy** - Despliegue a Cloud Run

### Después del Despliegue:

1. Ve a **Cloud Run** en Google Cloud Console
2. Busca el servicio `celebrate-valentines`
3. Verifica:
   - ✅ Estado: "Serving traffic"
   - ✅ Última revisión desplegada
   - ✅ URL del servicio

### Verificar el Sitio:

1. Visita: https://celebratevalentines.com
2. Verifica que los cambios estén aplicados
3. Revisa la consola del navegador para errores

## 🆘 Si el Despliegue Falla

### Revisar Logs:

1. En Cloud Build → History → Build fallido
2. Revisa cada paso para identificar el error:
   - **Build**: Verifica que el Dockerfile esté correcto
   - **Push**: Verifica permisos de Container Registry
   - **Deploy**: Verifica que el contenedor escuche en el puerto 8080

### Errores Comunes:

**Error: "Container failed to start"**
- Verifica que nginx escuche en el puerto 8080
- Revisa los logs de Cloud Run para más detalles

**Error: "Permission denied"**
- Verifica que el Service Account tenga los permisos correctos
- Verifica que las APIs estén habilitadas

**Error: "Image not found"**
- Verifica que el build se haya completado correctamente
- Verifica que la imagen se haya subido a Container Registry

## ✅ Despliegue Exitoso

Una vez completado el despliegue:

- ✅ El servicio estará disponible en: https://celebratevalentines.com
- ✅ Los cambios estarán visibles en producción
- ✅ Puedes verificar la nueva revisión en Cloud Run

## 📝 Notas Importantes

- El despliegue es automático cuando se hace push a `main`
- Si necesitas desplegar manualmente, usa la opción 2
- Los cambios se reflejan inmediatamente después del despliegue
- El servicio se actualiza sin downtime (rolling update)
