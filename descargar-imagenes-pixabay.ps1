# Descargar imagenes desde Pixabay - mas confiable y sin API key necesario
# Usando URLs directas de Pixabay con imagenes reconocibles de cada ciudad

$cities = @{
    'atlanta' = @(
        'https://cdn.pixabay.com/photo/2016/11/29/09/16/atlanta-1868565_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/11/29/09/16/atlanta-1868565_960_720.jpg'
    )
    'berlin' = @(
        'https://cdn.pixabay.com/photo/2016/08/11/23/48/berlin-1587545_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/08/11/23/48/berlin-1587545_960_720.jpg'
    )
    'hamburg' = @(
        'https://cdn.pixabay.com/photo/2016/11/29/12/13/hamburg-1868570_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/11/29/12/13/hamburg-1868570_960_720.jpg'
    )
    'san-diego' = @(
        'https://cdn.pixabay.com/photo/2015/10/12/14/57/san-diego-984111_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/10/12/14/57/san-diego-984111_960_720.jpg'
    )
    'sao-paulo' = @(
        'https://cdn.pixabay.com/photo/2015/07/29/22/56/sao-paulo-865804_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/07/29/22/56/sao-paulo-865804_960_720.jpg'
    )
    'washington-dc' = @(
        'https://cdn.pixabay.com/photo/2016/10/20/18/35/washington-1756241_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/10/20/18/35/washington-1756241_960_720.jpg'
    )
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes desde Pixabay..." -ForegroundColor Cyan
Write-Host ""

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

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
    
    $downloaded = $false
    
    foreach ($url in $cities[$city]) {
        try {
            Write-Host "Descargando $city..." -ForegroundColor Yellow -NoNewline
            $client.DownloadFile($url, $filepath)
            
            if ((Get-Item $filepath).Length -gt 10000) {
                Write-Host " OK" -ForegroundColor Green
                $success++
                $downloaded = $true
                Start-Sleep -Milliseconds 800
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
        $failed++
    }
}

$client.Dispose()

Write-Host ""
Write-Host "Completado: $success exitosas, $failed fallidas" -ForegroundColor Cyan
Write-Host ""
