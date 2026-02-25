# Corregir las 3 ciudades que fallaron
$baseDir = "public\images\posters"

$cities = @{
    'atlanta' = 'https://images.unsplash.com/photo-1533690876270-13b7a3fa7a19?w=800&h=600&fit=crop'
    'berlin' = 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&h=600&fit=crop'
    'hamburg' = 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&h=600&fit=crop'
}

Write-Host "`nCorrigiendo ciudades faltantes..." -ForegroundColor Cyan

foreach ($city in $cities.Keys) {
    $url = $cities[$city]
    $outputFile = "$baseDir\skyline-$city.jpg"
    
    Write-Host "Descargando $city..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputFile -UserAgent "Mozilla/5.0" -TimeoutSec 30 -ErrorAction Stop
        if (Test-Path $outputFile) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " ERROR" -ForegroundColor Red
        }
    }
    catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
