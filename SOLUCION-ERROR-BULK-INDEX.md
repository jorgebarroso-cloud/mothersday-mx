# 🔧 Solución al Error en Bulk Index App

## ❌ Error Identificado

```
File "/mount/src/seo-automations/bulk_index_app.py", line 35, in main
    credentials = service_account.Credentials.from_service_account_info(
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/home/adminuser/venv/lib/python3.11/site-packages/google/auth/_service_account_info.py", line 47, in from_dict
    missing = keys_needed.difference(data.keys())
```

## 🔍 Causa del Problema

La aplicación Streamlit (`bulk-index-app.streamlit.app`) está intentando leer **credenciales de Google Service Account** desde un archivo JSON, pero está recibiendo el archivo `urls_global.json` que solo contiene URLs.

### Archivos Necesarios

La aplicación requiere **DOS archivos diferentes**:

1. **Archivo de Credenciales de Google** (JSON)
   - Debe contener las credenciales de Google Service Account
   - Campos requeridos: `type`, `project_id`, `private_key_id`, `private_key`, `client_email`, etc.

2. **Archivo de URLs** (JSON o TXT)
   - `urls_global.json` ✅ (ya está creado y correcto)
   - O `URL INDEX CELEBRATE VALENTINES.txt` ✅ (ya existe y está correcto)

## ✅ Solución

### Opción 1: Usar el Archivo TXT (Más Simple)

1. En la aplicación Streamlit, busca **dos campos de entrada separados**:
   - **Campo 1:** "Google Service Account JSON" o "Credentials"
   - **Campo 2:** "URLs File" o "URLs List"

2. **NO subas `urls_global.json` en el campo de credenciales**

3. **Sube el archivo TXT** en el campo de URLs:
   - Archivo: `c:\Users\FEVER\Documents\URL INDEX CELEBRATE VALENTINES.txt`
   - Este archivo tiene el formato correcto (una URL por línea)

4. **Para el campo de credenciales**, necesitas un archivo JSON diferente con tus credenciales de Google.

### Opción 2: Obtener Credenciales de Google Service Account

Si no tienes el archivo de credenciales, créalo desde Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **IAM & Admin** → **Service Accounts**
4. Crea una nueva Service Account o selecciona una existente
5. Ve a **Keys** → **Add Key** → **Create new key**
6. Selecciona formato **JSON**
7. Descarga el archivo JSON

**IMPORTANTE:** Este archivo JSON tendrá un formato como este:

```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "tu-service-account@tu-proyecto.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### Opción 3: Verificar Permisos de la Service Account

Asegúrate de que la Service Account tenga los permisos necesarios para usar la Google Indexing API:

1. Ve a **IAM & Admin** → **IAM**
2. Busca tu Service Account
3. Verifica que tenga el rol: **"Indexing Service Account"** o permisos para usar la API

## 📋 Checklist para Usar la Aplicación

- [ ] Tienes el archivo JSON de credenciales de Google Service Account
- [ ] La Service Account tiene permisos para usar Google Indexing API
- [ ] Subes el archivo de **credenciales** en el campo correcto
- [ ] Subes el archivo de **URLs** (TXT o JSON) en el campo correcto
- [ ] El archivo de URLs tiene el formato correcto (una URL por línea o array JSON)

## 🔗 Archivos Disponibles

### ✅ Archivo de URLs (Listo para usar)

1. **TXT:** `c:\Users\FEVER\Documents\URL INDEX CELEBRATE VALENTINES.txt`
   - Formato: Una URL por línea
   - Total: 132 URLs

2. **JSON:** `c:\Users\FEVER\Documents\Valentines_def\urls_global.json`
   - Formato: Array JSON válido
   - Total: 132 URLs

### ⚠️ Archivo de Credenciales (Necesitas crearlo)

- Debes descargarlo desde Google Cloud Console
- No está en el repositorio por seguridad
- Formato: JSON con credenciales de Service Account

## 🚨 Nota Importante

**NO uses `urls_global.json` como archivo de credenciales.** Son dos archivos completamente diferentes:

- **`urls_global.json`** → Lista de URLs (para indexar)
- **Credenciales JSON** → Credenciales de Google (para autenticación)

---

**Fecha:** 2026-01-27  
**Estado:** ✅ Archivos de URLs listos | ⚠️ Falta archivo de credenciales
