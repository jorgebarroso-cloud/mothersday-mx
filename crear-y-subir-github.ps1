# Script completo para crear repositorio en GitHub y subir el codigo

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Crear Repositorio en GitHub y Subir Codigo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encuentra package.json" -ForegroundColor Red
    exit 1
}

# Verificar que hay commits
$commits = git log --oneline -1 2>$null
if ([string]::IsNullOrWhiteSpace($commits)) {
    Write-Host "No hay commits. Creando commit inicial..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: Celebrate Valentine's landing page"
}

Write-Host "Paso 1: Crear repositorio en GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre tu navegador y ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repositorio: celebrate-valentines" -ForegroundColor White
Write-Host "3. Descripcion: Valentine's Day landing page with city-specific content" -ForegroundColor White
Write-Host "4. Elige Public o Private" -ForegroundColor White
Write-Host "5. IMPORTANTE: NO marques ninguna opcion (README, .gitignore, license)" -ForegroundColor Red
Write-Host "6. Haz clic en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER cuando hayas creado el repositorio..." -ForegroundColor Yellow
$null = Read-Host

Write-Host ""
Write-Host "Paso 2: Ingresar URL del repositorio" -ForegroundColor Yellow
Write-Host ""
Write-Host "Copia la URL de tu repositorio (ejemplo: https://github.com/TU_USUARIO/celebrate-valentines.git)" -ForegroundColor Cyan
$repoUrl = Read-Host "Pega la URL aqui"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: URL no puede estar vacia" -ForegroundColor Red
    exit 1
}

# Verificar formato
if (-not ($repoUrl -match "^https://github\.com/.*\.git$")) {
    Write-Host "Advertencia: La URL no parece ser valida. Continuando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Paso 3: Configurando repositorio remoto..." -ForegroundColor Yellow

# Verificar si ya existe origin
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "El remote 'origin' ya existe. Actualizando..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}

# Cambiar branch a main
Write-Host "Configurando branch principal..." -ForegroundColor Yellow
git branch -M main 2>$null

Write-Host ""
Write-Host "Paso 4: Subiendo codigo a GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Codigo subido exitosamente!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repositorio: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Paso 5: Desplegar en Vercel para ver el preview online" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ve a: https://vercel.com" -ForegroundColor White
    Write-Host "2. Inicia sesion con GitHub" -ForegroundColor White
    Write-Host "3. Haz clic en 'Add New Project'" -ForegroundColor White
    Write-Host "4. Selecciona el repositorio 'celebrate-valentines'" -ForegroundColor White
    Write-Host "5. Vercel detectara automaticamente Next.js" -ForegroundColor White
    Write-Host "6. Haz clic en 'Deploy'" -ForegroundColor White
    Write-Host "7. En 2-3 minutos tendras tu sitio online!" -ForegroundColor White
    Write-Host ""
    Write-Host "Tu sitio estara disponible en: https://celebrate-valentines.vercel.app" -ForegroundColor Green
    Write-Host ""
    Write-Host "Presiona ENTER para abrir Vercel..." -ForegroundColor Yellow
    $null = Read-Host
    Start-Process "https://vercel.com/new"
} else {
    Write-Host ""
    Write-Host "Error al hacer push. Verifica:" -ForegroundColor Red
    Write-Host "- Que el repositorio existe en GitHub" -ForegroundColor White
    Write-Host "- Que tienes permisos de escritura" -ForegroundColor White
    Write-Host "- Que tu autenticacion de GitHub esta configurada" -ForegroundColor White
    Write-Host ""
    Write-Host "Puedes intentar manualmente con:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
