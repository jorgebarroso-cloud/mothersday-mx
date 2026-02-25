# Script para subir el proyecto a GitHub y desplegarlo online

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Subir Proyecto a GitHub y Desplegar" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "Error: No se encuentra package.json. Asegurate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Paso 1: Agregar todos los archivos
Write-Host "Paso 1: Agregando archivos al staging..." -ForegroundColor Yellow
git add .

# Paso 2: Hacer commit
Write-Host ""
Write-Host "Paso 2: Creando commit..." -ForegroundColor Yellow
$commitMessage = "Update: Celebrate Valentine's branding, city-specific content, video posters, and SEO optimization"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Advertencia: No hay cambios para commitear o ya estan commiteados." -ForegroundColor Yellow
}

# Paso 3: Verificar si hay un remote
Write-Host ""
Write-Host "Paso 3: Verificando configuracion de GitHub..." -ForegroundColor Yellow
$remotes = git remote -v

if ([string]::IsNullOrWhiteSpace($remotes)) {
    Write-Host ""
    Write-Host "No hay repositorio remoto configurado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para crear y subir a GitHub, sigue estos pasos:" -ForegroundColor Cyan
    Write-Host "1. Ve a https://github.com/new" -ForegroundColor White
    Write-Host "2. Crea un nuevo repositorio (por ejemplo: 'celebrate-valentines')" -ForegroundColor White
    Write-Host "3. NO inicialices con README, .gitignore o licencia" -ForegroundColor White
    Write-Host "4. Copia la URL del repositorio" -ForegroundColor White
    Write-Host ""
    Write-Host "Luego ejecuta el script: .\configurar-github-repo.ps1" -ForegroundColor Green
} else {
    Write-Host "Repositorio remoto encontrado:" -ForegroundColor Green
    Write-Host $remotes -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "Quieres hacer push ahora? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "S" -or $response -eq "s" -or $response -eq "Y" -or $response -eq "y") {
        Write-Host ""
        Write-Host "Haciendo push a GitHub..." -ForegroundColor Yellow
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Proyecto subido a GitHub exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Para desplegar online, puedes usar Vercel:" -ForegroundColor Cyan
            Write-Host "1. Ve a https://vercel.com" -ForegroundColor White
            Write-Host "2. Inicia sesion con GitHub" -ForegroundColor White
            Write-Host "3. Importa tu repositorio" -ForegroundColor White
            Write-Host "4. Vercel detectara automaticamente Next.js y desplegara" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Proceso completado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
