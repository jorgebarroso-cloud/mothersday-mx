# Descargar imagenes de San Valentin diferentes para cada ciudad
# Cada ciudad tendra una imagen unica relacionada con San Valentin

$cities = @{
    'atlanta' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'austin' = 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&h=600'
    'barcelona' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'berlin' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'brisbane' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'chicago' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'dublin' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'hamburg' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'lisbon' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'london' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'los-angeles' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'lyon' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'madrid' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'melbourne' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'mexico-city' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'miami' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'new-york' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'paris' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'san-diego' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'san-francisco' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'sao-paulo' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'sydney' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'valencia' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'vienna' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
    'washington-dc' = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&h=600'
}

# Usar busquedas de Unsplash Source para obtener imagenes diferentes de San Valentin
$valentinesSearches = @{
    'atlanta' = 'valentine%20roses%20red'
    'austin' = 'valentine%20heart%20candles'
    'barcelona' = 'valentine%20couple%20romantic'
    'berlin' = 'valentine%20gift%20box'
    'brisbane' = 'valentine%20chocolate%20hearts'
    'chicago' = 'valentine%20love%20letter'
    'dublin' = 'valentine%20flowers%20bouquet'
    'hamburg' = 'valentine%20romantic%20dinner'
    'lisbon' = 'valentine%20heart%20balloons'
    'london' = 'valentine%20ring%20proposal'
    'los-angeles' = 'valentine%20kiss%20couple'
    'lyon' = 'valentine%20wine%20romantic'
    'madrid' = 'valentine%20rose%20petals'
    'melbourne' = 'valentine%20teddy%20bear'
    'mexico-city' = 'valentine%20candlelight%20romantic'
    'miami' = 'valentine%20beach%20sunset'
    'new-york' = 'valentine%20city%20lights%20romantic'
    'paris' = 'valentine%20eiffel%20tower%20love'
    'san-diego' = 'valentine%20ocean%20sunset'
    'san-francisco' = 'valentine%20bridge%20sunset'
    'sao-paulo' = 'valentine%20tropical%20romantic'
    'sydney' = 'valentine%20harbor%20sunset'
    'valencia' = 'valentine%20orange%20blossom'
    'vienna' = 'valentine%20classical%20romantic'
    'washington-dc' = 'valentine%20monument%20sunset'
}

$imagesDir = "public\images\posters"

Write-Host ""
Write-Host "Descargando imagenes de San Valentin unicas para cada ciudad..." -ForegroundColor Cyan
Write-Host "Esto puede tardar varios minutos..." -ForegroundColor Yellow
Write-Host ""

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$success = 0
$failed = 0

foreach ($city in $valentinesSearches.Keys) {
    $filename = "skyline-$city.jpg"
    $filepath = Join-Path $imagesDir $filename
    
    try {
        Write-Host "Descargando $city..." -ForegroundColor Yellow -NoNewline
        
        # Usar Unsplash Source con busqueda de San Valentin
        $search = $valentinesSearches[$city]
        $url = "https://source.unsplash.com/800x600/?$search"
        
        $client.DownloadFile($url, $filepath)
        
        if ((Get-Item $filepath).Length -gt 10000) {
            Write-Host " OK" -ForegroundColor Green
            $success++
        } else {
            Remove-Item $filepath -Force
            Write-Host " Archivo invalido" -ForegroundColor Red
            $failed++
        }
        
        Start-Sleep -Seconds 2  # Pausa para no sobrecargar el servidor
        
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

$client.Dispose()

Write-Host ""
Write-Host "Descarga completada!" -ForegroundColor Green
Write-Host "Exitosas: $success | Fallidas: $failed" -ForegroundColor Cyan
Write-Host ""
