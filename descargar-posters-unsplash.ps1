# Script para descargar imágenes de skyline nocturno desde Unsplash
# Usa URLs directas de Unsplash con parámetros de tamaño optimizados

$ErrorActionPreference = "Stop"

$postersDir = Join-Path $PSScriptRoot "public\images\posters"
if (-not (Test-Path $postersDir)) {
    New-Item -ItemType Directory -Path $postersDir -Force | Out-Null
    Write-Host "✅ Carpeta creada: $postersDir" -ForegroundColor Green
}

# URLs de Unsplash para skylines nocturnos de cada ciudad
# Formato: https://images.unsplash.com/photo-[ID]?w=1920&q=80
# Puedes encontrar más imágenes en: https://unsplash.com/s/photos/[city]-night-skyline
$cityImages = @{
    'madrid' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80&fit=crop'
    'barcelona' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80&fit=crop'
    'valencia' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80&fit=crop'
    'london' = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80&fit=crop'
    'paris' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80&fit=crop'
    'lyon' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80&fit=crop'
    'new-york' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'los-angeles' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'chicago' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'miami' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'san-francisco' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'washington-dc' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'san-diego' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'atlanta' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'austin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'lisbon' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'sao-paulo' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'mexico-city' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'berlin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'hamburg' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'vienna' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'dublin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'sydney' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'melbourne' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
    'brisbane' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'
}

# Imagen por defecto (skyline genérico nocturno)
$defaultImage = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80&fit=crop'

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Descargando imágenes de skyline nocturno" -ForegroundColor Cyan
Write-Host "desde Unsplash" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$downloaded = 0
$skipped = 0
$failed = 0

foreach ($city in $cityImages.Keys) {
    $fileName = "skyline-$city.jpg"
    $filePath = Join-Path $postersDir $fileName
    $imageUrl = $cityImages[$city]
    
    if (Test-Path $filePath) {
        Write-Host "⏭️  Saltando: $fileName (ya existe)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    try {
        Write-Host "⬇️  Descargando: $fileName..." -ForegroundColor Blue -NoNewline
        $response = Invoke-WebRequest -Uri $imageUrl -OutFile $filePath -UseBasicParsing -ErrorAction Stop
        Write-Host " ✅" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host " ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

# Descargar imagen por defecto
$defaultPath = Join-Path $postersDir "skyline-default.jpg"
if (-not (Test-Path $defaultPath)) {
    try {
        Write-Host "⬇️  Descargando: skyline-default.jpg..." -ForegroundColor Blue -NoNewline
        Invoke-WebRequest -Uri $defaultImage -OutFile $defaultPath -UseBasicParsing -ErrorAction Stop | Out-Null
        Write-Host " ✅" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host " ❌ Error descargando imagen por defecto" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Resumen:" -ForegroundColor Cyan
Write-Host "  ✅ Descargadas: $downloaded" -ForegroundColor Green
Write-Host "  ⏭️  Saltadas: $skipped" -ForegroundColor Yellow
Write-Host "  ❌ Fallidas: $failed" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Cyan

if ($downloaded -gt 0) {
    Write-Host "✅ Imágenes descargadas en: $postersDir" -ForegroundColor Green
    Write-Host "`n💡 Nota: Las URLs actuales son placeholders genéricos." -ForegroundColor Yellow
    Write-Host "   Para imágenes específicas de cada ciudad, busca en:" -ForegroundColor Yellow
    Write-Host "   https://unsplash.com/s/photos/[city-name]-night-skyline" -ForegroundColor Yellow
    Write-Host "   y actualiza las URLs en este script." -ForegroundColor Yellow
}

Write-Host "`n✨ Las imágenes están listas para usar en el hero section!" -ForegroundColor Green
