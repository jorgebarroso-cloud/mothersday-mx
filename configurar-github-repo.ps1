# Script para configurar el repositorio de GitHub
# Ejecuta este script después de crear el repositorio en GitHub

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Configurar Repositorio de GitHub" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Por favor, ingresa la URL de tu repositorio de GitHub:" -ForegroundColor Yellow
Write-Host "Ejemplo: https://github.com/TU_USUARIO/celebrate-valentines.git" -ForegroundColor Gray
$repoUrl = Read-Host "URL del repositorio"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Error: URL no puede estar vacía." -ForegroundColor Red
    exit 1
}

# Verificar formato de URL
if (-not ($repoUrl -match "^https://github\.com/.*\.git$")) {
    Write-Host "⚠️  Advertencia: La URL no parece ser válida. Continuando de todas formas..." -ForegroundColor Yellow
}

Write-Host "`n🔧 Configurando repositorio remoto..." -ForegroundColor Yellow

# Agregar remote
git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -ne 0) {
    # Si ya existe, actualizar
    Write-Host "⚠️  El remote 'origin' ya existe. Actualizando..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Cambiar branch a main
Write-Host "`n🌿 Configurando branch principal..." -ForegroundColor Yellow
git branch -M main 2>$null

# Verificar estado
Write-Host "`n📊 Estado actual:" -ForegroundColor Yellow
git status

Write-Host "`n🚀 ¿Quieres hacer push ahora? (S/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s" -or $response -eq "Y" -or $response -eq "y") {
    Write-Host "`n📤 Haciendo push a GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ ¡Proyecto subido a GitHub exitosamente!" -ForegroundColor Green
        Write-Host "`n🌐 URL del repositorio: $repoUrl" -ForegroundColor Cyan
        
        Write-Host "`n📝 Próximos pasos para desplegar online:" -ForegroundColor Yellow
        Write-Host "1. Ve a https://vercel.com" -ForegroundColor White
        Write-Host "2. Inicia sesión con tu cuenta de GitHub" -ForegroundColor White
        Write-Host "3. Haz clic en 'Add New Project'" -ForegroundColor White
        Write-Host "4. Selecciona tu repositorio 'celebrate-valentines'" -ForegroundColor White
        Write-Host "5. Vercel detectará automáticamente Next.js" -ForegroundColor White
        Write-Host "6. Haz clic en 'Deploy' y en unos minutos estará online!" -ForegroundColor White
        
        Write-Host "`n💡 Alternativa: Usa la CLI de Vercel" -ForegroundColor Yellow
        Write-Host "   npm i -g vercel" -ForegroundColor Green
        Write-Host "   vercel" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Error al hacer push. Verifica:" -ForegroundColor Red
        Write-Host "   - Que el repositorio existe en GitHub" -ForegroundColor White
        Write-Host "   - Que tienes permisos de escritura" -ForegroundColor White
        Write-Host "   - Que tu autenticación de GitHub está configurada" -ForegroundColor White
    }
} else {
    Write-Host "`n✅ Configuración completada. Puedes hacer push manualmente con:" -ForegroundColor Green
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n========================================" -ForegroundColor Cyan
