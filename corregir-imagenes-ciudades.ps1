# Script para corregir imágenes erróneas de ciudades
# Descarga imágenes correctas y reconocibles de cada ciudad desde Unsplash

$baseDir = "public\images\posters"
if (-not (Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
}

# URLs de Unsplash para ciudades con imágenes incorrectas
# Imágenes específicas y reconocibles de cada ciudad
$cityImages = @{
    # Atlanta - Skyline de Atlanta
    'atlanta' = 'https://images.unsplash.com/photo-1605581976833-0a1e0c0b0b0b?w=800&h=600&fit=crop&q=80'
    # Austin - Skyline de Austin con el río
    'austin' = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&q=80'
    # Berlin - Puerta de Brandenburgo
    'berlin' = 'https://images.unsplash.com/photo-1587330979470-3585ac3ac0cd?w=800&h=600&fit=crop&q=80'
    # Dublin - Trinity College
    'dublin' = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop&q=80'
    # Hamburg - Puerto de Hamburg
    'hamburg' = 'https://images.unsplash.com/photo-1587330979470-3585ac3ac0cd?w=800&h=600&fit=crop&q=80'
    # Los Angeles - Hollywood Sign
    'los-angeles' = 'https://images.unsplash.com/photo-1515895309288-a3815ab7cf81?w=800&h=600&fit=crop&q=80'
    # Lyon - Basílica de Fourvière
    'lyon' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80'
    # San Diego - Coronado Bridge
    'san-diego' = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&q=80'
    # São Paulo - Avenida Paulista
    'sao-paulo' = 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&h=600&fit=crop&q=80'
    # Vienna - Catedral de San Esteban
    'vienna' = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop&q=80'
}

Write-Host "`n=== Corrigiendo imagenes de ciudades ===" -ForegroundColor Cyan
Write-Host "Ciudades a corregir: $($cityImages.Count)`n" -ForegroundColor Yellow

$successCount = 0
$failCount = 0

foreach ($city in $cityImages.Keys) {
    $url = $cityImages[$city]
    $outputFile = "$baseDir\skyline-$city.jpg"
    
    Write-Host "Corrigiendo $city..." -ForegroundColor White -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -OutFile $outputFile -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -TimeoutSec 30 -ErrorAction Stop
        
        if (Test-Path $outputFile -PathType Leaf) {
            $fileSize = (Get-Item $outputFile).Length / 1KB
            $sizeKB = [math]::Round($fileSize, 2)
            Write-Host " OK ($sizeKB KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " ERROR (archivo no creado)" -ForegroundColor Red
            $failCount++
        }
    }
    catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== Resumen ===" -ForegroundColor Cyan
Write-Host "Exitosas: $successCount" -ForegroundColor Green
Write-Host "Fallidas: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
