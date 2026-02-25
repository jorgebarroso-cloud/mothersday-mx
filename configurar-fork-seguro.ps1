# Script para configurar tu FORK de forma segura
# Esto asegura que tus cambios NO afecten el repositorio original
# Ejecuta este script con: .\configurar-fork-seguro.ps1

$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "=== Configuración Segura de Fork ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script te ayudará a configurar tu copia del proyecto" -ForegroundColor Yellow
Write-Host "de forma que tus cambios NO afecten el repositorio original." -ForegroundColor Yellow
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Este script debe ejecutarse dentro del directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar configuración actual
Write-Host "Verificando configuración actual..." -ForegroundColor Cyan
& $gitPath remote -v
Write-Host ""

# Verificar si ya tiene un fork configurado
$remotes = & $gitPath remote -v
if ($remotes -like "*origin*" -and $remotes -notlike "*NO_PUSH*") {
    Write-Host "Ya tienes un remoto 'origin' configurado." -ForegroundColor Yellow
    Write-Host ""
    $sobreescribir = Read-Host "¿Quieres reconfigurarlo? (S/N)"
    if ($sobreescribir -ne "S" -and $sobreescribir -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "PASO 1: Crear Fork en GitHub" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "1. Ve a: https://github.com/alejandromorenopr/fever-valentines-landing" -ForegroundColor Cyan
Write-Host "2. Haz clic en el botón 'Fork' (arriba a la derecha)" -ForegroundColor Cyan
Write-Host "3. Esto creará una copia independiente en tu cuenta de GitHub" -ForegroundColor Cyan
Write-Host "   IMPORTANTE: Esta copia es TUYA y no afecta el original" -ForegroundColor Green
Write-Host ""
$continuar = Read-Host "¿Ya creaste el fork? (S/N)"

if ($continuar -ne "S" -and $continuar -ne "s") {
    Write-Host ""
    Write-Host "Por favor, crea el fork primero y luego ejecuta este script de nuevo." -ForegroundColor Yellow
    Write-Host "El fork es necesario para poder subir tus cambios de forma segura." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "PASO 2: Configurar tu Fork" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
$usuarioGitHub = Read-Host "Tu nombre de usuario de GitHub"

# Verificar que el remoto upstream existe (el original)
$upstreamExists = & $gitPath remote | Select-String -Pattern "upstream"
if (-not $upstreamExists) {
    Write-Host ""
    Write-Host "Agregando el repositorio original como 'upstream'..." -ForegroundColor Cyan
    & $gitPath remote add upstream "https://github.com/alejandromorenopr/fever-valentines-landing.git"
}

# Configurar origin para apuntar a tu fork
Write-Host ""
Write-Host "Configurando 'origin' para apuntar a TU fork..." -ForegroundColor Cyan
& $gitPath remote set-url origin "https://github.com/$usuarioGitHub/fever-valentines-landing.git"
& $gitPath remote set-url --push origin "https://github.com/$usuarioGitHub/fever-valentines-landing.git"

Write-Host ""
Write-Host "=== Configuración completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Remotos configurados:" -ForegroundColor Cyan
& $gitPath remote -v
Write-Host ""

Write-Host "✅ SEGURIDAD:" -ForegroundColor Green
Write-Host "   - 'upstream' = repositorio original (solo lectura)" -ForegroundColor White
Write-Host "   - 'origin' = tu fork (aquí subirás tus cambios)" -ForegroundColor White
Write-Host ""

Write-Host "📝 Cómo trabajar de forma segura:" -ForegroundColor Yellow
Write-Host "   1. Crea una rama para tus cambios:" -ForegroundColor White
Write-Host "      git checkout -b mis-pruebas" -ForegroundColor Cyan
Write-Host ""
Write-Host "   2. Haz tus cambios y commits:" -ForegroundColor White
Write-Host "      git add ." -ForegroundColor Cyan
Write-Host "      git commit -m 'Descripción de cambios'" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. Sube tus cambios a TU fork (no afecta el original):" -ForegroundColor White
Write-Host "      git push origin mis-pruebas" -ForegroundColor Cyan
Write-Host ""
Write-Host "   4. Si quieres actualizar desde el original:" -ForegroundColor White
Write-Host "      git fetch upstream" -ForegroundColor Cyan
Write-Host "      git merge upstream/master" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔒 Garantía: Tus cambios NO afectarán el repositorio original" -ForegroundColor Green
