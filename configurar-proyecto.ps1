# Script para configurar el proyecto después de clonarlo
# Ejecuta este script con: .\configurar-proyecto.ps1

Write-Host "=== Configuración inicial del proyecto ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Este script debe ejecutarse dentro del directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js no está instalado." -ForegroundColor Red
    Write-Host "Por favor, instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar si npm está instalado
Write-Host "Verificando npm..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm no está instalado." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== ¡Proyecto configurado correctamente! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Para iniciar el servidor de desarrollo:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Para crear una rama y hacer cambios:" -ForegroundColor White
    Write-Host "   .\trabajar-con-proyecto.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. El proyecto estará disponible en: http://localhost:3000" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Hubo un problema al instalar las dependencias." -ForegroundColor Red
    exit 1
}
