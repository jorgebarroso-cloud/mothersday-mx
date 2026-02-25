# Optimizar Despliegues Automáticos

## 🔴 Problema: Múltiples Despliegues

Cuando haces múltiples commits y pushes en poco tiempo, cada push activa un nuevo despliegue automático, lo que puede ser ineficiente y costoso.

## ✅ Soluciones

### Opción 1: Agrupar Cambios (Recomendado)

En lugar de hacer un commit por cada pequeño cambio, agrupa varios cambios relacionados:

```bash
# ❌ Evitar: Múltiples commits pequeños
git commit -m "Fix: typo"
git commit -m "Fix: another typo"
git commit -m "Fix: formatting"

# ✅ Mejor: Un commit con varios cambios
git add .
git commit -m "Fix: Multiple improvements to Docker configuration"
git push
```

**Ventajas:**
- Menos despliegues
- Historial más limpio
- Ahorro de recursos

### Opción 2: Desactivar Temporalmente el Trigger

Si necesitas hacer múltiples commits de prueba:

1. Ve a **Cloud Build** → **Triggers**
2. Encuentra tu trigger `rmgpgab-...`
3. Haz clic en el trigger
4. Desactiva el trigger temporalmente
5. Haz tus commits y pushes
6. Cuando termines, reactiva el trigger
7. Haz un push final para activar el despliegue

### Opción 3: Usar [skip ci] en Mensajes de Commit

Puedes configurar el trigger para que ignore commits con `[skip ci]` en el mensaje:

1. Ve a **Cloud Build** → **Triggers**
2. Edita tu trigger
3. En **Advanced** → **Ignored files**, agrega una condición
4. O simplemente usa `[skip ci]` en tus mensajes de commit:

```bash
git commit -m "WIP: Testing changes [skip ci]"
git push
```

**Nota:** Esto requiere configurar el trigger para ignorar estos commits.

### Opción 4: Configurar Filtros en el Trigger

Puedes configurar el trigger para que solo se ejecute en ciertos casos:

1. **Solo en tags:**
   - Event: Push to a tag
   - Tag: `^v.*` (solo tags que empiecen con "v")

2. **Solo en commits con mensaje específico:**
   - Esto requiere configuración avanzada en el trigger

3. **Ignorar ciertos archivos:**
   - Si cambias solo documentación, no necesitas desplegar
   - Configura el trigger para ignorar cambios en `*.md`, `README.md`, etc.

## 📊 Mejores Prácticas

### Para Desarrollo Activo:

1. **Haz commits locales primero:**
   ```bash
   git add .
   git commit -m "WIP: Multiple fixes"
   # No hacer push todavía
   ```

2. **Agrupa cambios relacionados:**
   - Todos los cambios de Docker en un commit
   - Todos los cambios de configuración en otro
   - Etc.

3. **Haz push cuando estés listo:**
   ```bash
   git push origin main
   # Solo un despliegue se ejecutará
   ```

### Para Producción:

1. **Usa ramas de desarrollo:**
   ```bash
   git checkout -b feature/mis-cambios
   # Haz todos tus commits aquí
   git push origin feature/mis-cambios
   # Crea un PR y mergea cuando esté listo
   # Solo el merge a main activará el despliegue
   ```

2. **Usa tags para releases:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   # Configura el trigger para solo desplegar en tags
   ```

## 🔍 Verificar Despliegues Actuales

Para ver cuántos despliegues están en curso:

1. Ve a **Cloud Build** → **History**
2. Filtra por estado: "In progress" o "Failed"
3. Cancela los despliegues que no necesitas

## ⚠️ Nota Importante

Los despliegues múltiples consumen:
- **Tiempo de build** (cada build toma 3-5 minutos)
- **Recursos de Cloud Build** (puede tener límites)
- **Costos** (si excedes los límites gratuitos)

Por eso es importante optimizar cuándo se ejecutan los despliegues.
