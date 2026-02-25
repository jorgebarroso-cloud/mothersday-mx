# Script para crear un repositorio GitHub completamente independiente
# Esto elimina TODA conexión con el repositorio original
# Ejecuta este script con: .\crear-repositorio-independiente.ps1

$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "=== Crear Repositorio Independiente ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script te ayudará a crear un repositorio completamente" -ForegroundColor Yellow
Write-Host "independiente en GitHub, sin conexión con el original." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔒 VENTAJAS:" -ForegroundColor Green
Write-Host "   - Proyecto 100% independiente" -ForegroundColor White
Write-Host "   - Cero riesgo de afectar el repositorio original" -ForegroundColor White
Write-Host "   - Puedes renombrarlo como quieras" -ForegroundColor White
Write-Host "   - Control total sobre tu proyecto" -ForegroundColor White
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Este script debe ejecutarse dentro del directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar remotos actuales
Write-Host "Verificando configuración actual..." -ForegroundColor Cyan
$remotes = & $gitPath remote -v
if ($remotes) {
    Write-Host ""
    Write-Host "Remotos encontrados:" -ForegroundColor Yellow
    Write-Host $remotes
    Write-Host ""
    Write-Host "⚠️  ADVERTENCIA: Se eliminarán TODOS los remotos existentes." -ForegroundColor Yellow
    $continuar = Read-Host "¿Continuar? (S/N)"
    if ($continuar -ne "S" -and $continuar -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
    
    # Eliminar todos los remotos
    Write-Host ""
    Write-Host "Eliminando remotos existentes..." -ForegroundColor Cyan
    $remotesList = & $gitPath remote
    foreach ($remote in $remotesList) {
        & $gitPath remote remove $remote
        Write-Host "  Remoto '$remote' eliminado" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Todos los remotos eliminados. El proyecto ahora es completamente local." -ForegroundColor Green
Write-Host ""

# Opción: Mantener historial o empezar desde cero
Write-Host "¿Qué quieres hacer con el historial de Git?" -ForegroundColor Yellow
Write-Host "1. Mantener el historial completo (recomendado)" -ForegroundColor White
Write-Host "2. Empezar desde cero (nuevo historial limpio)" -ForegroundColor White
Write-Host ""
$opcionHistorial = Read-Host "Selecciona una opción (1 o 2)"

if ($opcionHistorial -eq "2") {
    Write-Host ""
    Write-Host "⚠️  ADVERTENCIA: Esto eliminará TODO el historial de commits." -ForegroundColor Yellow
    Write-Host "Se creará un nuevo repositorio Git desde cero." -ForegroundColor Yellow
    $confirmar = Read-Host "¿Estás seguro? (S/N)"
    
    if ($confirmar -eq "S" -or $confirmar -eq "s") {
        Write-Host ""
        Write-Host "Eliminando historial de Git..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force .git
        Write-Host "Inicializando nuevo repositorio Git..." -ForegroundColor Cyan
        & $gitPath init
        & $gitPath add .
        & $gitPath commit -m "Initial commit - Proyecto independiente"
        Write-Host "✅ Nuevo repositorio Git creado" -ForegroundColor Green
    } else {
        Write-Host "Operación cancelada. Manteniendo historial original." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 1: Crear nuevo repositorio en GitHub" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Crea un nuevo repositorio con el nombre que quieras" -ForegroundColor Cyan
Write-Host "   Ejemplo: 'mi-fever-valentines' o 'fever-valentines-mi-version'" -ForegroundColor Gray
Write-Host "3. NO inicialices con README, .gitignore o licencia" -ForegroundColor Yellow
Write-Host "   (ya tenemos los archivos localmente)" -ForegroundColor Yellow
Write-Host "4. Haz clic en 'Create repository'" -ForegroundColor Cyan
Write-Host ""
$continuar = Read-Host "¿Ya creaste el repositorio en GitHub? (S/N)"

if ($continuar -ne "S" -and $continuar -ne "s") {
    Write-Host ""
    Write-Host "Por favor, crea el repositorio primero y luego ejecuta este script de nuevo." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 2: Conectar tu proyecto local con GitHub" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
$usuarioGitHub = Read-Host "Tu nombre de usuario de GitHub"
$nombreRepositorio = Read-Host "Nombre del repositorio que acabas de crear"

Write-Host ""
Write-Host "Configurando remoto 'origin'..." -ForegroundColor Cyan
& $gitPath remote add origin "https://github.com/$usuarioGitHub/$nombreRepositorio.git"

Write-Host ""
Write-Host "Verificando conexión..." -ForegroundColor Cyan
& $gitPath remote -v

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASO 3: Subir tu proyecto a GitHub" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar en qué rama está
$ramaActual = & $gitPath branch --show-current
if (-not $ramaActual) {
    $ramaActual = "master"
}

Write-Host "Rama actual: $ramaActual" -ForegroundColor Cyan
Write-Host ""
Write-Host "¿Quieres subir el proyecto ahora?" -ForegroundColor Yellow
$subir = Read-Host "Esto hará: git push -u origin $ramaActual (S/N)"

if ($subir -eq "S" -or $subir -eq "s") {
    Write-Host ""
    Write-Host "Subiendo proyecto a GitHub..." -ForegroundColor Cyan
    
    # Si es la primera vez, usar -u para establecer upstream
    & $gitPath push -u origin $ramaActual
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡Proyecto subido exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tu repositorio está disponible en:" -ForegroundColor Cyan
        Write-Host "https://github.com/$usuarioGitHub/$nombreRepositorio" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "⚠️  Hubo un problema al subir. Verifica:" -ForegroundColor Yellow
        Write-Host "   - Que el repositorio existe en GitHub" -ForegroundColor White
        Write-Host "   - Que tienes permisos para hacer push" -ForegroundColor White
        Write-Host "   - Que tu autenticación está configurada" -ForegroundColor White
        Write-Host ""
        Write-Host "Puedes intentar manualmente con:" -ForegroundColor Yellow
        Write-Host "  git push -u origin $ramaActual" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Puedes subir el proyecto más tarde con:" -ForegroundColor Yellow
    Write-Host "  git push -u origin $ramaActual" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Configuración Completada" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔒 Tu proyecto es ahora COMPLETAMENTE INDEPENDIENTE:" -ForegroundColor Green
Write-Host "   ✅ Sin conexión con el repositorio original" -ForegroundColor White
Write-Host "   ✅ Cero riesgo de afectar otros proyectos" -ForegroundColor White
Write-Host "   ✅ Control total sobre tu código" -ForegroundColor White
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   git status              # Ver estado" -ForegroundColor White
Write-Host "   git add .               # Agregar cambios" -ForegroundColor White
Write-Host "   git commit -m 'mensaje' # Guardar cambios" -ForegroundColor White
Write-Host "   git push                # Subir a GitHub" -ForegroundColor White
Write-Host ""
