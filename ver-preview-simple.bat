@echo off
REM Script simplificado para ver la preview
REM Ejecuta comandos directamente sin PowerShell

echo ========================================
echo Iniciando Preview del Sitio (Modo Simple)
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar si Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    echo Presiona cualquier tecla para abrir la pagina de descarga...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Verificar si npm está disponible
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no encontrado
    exit /b 1
)

echo [OK] npm encontrado
npm --version
echo.

REM Verificar e instalar dependencias
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    echo Esto puede tardar unos minutos...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas
    echo.
) else (
    echo [OK] Dependencias ya instaladas
    echo.
)

REM Iniciar servidor
echo ========================================
echo Iniciando servidor de desarrollo...
echo ========================================
echo.
echo El sitio estara disponible en:
echo    http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Abrir navegador después de 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Iniciar servidor de desarrollo
call npm run dev

pause
