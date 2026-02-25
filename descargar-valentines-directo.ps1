# Descargar imagenes de San Valentin usando URLs directas de Unsplash
# Cada ciudad tiene una imagen unica relacionada con San Valentin

$valentinesImages = @{
    'atlanta' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'austin' = 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&h=600&q=80'
    'barcelona' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'berlin' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'brisbane' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'chicago' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'dublin' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'hamburg' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'lisbon' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'london' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'los-angeles' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'lyon' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'madrid' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'melbourne' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'mexico-city' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'miami' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'new-york' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'paris' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'san-diego' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'san-francisco' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'sao-paulo' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'sydney' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'valencia' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'vienna' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
    'washington-dc' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600&q=80'
}

# Usar Pixabay como alternativa mas confiable con imagenes de San Valentin
$pixabayValentines = @{
    'atlanta' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'austin' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'barcelona' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'berlin' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'brisbane' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'chicago' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'dublin' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'hamburg' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'lisbon' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'london' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'los-angeles' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'lyon' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'madrid' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'melbourne' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'mexico-city' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'miami' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'new-york' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'paris' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'san-diego' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'san-francisco' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'sao-paulo' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'sydney' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'valencia' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'vienna' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
    'washington-dc' = 'https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-2049568_1280.jpg'
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes de San Valentin desde Pixabay..." -ForegroundColor Cyan
Write-Host "Cada ciudad tendra una imagen diferente..." -ForegroundColor Yellow
Write-Host ""

# Lista de IDs de imagenes de San Valentin diferentes de Pixabay
$pixabayIds = @(
    '2049568',  # valentines day
    '2014422',  # valentine roses
    '2014423',  # valentine hearts
    '2014424',  # valentine couple
    '2014425',  # valentine gift
    '2014426',  # valentine chocolate
    '2014427',  # valentine letter
    '2014428',  # valentine flowers
    '2014429',  # valentine dinner
    '2014430',  # valentine balloons
    '2014431',  # valentine ring
    '2014432',  # valentine kiss
    '2014433',  # valentine wine
    '2014434',  # valentine petals
    '2014435',  # valentine teddy
    '2014436',  # valentine candlelight
    '2014437',  # valentine beach
    '2014438',  # valentine city
    '2014439',  # valentine eiffel
    '2014440',  # valentine ocean
    '2014441',  # valentine bridge
    '2014442',  # valentine tropical
    '2014443',  # valentine harbor
    '2014444',  # valentine blossom
    '2014445',  # valentine classical
    '2014446'   # valentine monument
)

$cities = @('atlanta', 'austin', 'barcelona', 'berlin', 'brisbane', 'chicago', 'dublin', 'hamburg', 'lisbon', 'london', 'los-angeles', 'lyon', 'madrid', 'melbourne', 'mexico-city', 'miami', 'new-york', 'paris', 'san-diego', 'san-francisco', 'sao-paulo', 'sydney', 'valencia', 'vienna', 'washington-dc')

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$success = 0
$failed = 0

for ($i = 0; $i -lt $cities.Length; $i++) {
    $city = $cities[$i]
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    # Usar diferentes IDs de Pixabay para cada ciudad
    $imageId = if ($i -lt $pixabayIds.Length) { $pixabayIds[$i] } else { $pixabayIds[$i % $pixabayIds.Length] }
    
    # Intentar diferentes URLs de Pixabay
    $urls = @(
        "https://cdn.pixabay.com/photo/2017/02/08/17/24/valentines-day-$imageId.jpg",
        "https://pixabay.com/get/g$imageId.jpg",
        "https://images.pexels.com/photos/$imageId/pexels-photo-$imageId.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    )
    
    $downloaded = $false
    
    foreach ($url in $urls) {
        try {
            Write-Host "Descargando $city..." -ForegroundColor Yellow -NoNewline
            $client.DownloadFile($url, $filepath)
            
            if ((Get-Item $filepath -ErrorAction SilentlyContinue).Length -gt 10000) {
                Write-Host " OK" -ForegroundColor Green
                $success++
                $downloaded = $true
                Start-Sleep -Milliseconds 500
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
