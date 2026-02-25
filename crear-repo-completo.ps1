# Script para crear repositorio en GitHub y subir todo automaticamente
# Requiere autenticacion previa con: gh auth login

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crear Repositorio y Subir a GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd C:\Users\FEVER\Desktop\fever-valentines-landing

# Verificar autenticacion
Write-Host "Verificando autenticacion con GitHub..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "No estas autenticado. Autenticando..." -ForegroundColor Yellow
    Write-Host "Se abrira el navegador. Sigue las instrucciones." -ForegroundColor Cyan
    Write-Host ""
    Start-Process "https://github.com/login/device"
    gh auth login --web
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Error en autenticacion. Por favor autenticate manualmente:" -ForegroundColor Red
        Write-Host "gh auth login" -ForegroundColor Green
        exit 1
    }
}

Write-Host "Autenticado correctamente!" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encuentra package.json" -ForegroundColor Red
    exit 1
}

# Nombre del repositorio
$repoName = "celebrate-valentines"
$repoDescription = "Valentine's Day landing page with city-specific content"

Write-Host "Creando repositorio en GitHub..." -ForegroundColor Yellow
Write-Host "Nombre: $repoName" -ForegroundColor Cyan
Write-Host "Descripcion: $repoDescription" -ForegroundColor Cyan
Write-Host ""

# Crear repositorio (publico por defecto, cambiar a --private si quieres)
gh repo create $repoName --public --description $repoDescription --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Repositorio creado y codigo subido!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Obtener la URL del repositorio
    $repoUrl = gh repo view $repoName --json url -q .url
    Write-Host "Repositorio: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Paso siguiente: Desplegar en Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ve a: https://vercel.com" -ForegroundColor White
    Write-Host "2. Inicia sesion con GitHub" -ForegroundColor White
    Write-Host "3. Haz clic en 'Add New Project'" -ForegroundColor White
    Write-Host "4. Selecciona el repositorio '$repoName'" -ForegroundColor White
    Write-Host "5. Haz clic en 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "Tu sitio estara online en 2-3 minutos!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Presiona ENTER para abrir Vercel..." -ForegroundColor Yellow
    $null = Read-Host
    Start-Process "https://vercel.com/new"
} else {
    Write-Host ""
    Write-Host "Error al crear el repositorio. Verifica:" -ForegroundColor Red
    Write-Host "- Que estas autenticado: gh auth status" -ForegroundColor White
    Write-Host "- Que tienes permisos para crear repositorios" -ForegroundColor White
    Write-Host ""
    Write-Host "Puedes intentar manualmente:" -ForegroundColor Yellow
    Write-Host "gh repo create $repoName --public --description '$repoDescription' --source=. --remote=origin --push" -ForegroundColor Cyan
}

Write-Host ""
