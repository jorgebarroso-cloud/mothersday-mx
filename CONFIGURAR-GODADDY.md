# Guía Paso a Paso: Configurar Dominio en GoDaddy para Google Cloud Platform (GCP)

## 📋 Paso 1: Acceder a la Gestión de DNS en GoDaddy

1. Ve a [https://www.godaddy.com](https://www.godaddy.com)
2. Inicia sesión en tu cuenta
3. Ve a **"Mis Productos"** o **"My Products"**
4. Busca tu dominio `celebratevalentines.com` (o el que hayas comprado)
5. Haz clic en **"DNS"** o **"Manage DNS"**

## 📋 Paso 2: Obtener Configuración DNS de Google Cloud

Antes de configurar DNS, necesitas obtener los valores correctos de Google Cloud:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Navega a tu servicio (Cloud Run, Cloud Load Balancer, etc.)
4. Ve a la sección de **Dominios** o **Custom Domains**
5. Google Cloud te proporcionará los valores específicos para configurar DNS

## 📋 Paso 3: Configurar Registros DNS según Google Cloud

Sigue las instrucciones específicas que Google Cloud te proporciona. Las opciones comunes son:

### Para Cloud Run:
- **Tipo CNAME**: Apunta a la URL proporcionada por Google Cloud
- **Tipo A**: Si Google Cloud proporciona IPs específicas

### Para Cloud Load Balancer:
- **Tipo A**: Apunta a las IPs del Load Balancer proporcionadas por Google Cloud

## 📋 Paso 4: Verificar los Registros

Tu configuración DNS dependerá de lo que Google Cloud te indique. Asegúrate de seguir exactamente sus instrucciones.

## 📋 Paso 5: Configurar el Dominio en Google Cloud

1. Ve a Google Cloud Console
2. Navega a tu servicio (Cloud Run, etc.)
3. Configura el dominio personalizado según las instrucciones de Google Cloud
4. Google Cloud verificará automáticamente el dominio una vez que los DNS estén configurados

## ⏱️ Paso 6: Esperar la Propagación DNS

- **Tiempo estimado**: 5 minutos a 48 horas
- **Normalmente**: 1-2 horas
- **Verifica el progreso en**: https://www.whatsmydns.net/#A/celebratevalentines.com

## ✅ Paso 7: Verificar que Funciona

1. Espera al menos 10-15 minutos después de configurar DNS
2. Visita: `https://celebratevalentines.com`
3. También prueba: `https://www.celebratevalentines.com` (si está configurado)
4. Verifica que todas las páginas carguen correctamente

## 🔍 Solución de Problemas

### El dominio no carga después de 2 horas
- Verifica que los registros DNS estén correctos según las instrucciones de Google Cloud
- Verifica que los valores coincidan exactamente con lo que Google Cloud proporcionó
- Usa https://www.whatsmydns.net para ver si los DNS se han propagado

### Error de certificado SSL
- Google Cloud gestiona los certificados SSL automáticamente
- Puede tardar algunas horas después de que el DNS esté configurado
- Verifica que el dominio esté verificado en Google Cloud Console

### El sitio carga pero las imágenes no aparecen
- Verifica que el servicio esté desplegado correctamente en Google Cloud
- Revisa los logs en Google Cloud Console
- Limpia la caché del navegador (Ctrl+Shift+Delete)

## 🎯 Resumen Rápido

1. ✅ Obtén la configuración DNS de Google Cloud Console
2. ✅ Configura los registros DNS en GoDaddy según las instrucciones de Google Cloud
3. ✅ Configura el dominio en Google Cloud Console
4. ✅ Espera 1-2 horas para la propagación DNS
5. ✅ Verifica que el sitio carga correctamente

¡Listo! Tu dominio estará conectado a Google Cloud Platform.
