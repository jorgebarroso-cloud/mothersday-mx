# Solucionar Error ERR_SSL_UNRECOGNIZED_NAME_ALERT en Google Cloud Platform (GCP)

## 🔴 Error Actual
`ERR_SSL_UNRECOGNIZED_NAME_ALERT` - El certificado SSL no reconoce el nombre del dominio.

## 🔍 Causas Posibles

1. **Certificado SSL aún no activado** (más común)
   - Google Cloud puede tardar algunas horas en emitir el certificado
   - El dominio está configurado pero el certificado aún no está listo

2. **DNS no propagado completamente**
   - Los registros DNS pueden no estar completamente propagados
   - Algunos servidores DNS aún no reconocen el dominio

3. **Configuración incorrecta en Google Cloud**
   - El dominio no está correctamente configurado en Google Cloud Console
   - Los registros DNS no coinciden con lo que Google Cloud espera

4. **Problema con el dominio raíz vs www**
   - Puede haber problemas con la configuración de dominio raíz vs subdominio

## ✅ Soluciones Paso a Paso

### Paso 1: Verificar Configuración en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Navega a tu servicio (Cloud Run, Cloud Load Balancer, etc.)
4. Verifica:
   - ✅ El dominio personalizado esté configurado
   - ✅ El estado del certificado SSL (puede estar en "Provisioning")
   - ✅ Los registros DNS coincidan con lo que Google Cloud indica

### Paso 2: Verificar DNS en tu Proveedor de Dominio

Verifica que los registros DNS estén correctos según las instrucciones de Google Cloud:

**Para Cloud Run:**
- Verifica los registros CNAME o A según lo que Google Cloud indique

**Para Cloud Load Balancer:**
- Verifica que los registros A apunten a las IPs correctas del Load Balancer

### Paso 3: Verificar Propagación DNS

Usa estas herramientas para verificar que los DNS estén propagados:

1. **What's My DNS**: https://www.whatsmydns.net/#A/celebratevalentines.com
   - Debe mostrar los valores correctos en la mayoría de servidores

2. **DNS Checker**: https://dnschecker.org/#A/celebratevalentines.com
   - Verifica propagación global

3. **Desde terminal (PowerShell)**:
```powershell
nslookup celebratevalentines.com
```

### Paso 4: Esperar Activación del Certificado

**IMPORTANTE**: Google Cloud puede tardar **algunas horas** en emitir el certificado SSL después de:
- Configurar el dominio en Google Cloud
- Verificar que los DNS estén correctamente propagados

**Mientras tanto, puedes:**
- Acceder temporalmente por HTTP: `http://celebratevalentines.com` (aunque mostrará "Not Secure")
- O esperar a que el certificado se active

### Paso 5: Forzar Re-emisión del Certificado (si pasa 24 horas)

Si después de 24 horas el certificado aún no está activo:

1. Ve a Google Cloud Console
2. **Elimina** el dominio personalizado temporalmente
3. Espera 5 minutos
4. **Vuelve a agregar** el dominio
5. Espera algunas horas más

## 🔧 Solución Temporal: Usar Subdominio www

Si el dominio raíz (`celebratevalentines.com`) sigue dando problemas, puedes usar `www.celebratevalentines.com`:

1. En Google Cloud Console, configura el subdominio `www`
2. Actualiza los registros DNS según las instrucciones de Google Cloud
3. Los certificados SSL para subdominios suelen activarse más rápido

## 📋 Checklist de Verificación

- [ ] Verificar que el dominio esté configurado en Google Cloud Console
- [ ] Verificar que los registros DNS estén correctos según Google Cloud
- [ ] Verificar propagación DNS con herramientas online
- [ ] Esperar algunas horas para activación del certificado
- [ ] Verificar que el servicio esté desplegado correctamente

## 🚨 Si Nada Funciona

1. **Verifica que el dominio esté activo en tu proveedor**
   - Asegúrate de que el dominio no esté expirado
   - Verifica que los DNS estén activos

2. **Contacta Google Cloud Support**
   - Si después de 24 horas el certificado no se activa
   - Proporciona detalles del dominio y configuración

3. **Revisa los Logs**
   - Verifica los logs en Google Cloud Console para errores
   - Revisa el estado del certificado SSL

## 📝 Notas Importantes

- **NO cambies los registros DNS** mientras Google Cloud está configurando el certificado
- El error `ERR_SSL_UNRECOGNIZED_NAME_ALERT` es temporal y se resolverá cuando Google Cloud active el certificado
- Google Cloud proporciona certificados SSL **gestionados automáticamente**, solo requiere tiempo

## 🔗 Recursos Útiles

- [Google Cloud SSL Certificates](https://cloud.google.com/load-balancing/docs/ssl-certificates)
- [Cloud Run Custom Domains](https://cloud.google.com/run/docs/mapping-custom-domains)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/) - Para verificar el certificado una vez activo
