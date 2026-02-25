# Mother's Day UK - Build static site (bundle CSS, minify JS)
# Run before deploy. Requires: npm install -g terser clean-css-cli (optional)
# Optional: -RefreshFever to run fetch-fever-plans.js before generate (requires Playwright: npx playwright install chromium)

param([switch]$RefreshFever)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

# 1. Combine CSS into bundle.css (order: variables, fonts, glide, styles, animations)
$cssFiles = @(
    "$root\css\variables.css",
    "$root\css\fonts.css",
    "$root\css\glide.core.min.css",
    "$root\css\styles.css",
    "$root\css\animations.css"
)
$bundlePath = "$root\css\bundle.css"
$content = Get-Content $cssFiles -Raw -ErrorAction SilentlyContinue
if ($content) { Set-Content -Path $bundlePath -Value $content -Encoding UTF8 }

# 2. Minify CSS (if cleancss is available)
$cleancss = Get-Command cleancss -ErrorAction SilentlyContinue
if ($cleancss) {
    & cleancss -o "$root\css\bundle.min.css" "$root\css\bundle.css"
    Write-Host "CSS minified: bundle.min.css"
} else {
    Copy-Item "$root\css\bundle.css" "$root\css\bundle.min.css" -Force
    Write-Host "cleancss not found; bundle.css copied to bundle.min.css"
}

# 3. Minify JS (if terser is available)
$terser = Get-Command terser -ErrorAction SilentlyContinue
if ($terser) {
    & terser "$root\js\main.js" -o "$root\js\main.min.js" -c -m
    Write-Host "JS minified: main.min.js"
} else {
    Copy-Item "$root\js\main.js" "$root\js\main.min.js" -Force
    Write-Host "terser not found; main.js copied to main.min.js"
}

# 4. Download Glide.js if missing (optional)
$glidePath = "$root\js\glide.min.js"
$glideContent = Get-Content $glidePath -Raw -ErrorAction SilentlyContinue
if ($glideContent -match "Download Glide") {
    Write-Host "Download Glide.js: curl -o js/glide.min.js https://cdn.jsdelivr.net/npm/@glidejs/glide@3.6.1/dist/glide.min.js"
}

# 5. Optional: refresh plans from Fever (requires Playwright)
if ($RefreshFever) {
    Write-Host "Refreshing plans from Fever (fetch-fever-plans.js)..."
    & node "$root\scripts\fetch-fever-plans.js"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Fetch failed; continuing with existing data/fever-plans-uk.json"
    }
}

# 6. Regenerate city pages from data
& node "$root\scripts\generate-city-pages.js"

Write-Host "Build complete."
