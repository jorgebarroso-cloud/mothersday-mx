# Script completo para instalar Node.js e iniciar la preview
# Ejecuta este script como Administrador

Write-Host "=== Instalación y Preview del Sitio ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js ya está instalado
$nodePath = $null
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
)

foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $nodePath = $path
        break
    }
}

if ($nodePath) {
    Write-Host "✅ Node.js encontrado: $nodePath" -ForegroundColor Green
    $nodeVersion = & $nodePath --version
    Write-Host "   Versión: $nodeVersion" -ForegroundColor Gray
} else {
    Write-Host "📥 Node.js no encontrado. Descargando e instalando..." -ForegroundColor Yellow
    Write-Host ""
    
    # Descargar Node.js LTS
    $nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
    $downloadPath = "$env:TEMP\nodejs-installer.msi"
    
    Write-Host "Descargando Node.js desde nodejs.org..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $downloadPath -UseBasicParsing
        Write-Host "✅ Descarga completada" -ForegroundColor Green
        Write-Host ""
        Write-Host "Instalando Node.js (esto requiere permisos de administrador)..." -ForegroundColor Yellow
        Write-Host "Por favor, acepta la instalación cuando aparezca la ventana." -ForegroundColor Yellow
        Write-Host ""
        
        Start-Process msiexec.exe -ArgumentList "/i `"$downloadPath`" /quiet /norestart" -Wait -Verb RunAs
        
        # Actualizar PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verificar instalación
        Start-Sleep -Seconds 2
        if (Test-Path "C:\Program Files\nodejs\node.exe") {
            $nodePath = "C:\Program Files\nodejs\node.exe"
            Write-Host "✅ Node.js instalado correctamente" -ForegroundColor Green
        } else {
            Write-Host "❌ Error en la instalación. Por favor instala Node.js manualmente desde: https://nodejs.org/" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Error al descargar Node.js: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instala Node.js manualmente:" -ForegroundColor Yellow
        Write-Host "1. Ve a: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "2. Descarga la versión LTS" -ForegroundColor Cyan
        Write-Host "3. Ejecuta el instalador" -ForegroundColor Cyan
        Write-Host "4. Reinicia esta terminal y ejecuta este script de nuevo" -ForegroundColor Cyan
        exit 1
    }
}

# Verificar npm
$npmPath = $nodePath -replace "node.exe", "npm.cmd"
if (-not (Test-Path $npmPath)) {
    $npmPath = "npm"
}

Write-Host ""
Write-Host "Verificando npm..." -ForegroundColor Cyan
try {
    $npmVersion = & $npmPath --version
    Write-Host "✅ npm encontrado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar e instalar dependencias
Write-Host ""
Write-Host "Verificando dependencias del proyecto..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias (esto puede tardar unos minutos)..." -ForegroundColor Yellow
    & $npmPath install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Iniciar servidor
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "El sitio estará disponible en:" -ForegroundColor Green
Write-Host "   🌐 http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Abrir navegador después de unos segundos
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3000"
} | Out-Null

# Iniciar servidor
& $npmPath run dev
