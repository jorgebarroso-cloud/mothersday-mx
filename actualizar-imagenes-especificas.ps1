# Script para actualizar imágenes específicas de ciudades desde Unsplash
# Usa el endpoint de descarga directa de Unsplash

$baseDir = "public\images\posters"
if (-not (Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
}

# Photo IDs extraídos de las URLs proporcionadas
$cityPhotoIds = @{
    'atlanta' = 'AfnosnmGhtA'
    'austin' = 'wKfTNWaDYgs'
    'barcelona' = 'hVhfqhDYciU'
    'berlin' = '1uWanmgkd5g'
    'brisbane' = 'GCONuxHBJJE'
    'dublin' = 'NL2ORrGh8KM'
    'hamburg' = '44ufQsRlbCk'
    'los-angeles' = 'Zh0s1o3Zi5Y'
    'lyon' = '6tcJQYz--jU'
    'melbourne' = 'vTc4z3CrhmY'
    'san-diego' = 'RQF6bbS4shw'
    'sao-paulo' = '0phxYpfFHpg'
    'valencia' = 'bYGKCxc5qqM'
    'vienna' = 'Th2MisvdKr0'
    'washington-dc' = 'mN20KMlXR9A'
}

Write-Host "`n=== Actualizando imagenes especificas de ciudades ===" -ForegroundColor Cyan
Write-Host "Total de ciudades a actualizar: $($cityPhotoIds.Count)`n" -ForegroundColor Yellow

$successCount = 0
$failCount = 0

foreach ($city in $cityPhotoIds.Keys) {
    $photoId = $cityPhotoIds[$city]
    $outputFile = "$baseDir\skyline-$city.jpg"
    
    Write-Host "Actualizando $city (ID: $photoId)..." -ForegroundColor White -NoNewline
    
    # Try multiple download methods
    $urls = @(
        # Method 1: Direct download endpoint (may redirect)
        "https://unsplash.com/photos/$photoId/download?force=true&w=1200",
        "https://unsplash.com/photos/$photoId/download?w=1200",
        # Method 2: Direct image URL format
        "https://images.unsplash.com/photo-$photoId?w=1200&h=800&fit=crop&q=85",
        "https://images.unsplash.com/photo-$photoId?w=800&h=600&fit=crop&q=85",
        # Method 3: Source Unsplash (legacy)
        "https://source.unsplash.com/$photoId/1200x800"
    )
    
    $downloaded = $false
    foreach ($url in $urls) {
        try {
            $headers = @{
                'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                'Accept' = '*/*'
                'Referer' = "https://unsplash.com/photos/$photoId"
            }
            
            # Use -UseBasicParsing to avoid IE engine issues
            $response = Invoke-WebRequest -Uri $url -Headers $headers -OutFile $outputFile -TimeoutSec 30 -UseBasicParsing -ErrorAction Stop
            
            if (Test-Path $outputFile -PathType Leaf) {
                $fileSize = (Get-Item $outputFile).Length / 1KB
                if ($fileSize -gt 10) {
                    Write-Host " OK ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
                    $successCount++
                    $downloaded = $true
                    break
                } else {
                    Remove-Item $outputFile -Force -ErrorAction SilentlyContinue
                }
            }
        }
        catch {
            # Check if it's a redirect (302)
            if ($_.Exception.Response.StatusCode -eq 302 -or $_.Exception.Response.StatusCode -eq 301) {
                try {
                    $location = $_.Exception.Response.Headers.Location
                    if ($location) {
                        $redirectUrl = if ($location -is [string]) { $location } else { $location.ToString() }
                        Write-Host "  Redireccion a: $redirectUrl" -ForegroundColor Gray -NoNewline
                        $redirectResponse = Invoke-WebRequest -Uri $redirectUrl -Headers $headers -OutFile $outputFile -TimeoutSec 30 -UseBasicParsing -ErrorAction Stop
                        
                        if (Test-Path $outputFile -PathType Leaf) {
                            $fileSize = (Get-Item $outputFile).Length / 1KB
                            if ($fileSize -gt 10) {
                                Write-Host " OK ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
                                $successCount++
                                $downloaded = $true
                                break
                            }
                        }
                    }
                }
                catch {
                    # Continue to next URL
                }
            }
        }
    }
    
    if (-not $downloaded) {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "  URL manual: https://unsplash.com/photos/$photoId/download?force=true" -ForegroundColor Yellow
        $failCount++
    }
    
    Start-Sleep -Milliseconds 2000  # Be very respectful with rate limiting
}

Write-Host "`n=== Resumen ===" -ForegroundColor Cyan
Write-Host "Exitosas: $successCount" -ForegroundColor Green
Write-Host "Fallidas: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failCount -gt 0) {
    Write-Host "`nPara descargar manualmente las imagenes fallidas:" -ForegroundColor Yellow
    Write-Host "1. Visita: https://unsplash.com/photos/[ID]" -ForegroundColor White
    Write-Host "2. Haz clic en el boton de descarga" -ForegroundColor White
    Write-Host "3. Guarda la imagen como: public\images\posters\skyline-[ciudad].jpg" -ForegroundColor White
    Write-Host "`nIDs de las imagenes fallidas:" -ForegroundColor Yellow
    foreach ($city in $cityPhotoIds.Keys) {
        $outputFile = "$baseDir\skyline-$city.jpg"
        if (-not (Test-Path $outputFile)) {
            Write-Host "  $city : https://unsplash.com/photos/$($cityPhotoIds[$city])" -ForegroundColor White
        }
    }
}
