@echo off
REM Script para iniciar la preview del sitio
REM Ejecuta PowerShell con bypass de política de ejecución

echo ========================================
echo Iniciando Preview del Sitio
echo ========================================
echo.

cd /d "%~dp0"

REM Ejecutar el script PowerShell con bypass de política
powershell.exe -ExecutionPolicy Bypass -File "%~dp0ver-preview.ps1"

pause
