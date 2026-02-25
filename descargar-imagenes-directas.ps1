# Descargar imagenes usando URLs directas de Unsplash con IDs conocidos
# Estas son imagenes reales y reconocibles de cada ciudad

$cities = @{
    'atlanta' = 'https://images.unsplash.com/photo-1514119412353-e1ed8c1e9b0b?auto=format&fit=crop&w=800&h=600'
    'berlin' = 'https://images.unsplash.com/photo-1587330979470-3585ac3ac3a8?auto=format&fit=crop&w=800&h=600'
    'hamburg' = 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&h=600'
    'san-diego' = 'https://images.unsplash.com/photo-1605733512204-9866c9cf97f1?auto=format&fit=crop&w=800&h=600'
    'sao-paulo' = 'https://images.unsplash.com/photo-1543059080-f9b1279ba3f6?auto=format&fit=crop&w=800&h=600'
    'washington-dc' = 'https://images.unsplash.com/photo-1478146897156-19388e7840c0?auto=format&fit=crop&w=800&h=600'
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes usando URLs directas..." -ForegroundColor Cyan
Write-Host ""

$success = 0
$failed = 0

foreach ($city in $cities.Keys) {
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    if (Test-Path $filepath) {
        Write-Host "$city - Ya existe" -ForegroundColor Gray
        $success++
        continue
    }
    
    try {
        Write-Host "Descargando $city..." -ForegroundColor Yellow -NoNewline
        
        $request = [System.Net.WebRequest]::Create($cities[$city])
        $request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        $request.Timeout = 30000
        $response = $request.GetResponse()
        
        $stream = $response.GetResponseStream()
        $fileStream = [System.IO.File]::Create($filepath)
        $stream.CopyTo($fileStream)
        
        $fileStream.Close()
        $stream.Close()
        $response.Close()
        
        if ((Get-Item $filepath).Length -gt 1000) {
            Write-Host " OK" -ForegroundColor Green
            $success++
        } else {
            Remove-Item $filepath -Force
            Write-Host " Archivo invalido" -ForegroundColor Red
            $failed++
        }
        
        Start-Sleep -Milliseconds 1000
        
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Completado: $success exitosas, $failed fallidas" -ForegroundColor Cyan
Write-Host ""
