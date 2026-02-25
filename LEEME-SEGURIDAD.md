# 🔒 Configuración Segura - Tus Cambios NO Afectan el Repositorio Original

## ✅ Estado Actual

Tu repositorio está configurado de forma **SEGURA**:

- **`upstream`** = Repositorio original (solo lectura, NO puedes hacer push)
- **`origin`** = Se configurará como tu fork (cuando lo crees)

## 🛡️ Garantías de Seguridad

1. **No puedes hacer push al repositorio original** - El remoto `upstream` está protegido
2. **Trabajas en tu propia copia** - Todos tus cambios son locales hasta que los subas a TU fork
3. **El repositorio original está a salvo** - Incluso si intentas hacer push, fallará

## 📋 Pasos para Trabajar de Forma Segura

### 1. Crear tu Fork en GitHub (Una sola vez)

1. Ve a: https://github.com/alejandromorenopr/fever-valentines-landing
2. Haz clic en el botón **"Fork"** (arriba a la derecha)
3. Esto crea una copia independiente en tu cuenta de GitHub
4. **IMPORTANTE**: Esta copia es TUYA y no afecta el original

### 2. Configurar tu Fork Localmente

Ejecuta el script de configuración:

```powershell
.\configurar-fork-seguro.ps1
```

Este script:
- Configura `origin` para apuntar a TU fork
- Mantiene `upstream` apuntando al original (solo lectura)
- Te asegura que tus cambios nunca afecten el repositorio original

### 3. Crear una Rama para tus Pruebas

```powershell
.\trabajar-con-proyecto.ps1
```

Selecciona la opción 1 para crear una nueva rama.

O manualmente:

```bash
git checkout -b mis-pruebas
```

### 4. Hacer tus Cambios

Edita los archivos que necesites. Todos los cambios son locales y no afectan nada hasta que hagas commit.

### 5. Guardar tus Cambios (Commit)

```bash
git add .
git commit -m "Descripción de mis cambios"
```

### 6. Subir tus Cambios a TU Fork (Opcional)

```bash
git push origin mis-pruebas
```

**Esto sube los cambios a TU fork, NO al repositorio original.**

## 🔄 Actualizar desde el Repositorio Original

Si el autor del proyecto hace cambios y quieres actualizar tu copia:

```bash
git fetch upstream
git merge upstream/master
```

Esto trae los cambios del original a tu copia local, sin afectar el original.

## ❓ Preguntas Frecuentes

### ¿Puedo romper el proyecto original?
**NO.** No tienes permisos para hacer push al repositorio original. Está protegido.

### ¿Mis cambios afectan a otros?
**NO.** Tus cambios son locales hasta que los subas a TU fork. El fork es tu copia independiente.

### ¿Cómo sé que estoy trabajando de forma segura?
- El remoto `upstream` apunta al original (solo lectura)
- El remoto `origin` apunta a TU fork
- Verifica con: `git remote -v`

### ¿Qué pasa si hago push por error?
Si intentas hacer push al original, Git te dará un error. Solo puedes hacer push a tu fork (`origin`).

## 📝 Resumen de Comandos Seguros

```bash
# Ver configuración de remotos
git remote -v

# Crear rama para pruebas
git checkout -b mis-pruebas

# Hacer cambios y commit
git add .
git commit -m "Mis cambios"

# Subir a TU fork (seguro)
git push origin mis-pruebas

# Actualizar desde el original
git fetch upstream
git merge upstream/master
```

## ✅ Checklist de Seguridad

- [ ] Fork creado en GitHub
- [ ] Script `configurar-fork-seguro.ps1` ejecutado
- [ ] Remoto `upstream` configurado (original, solo lectura)
- [ ] Remoto `origin` configurado (tu fork)
- [ ] Rama creada para tus cambios
- [ ] Trabajando en tu rama, no en `master`

---

**Recuerda**: El repositorio original está protegido. Tus cambios son completamente independientes. 🛡️
