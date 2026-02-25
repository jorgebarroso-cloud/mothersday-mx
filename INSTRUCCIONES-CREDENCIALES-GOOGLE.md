# 🔑 Instrucciones para Obtener las Credenciales de Google

## ⚠️ IMPORTANTE

El archivo `google-service-account-credentials.json` que acabo de crear es solo una **PLANTILLA**. Debes reemplazarlo con tus credenciales reales de Google Cloud.

## 📋 Pasos para Obtener las Credenciales

### Paso 1: Ir a Google Cloud Console

1. Abre tu navegador y ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto correcto (el que usa `celebratevalentines.com`)

### Paso 2: Crear o Seleccionar Service Account

1. En el menú lateral, ve a **IAM & Admin** → **Service Accounts**
2. Si ya tienes una Service Account, selecciónala
3. Si no tienes una, haz clic en **"Create Service Account"**:
   - **Name**: `indexing-service-account` (o el nombre que prefieras)
   - **Description**: "Service account for Google Indexing API"
   - Haz clic en **"Create and Continue"**

### Paso 3: Asignar Permisos

1. En la sección **"Grant this service account access to project"**, agrega el rol:
   - **"Indexing Service Account"** o **"Service Account User"**
2. Haz clic en **"Continue"** y luego en **"Done"**

### Paso 4: Crear y Descargar la Clave JSON

1. Haz clic en la Service Account que acabas de crear/seleccionar
2. Ve a la pestaña **"Keys"**
3. Haz clic en **"Add Key"** → **"Create new key"**
4. Selecciona **JSON** como formato
5. Haz clic en **"Create"**
6. **Se descargará automáticamente** un archivo JSON con tus credenciales

### Paso 5: Reemplazar la Plantilla

1. El archivo descargado tendrá un nombre como: `tu-proyecto-xxxxx-xxxxx.json`
2. **Renombra** ese archivo a: `google-service-account-credentials.json`
3. **Reemplaza** el archivo en `c:\Users\FEVER\Documents\Valentines_def\` con el archivo descargado
4. O simplemente **copia el contenido** del archivo descargado y pégalo en `google-service-account-credentials.json`

### Paso 6: Verificar el Formato

El archivo JSON debe tener esta estructura (con tus valores reales):

```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-real-123456",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "indexing-service-account@tu-proyecto-real.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## ✅ Verificación

Una vez que tengas el archivo con tus credenciales reales:

1. ✅ El archivo debe llamarse: `google-service-account-credentials.json`
2. ✅ Debe estar en: `c:\Users\FEVER\Documents\Valentines_def\`
3. ✅ Debe ser un JSON válido (puedes verificarlo abriéndolo en un editor)
4. ✅ NO debe tener los valores "REEMPLAZA_CON_TU_..." (deben ser valores reales)

## 🚀 Uso en la Aplicación Streamlit

Una vez que tengas ambos archivos listos:

1. **Archivo de URLs**: `urls-para-indexar.txt` ✅ (ya está listo)
2. **Archivo de Credenciales**: `google-service-account-credentials.json` ⚠️ (debes completarlo)

Arrastra ambos archivos a la aplicación en:
- https://bulk-index-app.streamlit.app/

## 🔒 Seguridad

⚠️ **IMPORTANTE**: El archivo de credenciales contiene información sensible:
- **NO** lo subas a GitHub
- **NO** lo compartas públicamente
- **NO** lo incluyas en commits de Git
- Guárdalo de forma segura

El archivo ya está en `.gitignore` para evitar que se suba accidentalmente.

---

**Fecha:** 2026-01-27  
**Estado:** ⚠️ Debes completar el archivo de credenciales con tus datos reales de Google Cloud
