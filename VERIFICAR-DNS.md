# Verificar Configuración DNS - Google Cloud Platform (GCP)

## 🔍 Verificación Rápida

### Paso 1: Obtener Configuración DNS de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Navega a tu servicio (Cloud Run, Cloud Load Balancer, etc.)
4. Ve a la sección de **Dominios** o **Custom Domains**
5. Google Cloud te mostrará los valores específicos que necesitas configurar en DNS

### Paso 2: Verificar en tu Proveedor de Dominio (GoDaddy, etc.)

1. Inicia sesión en tu proveedor de dominio
2. Ve a **Gestión de DNS** o **Manage DNS**
3. Verifica que los registros coincidan exactamente con lo que Google Cloud indica

### Paso 3: Tipos de Registros Comunes

**Para Cloud Run:**
- Puede requerir registros CNAME o A según la configuración

**Para Cloud Load Balancer:**
- Generalmente requiere registros A que apunten a las IPs del Load Balancer

**IMPORTANTE:**
- Los valores exactos dependen de tu configuración específica en Google Cloud
- Sigue exactamente las instrucciones que Google Cloud te proporciona

## 🔧 Comandos de Verificación

### Desde PowerShell (Windows):

```powershell
# Verificar registros A
nslookup -type=A celebratevalentines.com

# Verificar registro CNAME (si aplica)
nslookup -type=CNAME www.celebratevalentines.com

# Verificar desde servidor DNS específico
nslookup celebratevalentines.com 8.8.8.8
```

### Resultado Esperado:

Los resultados deben coincidir con los valores que Google Cloud te proporcionó.

## 🌐 Verificación Online

Usa estas herramientas para verificar propagación global:

1. **What's My DNS**: https://www.whatsmydns.net/#A/celebratevalentines.com
   - Debe mostrar los valores correctos en la mayoría de servidores

2. **DNS Checker**: https://dnschecker.org/#A/celebratevalentines.com
   - Verifica desde múltiples ubicaciones

3. **MXToolbox**: https://mxtoolbox.com/SuperTool.aspx?action=a%3acelebratevalentines.com
   - Herramienta profesional de verificación DNS

## ⚠️ Problemas Comunes

### Problema 1: Los valores no coinciden con Google Cloud
**Solución**: Actualiza los registros DNS para que coincidan exactamente con lo que Google Cloud indica

### Problema 2: DNS no se propaga
**Solución**: 
- Espera 24-48 horas para propagación completa
- Verifica que los TTL estén configurados correctamente
- Limpia el cache DNS: `ipconfig /flushdns` (Windows)

### Problema 3: El dominio no funciona
**Solución**: 
- Verifica que todos los registros estén configurados según Google Cloud
- Asegúrate de que el dominio esté verificado en Google Cloud Console

## 📋 Checklist Final

- [ ] Obtener configuración DNS de Google Cloud Console
- [ ] Configurar registros DNS según las instrucciones de Google Cloud
- [ ] Verificar que los valores coincidan exactamente
- [ ] Verificación online muestra los valores correctos
- [ ] Esperar 24-48 horas para propagación completa

## 🚨 Si los DNS Están Correctos pero el Error Persiste

El error `ERR_SSL_UNRECOGNIZED_NAME_ALERT` significa que:
1. Los DNS están correctos ✅
2. El certificado SSL aún no está activo ⏳

**Solución**: Espera algunas horas para que Google Cloud active el certificado SSL automáticamente.

Mientras tanto, puedes acceder temporalmente por HTTP (aunque mostrará "Not Secure").
