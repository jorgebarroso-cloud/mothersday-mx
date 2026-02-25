# Script para descargar imagenes reales y especificas de cada ciudad desde Unsplash
# Cada ciudad tiene una imagen unica y reconocible usando busquedas especificas

$cities = @(
    @{ slug = 'atlanta'; name = 'Atlanta'; search = 'atlanta%20georgia%20skyline' },
    @{ slug = 'austin'; name = 'Austin'; url = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'barcelona'; name = 'Barcelona'; url = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'berlin'; name = 'Berlin'; search = 'berlin%20brandenburg%20gate' },
    @{ slug = 'brisbane'; name = 'Brisbane'; url = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'chicago'; name = 'Chicago'; url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'dublin'; name = 'Dublin'; url = 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'hamburg'; name = 'Hamburg'; search = 'hamburg%20germany%20skyline' },
    @{ slug = 'lisbon'; name = 'Lisboa'; url = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'london'; name = 'London'; url = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'los-angeles'; name = 'Los Angeles'; url = 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'lyon'; name = 'Lyon'; url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'madrid'; name = 'Madrid'; url = 'https://images.unsplash.com/photo-1531590878845-12627191e687?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'melbourne'; name = 'Melbourne'; url = 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'mexico-city'; name = 'Mexico City'; url = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'miami'; name = 'Miami'; url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'new-york'; name = 'New York'; url = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'paris'; name = 'Paris'; url = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'san-diego'; name = 'San Diego'; search = 'san%20diego%20california%20skyline' },
    @{ slug = 'san-francisco'; name = 'San Francisco'; url = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'sao-paulo'; name = 'Sao Paulo'; search = 'sao%20paulo%20brazil%20skyline' },
    @{ slug = 'sydney'; name = 'Sydney'; url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'valencia'; name = 'Valencia'; url = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'vienna'; name = 'Vienna'; url = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop&q=80' },
    @{ slug = 'washington-dc'; name = 'Washington DC'; search = 'washington%20dc%20capitol' }
)

$imagesDir = "public\images\posters"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

Write-Host ""
Write-Host "Descargando imagenes reales y especificas de cada ciudad..." -ForegroundColor Cyan
Write-Host "Esto puede tardar varios minutos..." -ForegroundColor Yellow
Write-Host ""

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0")

$success = 0
$failed = 0

foreach ($city in $cities) {
    $filename = "skyline-$($city.slug).jpg"
    $filepath = Join-Path $imagesDir $filename
    
    try {
        # Si tiene URL directa, usarla; si no, usar busqueda
        if ($city.url) {
            $url = $city.url
        } else {
            $url = "https://source.unsplash.com/800x600/?$($city.search)"
        }
        
        Write-Host "Descargando $($city.name)..." -ForegroundColor Yellow -NoNewline
        $client.DownloadFile($url, $filepath)
        Write-Host " OK" -ForegroundColor Green
        $success++
        
        Start-Sleep -Milliseconds 800
        
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

$client.Dispose()

Write-Host ""
Write-Host "Descarga completada!" -ForegroundColor Green
Write-Host "Exitosas: $success | Fallidas: $failed" -ForegroundColor Cyan
Write-Host "Las imagenes se han guardado en: $imagesDir" -ForegroundColor Cyan
Write-Host ""
