# Script para descargar imágenes de ciudades desde Unsplash
# Usa URLs directas de Unsplash (gratuitas, sin API key)

$baseDir = "public\images\posters"
if (-not (Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
}

# URLs de Unsplash para cada ciudad (imágenes reconocibles y gratuitas)
$cityImages = @{
    'atlanta' = 'https://images.unsplash.com/photo-1533690876270-13b7a3fa7a19?w=800&h=600&fit=crop'
    'austin' = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'
    'barcelona' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop'
    'berlin' = 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&h=600&fit=crop'
    'brisbane' = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop'
    'chicago' = 'https://images.unsplash.com/photo-1494522358652-f17efc785328?w=800&h=600&fit=crop'
    'dublin' = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop'
    'hamburg' = 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&h=600&fit=crop'
    'lisbon' = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop'
    'london' = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop'
    'los-angeles' = 'https://images.unsplash.com/photo-1515895309288-a3815ab7cf81?w=800&h=600&fit=crop'
    'lyon' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop'
    'madrid' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop'
    'melbourne' = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop'
    'mexico-city' = 'https://images.unsplash.com/photo-1524222203290-0007d6a4c8d3?w=800&h=600&fit=crop&q=80'
    'miami' = 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&h=600&fit=crop'
    'new-york' = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop'
    'paris' = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop'
    'san-diego' = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'
    'san-francisco' = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
    'sao-paulo' = 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&h=600&fit=crop'
    'sydney' = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop'
    'valencia' = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop'
    'vienna' = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop'
    'washington-dc' = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop'
}

Write-Host "`n=== Descargando imagenes de ciudades desde Unsplash ===" -ForegroundColor Cyan
Write-Host "Total de ciudades: $($cityImages.Count)`n" -ForegroundColor Yellow

$successCount = 0
$failCount = 0

foreach ($city in $cityImages.Keys) {
    $url = $cityImages[$city]
    $outputFile = "$baseDir\skyline-$city.jpg"
    
    Write-Host "Descargando $city..." -ForegroundColor White -NoNewline
    
    try {
        # Usar Invoke-WebRequest con headers para evitar bloqueos
        $response = Invoke-WebRequest -Uri $url -OutFile $outputFile -UserAgent "Mozilla/5.0" -TimeoutSec 30 -ErrorAction Stop
        
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
    
    Start-Sleep -Milliseconds 500  # Pequeña pausa para no sobrecargar
}

Write-Host "`n=== Resumen ===" -ForegroundColor Cyan
Write-Host "Exitosas: $successCount" -ForegroundColor Green
Write-Host "Fallidas: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "`nImagenes guardadas en: $baseDir" -ForegroundColor Yellow
