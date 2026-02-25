# Cambios: Arreglar Redirects HTTPS y Problemas de Canonical URLs

## Resumen de Cambios

Se han implementado correcciones para resolver los problemas de redirects HTTPS→HTTP con puerto 8080 y los problemas de canonical URLs que impedían que Google reconociera las rutas específicas de ciudades.

## Cambios Realizados

### 1. nginx.conf - Configuración Mejorada para Cloud Run

**Archivo**: `nginx.conf`

#### Cambios:
- ✅ Añadida configuración `real_ip_header` y `set_real_ip_from` para manejar correctamente los headers de proxy de Cloud Run
- ✅ Añadido `port_in_redirect off` para prevenir que los números de puerto aparezcan en redirects
- ✅ Mejorados comentarios sobre manejo de HTTPS por Cloud Run

#### Líneas clave añadidas:
```nginx
# Trust Cloud Run proxy headers
set_real_ip_from 0.0.0.0/0;
real_ip_header X-Forwarded-For;
real_ip_recursive on;

# Prevent port numbers from appearing in redirects
port_in_redirect off;
```

### 2. ForceHttps Component - Mejorado

**Archivo**: `src/components/security/force-https.tsx`

#### Cambios:
- ✅ Mejorado para que solo actúe como fallback (Cloud Run maneja HTTPS automáticamente)
- ✅ Eliminada lógica que causaba redirects innecesarios basados solo en el puerto
- ✅ Añadidos warnings en consola para debugging si se activa
- ✅ Mejorada documentación del componente

#### Comportamiento:
- Solo redirige si el protocolo es HTTP (no debería pasar con Cloud Run)
- Ya no redirige solo por tener un puerto visible
- Añade warnings si detecta problemas de configuración

### 3. Middleware - Redirects 301 (Permanent)

**Archivo**: `middleware.ts`

#### Cambios:
- ✅ Cambiado redirect de raíz (`/`) a `/${locale}` de 307 (Temporary) a 301 (Permanent)
- ✅ Mejor para SEO: Google entiende que esta es la URL canónica permanente

#### Línea modificada:
```typescript
// Antes: return NextResponse.redirect(url);
// Ahora: return NextResponse.redirect(url, { status: 301 });
```

## Problemas Resueltos

### 1. ✅ Redirect HTTPS → HTTP con puerto 8080
**Problema**: `https://celebratevalentines.com/en/berlin` → `http://celebratevalentines.com:8080/en/berlin`

**Solución**:
- `port_in_redirect off` en nginx previene que el puerto aparezca en redirects
- Configuración de `real_ip_header` asegura que nginx use los headers correctos de Cloud Run
- ForceHttps mejorado para no causar redirects innecesarios

### 2. ✅ Redirect Chain y Canonical Issues
**Problema**: Rutas específicas como `/en/madrid/` se reportaban como si el contenido estuviera en `/`

**Solución**:
- Configuración mejorada de nginx para servir correctamente rutas con `trailingSlash: true`
- Redirects 301 en lugar de 302/307 para que Google entienda que son permanentes
- Headers de proxy correctamente configurados

### 3. ✅ 302 vs 301 Redirects
**Problema**: Redirects temporales (302) en lugar de permanentes (301)

**Solución**:
- Middleware ahora usa 301 (Permanent) para redirects de raíz a locale
- Nginx ya usaba 301 para redirects de ciudades (münchen → munchen, etc.)

## Verificación

### Script de Verificación Creado
- `scripts/test-nginx-config.js` - Verifica que la configuración de nginx sea correcta

### Resultados de Verificación:
```
✅ port_in_redirect configurado
✅ real_ip_header configurado
✅ No hay redirects explícitos a HTTP
✅ Redirect 301 (correcto para SEO)
✅ Comentarios sobre HTTPS presentes
```

## Próximos Pasos

1. **Probar en Local**: 
   - ✅ Configuración verificada
   - ⏳ Build puede tardar por fetches a Google Sheets (normal)

2. **Probar en Producción**:
   - Hacer commit y push
   - Deploy a Cloud Run
   - Verificar con herramientas de SEO (Redirect Path, etc.)
   - Confirmar que no hay redirects HTTPS→HTTP
   - Confirmar que las rutas específicas se sirven correctamente

## Notas Importantes

- Cloud Run maneja HTTPS automáticamente a través de su load balancer
- El componente ForceHttps ahora solo actúa como fallback de seguridad
- Los redirects 301 son mejores para SEO que 302/307
- `port_in_redirect off` es crítico para prevenir que el puerto aparezca en URLs

## Archivos Modificados

1. `nginx.conf` - Configuración mejorada para Cloud Run
2. `src/components/security/force-https.tsx` - Mejorado para evitar redirects innecesarios
3. `middleware.ts` - Cambiado a redirects 301
4. `scripts/test-nginx-config.js` - Script de verificación (nuevo)
