# Crear repositorio mothersday-uk en GitHub y subir codigo
# Misma configuracion que valentines: public, branch main, Cloud Build

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Set-Location $root

$repoName = "mothersday-uk"
$repoDescription = "Repository created for the generic landing page for Mother's Day seasonality in the UK."
$owner = "jorgebarroso-cloud"
$repoUrl = "https://github.com/$owner/$repoName.git"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Subir Mother's Day UK a GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repositorio: $repoName" -ForegroundColor Cyan
Write-Host "Descripcion: $repoDescription" -ForegroundColor Gray
Write-Host ""

# Opcion 1: Usar GitHub CLI si esta instalado
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
    Write-Host "GitHub CLI detectado. Creando repositorio y subiendo..." -ForegroundColor Yellow
    gh repo create $repoName --public --description $repoDescription --source=. --remote=origin --push
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Repositorio creado y codigo subido correctamente." -ForegroundColor Green
        $url = gh repo view $repoName --json url -q .url
        Write-Host "URL: $url" -ForegroundColor Cyan
        Write-Host ""
        exit 0
    }
}

# Opcion 2: Repo ya creado en GitHub (por ejemplo desde la web)
Write-Host "Si ya creaste el repositorio '$repoName' en GitHub, configurando remote y subiendo..." -ForegroundColor Yellow
$existing = git remote get-url origin 2>$null
if ($existing) {
    if ($existing -ne $repoUrl) {
        git remote set-url origin $repoUrl
        Write-Host "Remote 'origin' actualizado a $repoUrl" -ForegroundColor Gray
    }
} else {
    git remote add origin $repoUrl
    Write-Host "Remote 'origin' anadido: $repoUrl" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Subiendo a origin main..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Codigo subido correctamente." -ForegroundColor Green
    Write-Host "URL: https://github.com/$owner/$repoName" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error al hacer push. Comprueba:" -ForegroundColor Red
    Write-Host "1. Que el repositorio existe: https://github.com/new (nombre: $repoName, descripcion como arriba)" -ForegroundColor White
    Write-Host "2. Que tienes acceso de escritura (usuario: $owner)" -ForegroundColor White
    Write-Host "3. O instala GitHub CLI y vuelve a ejecutar este script: winget install GitHub.cli" -ForegroundColor White
    Write-Host ""
    exit 1
}
