# Configurar Cloud Build Trigger para Despliegue Automático

## 🔴 Problema
El despliegue automático no se está ejecutando porque falta la configuración del trigger en Google Cloud Console.

## ✅ Solución: Configurar el Trigger

### Paso 1: Ir a Cloud Build Triggers

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Navega a **Cloud Build** → **Triggers**

### Paso 2: Crear Nuevo Trigger

1. Haz clic en **"Create Trigger"** (Crear Trigger)
2. Completa la configuración:

#### Configuración Básica:
- **Nombre**: `celebrate-valentines-deploy` (o el nombre que prefieras)
- **Descripción**: "Despliegue automático de celebrate-valentines a Cloud Run"

#### Evento:
- **Event**: Push to a branch
- **Source**: GitHub (conecta tu repositorio si no está conectado)
- **Repository**: `mario-palencia/celebrate-valentines`
- **Branch**: `^main$` (solo la rama main)

#### Configuración:
- **Type**: Cloud Build configuration file (yaml or json)
- **Location**: Repository
- **Cloud Build configuration file**: `cloudbuild.yaml`

#### Variables de Sustitución (Opcional pero Recomendado):
Agrega estas variables si tu configuración es diferente:

```
_SERVICE_NAME=celebrate-valentines
_REGION=us-east4
_REPOSITORY=docker-repo
```

**Nota**: Ajusta estos valores según tu configuración:
- `_REGION`: La región donde está tu Artifact Registry (puede ser `us-central1`, `us-east4`, etc.)
- `_REPOSITORY`: El nombre de tu repositorio en Artifact Registry

### Paso 3: Verificar Permisos

Asegúrate de que el Service Account de Cloud Build tenga los permisos necesarios:

1. Ve a **IAM & Admin** → **IAM**
2. Busca el Service Account: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`
3. Verifica que tenga estos roles:
   - `Cloud Run Admin` (para desplegar)
   - `Service Account User` (para ejecutar Cloud Run)
   - `Artifact Registry Writer` (para subir imágenes)

### Paso 4: Verificar Artifact Registry

Si usas Artifact Registry (recomendado):

1. Ve a **Artifact Registry** → **Repositories**
2. Verifica que exista un repositorio llamado `docker-repo` (o ajusta `_REPOSITORY` en el trigger)
3. Si no existe, créalo:
   ```bash
   gcloud artifacts repositories create docker-repo \
     --repository-format=docker \
     --location=us-east4
   ```

### Paso 5: Probar el Trigger

1. Haz un pequeño cambio en el código
2. Haz commit y push a `main`
3. Ve a **Cloud Build** → **History**
4. Deberías ver un nuevo build ejecutándose automáticamente

## 🔄 Alternativa: Usar Container Registry (gcr.io)

Si prefieres usar Container Registry en lugar de Artifact Registry, puedes modificar el `cloudbuild.yaml` o crear un trigger con estas variables:

```
_SERVICE_NAME=celebrate-valentines
_REGION=us-east4
_REPOSITORY=gcr.io/${PROJECT_ID}
```

Y actualizar el `cloudbuild.yaml` para usar `gcr.io` en lugar de Artifact Registry.

## 🆘 Solución de Problemas

### El trigger no se ejecuta
- Verifica que el branch sea exactamente `main`
- Verifica que el archivo `cloudbuild.yaml` esté en la raíz del repositorio
- Revisa los logs del trigger en Cloud Build → Triggers → [Tu Trigger] → History

### Error de permisos
- Verifica los roles del Service Account de Cloud Build
- Asegúrate de que las APIs estén habilitadas:
  - Cloud Build API
  - Cloud Run API
  - Artifact Registry API (o Container Registry API)

### Error "Repository not found"
- Verifica que el nombre del repositorio en Artifact Registry coincida con `_REPOSITORY`
- Crea el repositorio si no existe

### Error "Service not found" en Cloud Run
- El servicio se creará automáticamente en el primer despliegue
- Si ya existe, asegúrate de que el nombre coincida con `_SERVICE_NAME`

## ✅ Verificación

Una vez configurado correctamente:

1. Haz push a `main`
2. Ve a **Cloud Build** → **History**
3. Deberías ver un build ejecutándose automáticamente
4. El build debería completarse en 3-5 minutos
5. Verifica en **Cloud Run** que el servicio se haya actualizado
