# Script para desplegar rapidamente en Vercel y ver el preview online

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Despliegue Rapido en Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encuentra package.json" -ForegroundColor Red
    exit 1
}

# Verificar si Vercel CLI esta instalado
Write-Host "Verificando Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI no esta instalado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al instalar Vercel CLI. Intentando con npx..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Iniciando despliegue en Vercel..." -ForegroundColor Green
Write-Host "Sigue las instrucciones en pantalla:" -ForegroundColor Cyan
Write-Host "- Presiona Enter para usar valores por defecto" -ForegroundColor White
Write-Host "- Cuando te pida, inicia sesion con GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Usar npx vercel para asegurar que funciona
Write-Host ""
Write-Host "Ejecutando: npx vercel --yes" -ForegroundColor Green
npx vercel --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Despliegue completado!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu sitio deberia estar online ahora." -ForegroundColor Cyan
    Write-Host "Revisa la URL que aparece arriba." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Si hay errores, puedes desplegar manualmente:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://vercel.com" -ForegroundColor White
    Write-Host "2. Inicia sesion con GitHub" -ForegroundColor White
    Write-Host "3. Importa tu repositorio" -ForegroundColor White
}

Write-Host ""
