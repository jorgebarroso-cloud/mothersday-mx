# Descargar imagenes especificas de Unsplash - Lote 2

$images = @{
    'brisbane' = 'GCONuxHBJJE'
    'chicago' = 'Nyvq2juw4_o'
    'dublin' = '1fH4aCcuncY'
    'hamburg' = '44ufQsRlbCk'
    'lisbon' = 'RJHdS6xLNNg'  # lisboa -> lisbon
    'london' = '8nVNRt0Ltxg'
    'los-angeles' = 'Zh0s1o3Zi5Y'  # los angeles -> los-angeles
    'lyon' = '6tcJQYz--jU'
    'madrid' = 'WBGjg0DsO_g'
    'melbourne' = '--gmtAa0Q5MI'
    'mexico-city' = '7LDBKPWAHJ4'  # mexico city -> mexico-city
    'miami' = 'iAgm1Xlfc4U'
    'new-york' = 'MdrJol8olLg'  # new york -> new-york
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes especificas de Unsplash - Lote 2..." -ForegroundColor Cyan
Write-Host ""

foreach ($city in $images.Keys) {
    $id = $images[$city]
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    # Usar el endpoint de descarga de Unsplash
    $url = "https://unsplash.com/photos/$id/download?force=true&w=800"
    
    Write-Host "Descargando $city (ID: $id)..." -ForegroundColor Yellow -NoNewline
    
    try {
        # Usar HttpWebRequest para seguir redirecciones
        $request = [System.Net.HttpWebRequest]::Create($url)
        $request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        $request.AllowAutoRedirect = $true
        $request.Timeout = 30000
        
        $response = $request.GetResponse()
        $stream = $response.GetResponseStream()
        
        $fileStream = [System.IO.File]::Create($filepath)
        $stream.CopyTo($fileStream)
        
        $fileStream.Close()
        $stream.Close()
        $response.Close()
        
        if ((Get-Item $filepath).Length -gt 10000) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Remove-Item $filepath -Force
            Write-Host " Archivo invalido" -ForegroundColor Red
        }
        
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 1500
}

Write-Host ""
Write-Host "Descarga completada!" -ForegroundColor Green
Write-Host ""
