# Script para instalar Node.js
# Ejecuta este script como Administrador: Click derecho > "Ejecutar con PowerShell como administrador"

Write-Host "=== Instalando Node.js ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya está instalado
if (Test-Path "C:\Program Files\nodejs\node.exe") {
    Write-Host "✅ Node.js ya está instalado" -ForegroundColor Green
    & "C:\Program Files\nodejs\node.exe" --version
    exit 0
}

# Verificar si winget está disponible
try {
    winget --version | Out-Null
    Write-Host "Instalando Node.js LTS con winget..." -ForegroundColor Cyan
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Node.js instalado correctamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANTE: Cierra y vuelve a abrir tu terminal para usar Node.js" -ForegroundColor Yellow
        Write-Host "Luego ejecuta: .\ver-preview.ps1" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error al instalar con winget" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalación manual:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Descarga la versión LTS" -ForegroundColor Cyan
    Write-Host "3. Ejecuta el instalador" -ForegroundColor Cyan
}
