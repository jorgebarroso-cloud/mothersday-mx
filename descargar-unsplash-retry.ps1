# Reintentar descarga de imagenes que fallaron

$failed = @{
    'brisbane' = 'GCONuxHBJJE'
    'dublin' = '1fH4aCcuncY'
    'hamburg' = '44ufQsRlbCk'
    'lisbon' = 'RJHdS6xLNNg'
    'london' = '8nVNRt0Ltxg'
    'los-angeles' = 'Zh0s1o3Zi5Y'
    'melbourne' = '--gmtAa0Q5MI'
    'miami' = 'iAgm1Xlfc4U'
    'new-york' = 'MdrJol8olLg'
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Reintentando descarga de imagenes fallidas..." -ForegroundColor Cyan
Write-Host ""

foreach ($city in $failed.Keys) {
    $id = $failed[$city]
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    # Si ya existe, saltar
    if (Test-Path $filepath) {
        Write-Host "$city - Ya existe" -ForegroundColor Gray
        continue
    }
    
    # Intentar diferentes URLs y métodos
    $urls = @(
        "https://unsplash.com/photos/$id/download?force=true&w=800",
        "https://unsplash.com/photos/$id/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fA%3D%3D&w=800",
        "https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=800&h=600&q=80"
    )
    
    Write-Host "Descargando $city (ID: $id)..." -ForegroundColor Yellow -NoNewline
    
    $downloaded = $false
    
    foreach ($url in $urls) {
        try {
            $request = [System.Net.HttpWebRequest]::Create($url)
            $request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            $request.Headers.Add("Accept", "image/webp,image/apng,image/*,*/*;q=0.8")
            $request.Headers.Add("Accept-Language", "en-US,en;q=0.9")
            $request.Headers.Add("Referer", "https://unsplash.com/")
            $request.AllowAutoRedirect = $true
            $request.Timeout = 30000
            
            $response = $request.GetResponse()
            $stream = $response.GetResponseStream()
            
            $fileStream = [System.IO.File]::Create($filepath)
            $stream.CopyTo($fileStream)
            
            $fileStream.Close()
            $stream.Close()
            $response.Close()
            
            if ((Get-Item $filepath -ErrorAction SilentlyContinue).Length -gt 10000) {
                Write-Host " OK" -ForegroundColor Green
                $downloaded = $true
                break
            } else {
                Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            }
        } catch {
            Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            continue
        }
    }
    
    if (-not $downloaded) {
        Write-Host " ERROR" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 3  # Pausa mas larga para evitar rate limiting
}

Write-Host ""
Write-Host "Reintento completado!" -ForegroundColor Green
Write-Host ""
