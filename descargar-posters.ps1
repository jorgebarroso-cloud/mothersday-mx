# Script para descargar imágenes de skyline nocturno desde Unsplash
# Las imágenes se descargan automáticamente y se guardan en /public/images/posters/

$ErrorActionPreference = "Stop"

$postersDir = Join-Path $PSScriptRoot "public\images\posters"
if (-not (Test-Path $postersDir)) {
    New-Item -ItemType Directory -Path $postersDir -Force | Out-Null
    Write-Host "✅ Carpeta creada: $postersDir" -ForegroundColor Green
}

# Mapeo de ciudades a IDs de Unsplash (imágenes de skyline nocturno)
# Estos son IDs de imágenes populares de Unsplash que puedes cambiar
$cityImages = @{
    'madrid' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80'
    'barcelona' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80'
    'valencia' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80'
    'london' = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80'
    'paris' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80'
    'lyon' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80'
    'new-york' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'los-angeles' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'chicago' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'miami' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'san-francisco' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'washington-dc' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'san-diego' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'atlanta' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'austin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'lisbon' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'sao-paulo' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'mexico-city' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'berlin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'hamburg' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'vienna' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'dublin' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'sydney' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'melbourne' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
    'brisbane' = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
}

# Imagen por defecto
$defaultImage = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Descargando imágenes de skyline nocturno" -ForegroundColor Cyan
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
        Invoke-WebRequest -Uri $imageUrl -OutFile $filePath -UseBasicParsing | Out-Null
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
        Invoke-WebRequest -Uri $defaultImage -OutFile $defaultPath -UseBasicParsing | Out-Null
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
    Write-Host "   Para imágenes específicas de cada ciudad, actualiza las URLs en el script." -ForegroundColor Yellow
    Write-Host "   Puedes encontrar imágenes en: https://unsplash.com/s/photos/night-skyline" -ForegroundColor Yellow
}
