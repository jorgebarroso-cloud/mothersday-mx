# Script para descargar las 6 ciudades faltantes con imagenes reales y reconocibles
# Usando diferentes fuentes y metodos

$missingCities = @(
    @{ slug = 'atlanta'; name = 'Atlanta'; urls = @(
        'https://images.unsplash.com/photo-1514119412353-e1ed8c1e9b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1514119412353-e1ed8c1e9b0b?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?atlanta%20georgia%20skyline'
    )},
    @{ slug = 'berlin'; name = 'Berlin'; urls = @(
        'https://images.unsplash.com/photo-1587330979470-3585ac3ac3a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1587330979470-3585ac3ac3a8?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?berlin%20brandenburg%20gate%20night'
    )},
    @{ slug = 'hamburg'; name = 'Hamburg'; urls = @(
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?hamburg%20germany%20harbor%20night'
    )},
    @{ slug = 'san-diego'; name = 'San Diego'; urls = @(
        'https://images.unsplash.com/photo-1605733512204-9866c9cf97f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1605733512204-9866c9cf97f1?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?san%20diego%20california%20skyline%20night'
    )},
    @{ slug = 'sao-paulo'; name = 'Sao Paulo'; urls = @(
        'https://images.unsplash.com/photo-1543059080-f9b1279ba3f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1543059080-f9b1279ba3f6?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?sao%20paulo%20brazil%20skyline%20night'
    )},
    @{ slug = 'washington-dc'; name = 'Washington DC'; urls = @(
        'https://images.unsplash.com/photo-1478146897156-19388e7840c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
        'https://images.unsplash.com/photo-1478146897156-19388e7840c0?w=800&h=600&fit=crop',
        'https://source.unsplash.com/800x600/?washington%20dc%20capitol%20building%20night'
    )}
)

$imagesDir = "public\images\posters"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

Write-Host ""
Write-Host "Descargando imagenes faltantes con diferentes metodos..." -ForegroundColor Cyan
Write-Host ""

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$success = 0
$failed = 0

foreach ($city in $missingCities) {
    $filename = "skyline-$($city.slug).jpg"
    $filepath = Join-Path $imagesDir $filename
    
    # Si ya existe, saltar
    if (Test-Path $filepath) {
        Write-Host "$($city.name) - Ya existe" -ForegroundColor Gray
        $success++
        continue
    }
    
    $downloaded = $false
    
    # Intentar con cada URL hasta que una funcione
    foreach ($url in $city.urls) {
        try {
            Write-Host "Intentando $($city.name)..." -ForegroundColor Yellow -NoNewline
            $client.DownloadFile($url, $filepath)
            
            # Verificar que el archivo se descargo correctamente (tamaño > 0)
            $fileInfo = Get-Item $filepath
            if ($fileInfo.Length -gt 1000) {
                Write-Host " OK" -ForegroundColor Green
                $success++
                $downloaded = $true
                Start-Sleep -Milliseconds 500
                break
            } else {
                Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Continuar con la siguiente URL
            Remove-Item $filepath -Force -ErrorAction SilentlyContinue
            continue
        }
    }
    
    if (-not $downloaded) {
        Write-Host " ERROR - No se pudo descargar" -ForegroundColor Red
        $failed++
    }
}

$client.Dispose()

Write-Host ""
Write-Host "Descarga completada!" -ForegroundColor Green
Write-Host "Exitosas: $success | Fallidas: $failed" -ForegroundColor Cyan
Write-Host ""
