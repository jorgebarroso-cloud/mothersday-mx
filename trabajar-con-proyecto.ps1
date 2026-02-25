# Script para trabajar con el proyecto clonado
# Ejecuta este script con: .\trabajar-con-proyecto.ps1

$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "=== Trabajando con fever-valentines-landing ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Este script debe ejecutarse dentro del directorio del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "Opciones disponibles:" -ForegroundColor Yellow
Write-Host "1. Crear una nueva rama para hacer pruebas" -ForegroundColor White
Write-Host "2. Ver ramas disponibles" -ForegroundColor White
Write-Host "3. Cambiar a una rama existente" -ForegroundColor White
Write-Host "4. Ver el estado actual del repositorio" -ForegroundColor White
Write-Host "5. Configurar un fork personal (si quieres subir tus cambios)" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1-5)"

switch ($opcion) {
    "1" {
        Write-Host ""
        $nombreRama = Read-Host "Nombre de la nueva rama (ej: pruebas-cambios)"
        Write-Host "Creando rama '$nombreRama'..." -ForegroundColor Cyan
        & $gitPath checkout -b $nombreRama
        Write-Host "¡Rama creada y activada! Ahora puedes hacer tus cambios." -ForegroundColor Green
        Write-Host ""
        Write-Host "Cuando termines, puedes hacer commit con:" -ForegroundColor Yellow
        Write-Host "  git add ." -ForegroundColor White
        Write-Host "  git commit -m 'Descripción de tus cambios'" -ForegroundColor White
        Write-Host ""
        Write-Host "Para subir tus cambios a tu fork (si ya lo configuraste):" -ForegroundColor Yellow
        Write-Host "  git push origin $nombreRama" -ForegroundColor White
        Write-Host ""
        Write-Host "🔒 Seguro: Tus cambios NO afectarán el repositorio original" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "Ramas disponibles:" -ForegroundColor Cyan
        & $gitPath branch -a
    }
    "3" {
        Write-Host ""
        Write-Host "Ramas locales:" -ForegroundColor Cyan
        & $gitPath branch
        Write-Host ""
        $nombreRama = Read-Host "Nombre de la rama a la que quieres cambiar"
        & $gitPath checkout $nombreRama
        Write-Host "Cambiado a la rama '$nombreRama'" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "Estado del repositorio:" -ForegroundColor Cyan
        & $gitPath status
        Write-Host ""
        Write-Host "Últimos commits:" -ForegroundColor Cyan
        & $gitPath log --oneline -5
    }
    "5" {
        Write-Host ""
        Write-Host "Para configurar tu fork de forma segura, usa el script dedicado:" -ForegroundColor Yellow
        Write-Host "  .\configurar-fork-seguro.ps1" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Ese script te guiará paso a paso para asegurar que tus cambios" -ForegroundColor White
        Write-Host "NO afecten el repositorio original." -ForegroundColor White
    }
    default {
        Write-Host "Opción no válida." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Listo ===" -ForegroundColor Green
