# Verificar Despliegue a Producción

## ✅ Estado Actual

El código ya está desplegado en GitHub (rama `main`). El trigger de Cloud Build debería ejecutarse automáticamente.

## 🔍 Cómo Verificar el Despliegue

### Opción 1: Google Cloud Console (Recomendado)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **Cloud Build** → **History**
4. Busca el build más reciente (debería estar ejecutándose o completado)
5. Haz clic en el build para ver los detalles y logs

### Opción 2: Verificar Cloud Run

1. Ve a **Cloud Run** en Google Cloud Console
2. Busca el servicio `celebrate-valentines`
3. Verifica el estado y la URL del servicio
4. Haz clic en el servicio para ver los detalles

### Opción 3: Verificar el Sitio

1. Visita: https://celebratevalentines.com
2. Verifica que los cambios se hayan aplicado
3. Revisa la consola del navegador para errores

## 🚀 Si el Trigger No Se Ejecuta Automáticamente

Si el build no se inicia automáticamente, puedes ejecutarlo manualmente:

### Desde Google Cloud Console:

1. Ve a **Cloud Build** → **Triggers**
2. Busca el trigger: `rmgpgab-celebrate-valentines-us-east4-mario-palencia-celebralhz`
3. Haz clic en **Run** (o el botón de ejecutar)
4. Selecciona la rama `main` y el commit más reciente
5. Haz clic en **Run**

### Desde la Terminal (si tienes gcloud CLI):

```bash
# Ejecutar el trigger manualmente
gcloud builds triggers run TRIGGER_NAME \
  --branch=main \
  --region=us-east4
```

## ⏱️ Tiempo de Despliegue

- **Build**: 2-3 minutos
- **Deploy**: 1-2 minutos
- **Total**: 3-5 minutos aproximadamente

## 🔍 Verificar Logs del Despliegue

Si el despliegue falla, revisa los logs:

1. En Cloud Build → History → Build fallido → Logs
2. Busca errores específicos en los pasos:
   - **Build**: Construcción de la imagen Docker
   - **Push**: Subida a Container Registry
   - **Deploy**: Despliegue a Cloud Run

## ✅ Despliegue Exitoso

Una vez completado el despliegue:

1. El servicio estará disponible en: https://celebratevalentines.com
2. Los cambios estarán visibles en producción
3. Puedes verificar la nueva revisión en Cloud Run

## 🆘 Solución de Problemas

### El build no se ejecuta
- Verifica que el trigger esté activo
- Verifica que el trigger esté configurado para la rama `main`
- Ejecuta el trigger manualmente

### El build falla
- Revisa los logs en Cloud Build
- Verifica que el Dockerfile esté correcto
- Verifica que nginx.conf esté configurado correctamente

### El despliegue falla
- Revisa los logs de Cloud Run
- Verifica que el contenedor escuche en el puerto correcto (8080)
- Verifica los permisos del servicio
