# Script para ver una preview del sitio
# Ejecuta este script con: .\ver-preview.ps1

Write-Host "=== Iniciando Preview del Sitio ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Cyan
$nodePath = $null

# Buscar Node.js en ubicaciones comunes
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:ProgramFiles\nodejs\node.exe"
)

foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $nodePath = $path
        break
    }
}

# Intentar encontrar node en PATH
if (-not $nodePath) {
    try {
        $nodeCmd = Get-Command node -ErrorAction Stop
        $nodePath = $nodeCmd.Source
    } catch {
        # Node.js no encontrado
    }
}

if (-not $nodePath) {
    Write-Host ""
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para ver el sitio, necesitas instalar Node.js:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ve a: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Descarga la versión LTS (recomendada)" -ForegroundColor Cyan
    Write-Host "3. Instala Node.js (incluye npm automáticamente)" -ForegroundColor Cyan
    Write-Host "4. Reinicia tu terminal después de instalar" -ForegroundColor Yellow
    Write-Host "5. Ejecuta este script de nuevo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "¿Quieres abrir la página de descarga ahora? (S/N)" -ForegroundColor Yellow
    $abrir = Read-Host
    if ($abrir -eq "S" -or $abrir -eq "s") {
        Start-Process "https://nodejs.org/"
    }
    exit 1
}

Write-Host "✅ Node.js encontrado: $nodePath" -ForegroundColor Green
$nodeVersion = & $nodePath --version
Write-Host "   Versión: $nodeVersion" -ForegroundColor Gray

# Verificar npm
Write-Host ""
Write-Host "Verificando npm..." -ForegroundColor Cyan
$npmPath = $nodePath -replace "node.exe", "npm.cmd"
if (-not (Test-Path $npmPath)) {
    $npmPath = "npm"  # Intentar desde PATH
}

try {
    $npmVersion = & $npmPath --version
    Write-Host "✅ npm encontrado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar si las dependencias están instaladas
Write-Host ""
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Las dependencias no están instaladas" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Instalando dependencias (esto puede tardar unos minutos)..." -ForegroundColor Cyan
    & $npmPath install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Iniciar servidor de desarrollo
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "El sitio estará disponible en:" -ForegroundColor Green
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Abrir navegador después de un momento
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# Iniciar servidor en puerto 3000 (npm run dev = npx serve . -l 3000)
& $npmPath run dev
