# Guía para Conectar Dominio Personalizado a Google Cloud Platform (GCP)

## 📋 Pasos para Conectar tu Dominio

### Paso 1: Configurar el Dominio en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **Cloud Run** o **Cloud Load Balancer** (dependiendo de tu configuración)
4. Configura tu dominio personalizado en el servicio correspondiente
5. Sigue las instrucciones de Google Cloud para verificar el dominio

### Paso 2: Configurar DNS en tu Proveedor de Dominio

Necesitas crear registros DNS en tu proveedor de dominio (GoDaddy, Namecheap, etc.) según las instrucciones que Google Cloud te proporcione.

**Para Cloud Run:**
- Google Cloud te proporcionará los valores específicos para configurar DNS
- Puede requerir registros CNAME o A según tu configuración

**Para Cloud Load Balancer:**
- Configura registros A que apunten a las IPs del Load Balancer
- Google Cloud te proporcionará las IPs específicas

### Paso 3: Esperar la Propagación DNS

- Puede tardar entre 5 minutos y 48 horas
- Usa herramientas como [whatsmydns.net](https://www.whatsmydns.net) para verificar

### Paso 4: Verificar HTTPS

Google Cloud configurará automáticamente HTTPS para tu dominio mediante certificados SSL gestionados.

## ⚙️ Configuración Técnica

Una vez configurado el dominio, el código se actualizará automáticamente para:
- Remover el `basePath` cuando se use dominio personalizado
- Actualizar todas las URLs internas
- Configurar correctamente el sitemap y robots.txt

## 🔍 Verificar que Funciona

1. Espera 5-10 minutos después de configurar DNS
2. Visita tu dominio: `https://celebratevalentines.com`
3. Verifica que todas las páginas carguen correctamente
4. Verifica que las imágenes y recursos se carguen

## 🆘 Solución de Problemas

### El dominio no carga
- Verifica que los registros DNS estén correctos según las instrucciones de Google Cloud
- Espera más tiempo para la propagación DNS
- Verifica en Google Cloud Console que el dominio esté verificado

### Error de certificado SSL
- Google Cloud gestiona los certificados SSL automáticamente
- Verifica que el dominio esté correctamente configurado en Google Cloud
- Los certificados pueden tardar algunas horas en activarse

### Las páginas no cargan correctamente
- Verifica que el servicio esté desplegado correctamente en Google Cloud
- Revisa los logs en Google Cloud Console
- Asegúrate de que el build se haya completado exitosamente
