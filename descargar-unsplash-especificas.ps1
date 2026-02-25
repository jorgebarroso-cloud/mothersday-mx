# Descargar imagenes especificas de Unsplash usando los IDs proporcionados
# Formato: https://images.unsplash.com/photo-[timestamp]-[id]?auto=format&fit=crop&w=800&h=600

$images = @{
    'atlanta' = @(
        'https://images.unsplash.com/photo-1700000000000-XV81dRUMzpo?auto=format&fit=crop&w=800&h=600&q=80',
        'https://unsplash.com/photos/XV81dRUMzpo/download?force=true&w=800',
        'https://source.unsplash.com/XV81dRUMzpo/800x600'
    )
    'austin' = @(
        'https://images.unsplash.com/photo-1700000000000-wKfTNWaDYgs?auto=format&fit=crop&w=800&h=600&q=80',
        'https://unsplash.com/photos/wKfTNWaDYgs/download?force=true&w=800',
        'https://source.unsplash.com/wKfTNWaDYgs/800x600'
    )
    'barcelona' = @(
        'https://images.unsplash.com/photo-1700000000000-hVhfqhDYciU?auto=format&fit=crop&w=800&h=600&q=80',
        'https://unsplash.com/photos/hVhfqhDYciU/download?force=true&w=800',
        'https://source.unsplash.com/hVhfqhDYciU/800x600'
    )
    'berlin' = @(
        'https://images.unsplash.com/photo-1700000000000-1uWanmgkd5g?auto=format&fit=crop&w=800&h=600&q=80',
        'https://unsplash.com/photos/1uWanmgkd5g/download?force=true&w=800',
        'https://source.unsplash.com/1uWanmgkd5g/800x600'
    )
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes especificas de Unsplash..." -ForegroundColor Cyan
Write-Host ""

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

foreach ($city in $images.Keys) {
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    $downloaded = $false
    
    foreach ($url in $images[$city]) {
        try {
            Write-Host "Descargando $city desde $($url.Substring(0, [Math]::Min(50, $url.Length)))..." -ForegroundColor Yellow -NoNewline
            $client.DownloadFile($url, $filepath)
            
            if ((Get-Item $filepath -ErrorAction SilentlyContinue).Length -gt 10000) {
                Write-Host " OK" -ForegroundColor Green
                $downloaded = $true
                break
            } else {
                Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            }
        } catch {
            Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            Write-Host " Error" -ForegroundColor Red
            continue
        }
    }
    
    if (-not $downloaded) {
        Write-Host "$city - No se pudo descargar" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 1000
}

$client.Dispose()
Write-Host ""
Write-Host "Descarga completada!" -ForegroundColor Green
Write-Host ""
