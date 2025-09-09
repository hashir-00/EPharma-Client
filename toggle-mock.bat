@echo off
REM Toggle Mock Mode Script for Windows

set ENV_FILE=.env.development

if not exist "%ENV_FILE%" (
    echo Error: %ENV_FILE% not found
    exit /b 1
)

findstr "VITE_MOCK_MODE=true" "%ENV_FILE%" >nul
if %errorlevel%==0 (
    powershell -Command "(Get-Content '%ENV_FILE%') -replace 'VITE_MOCK_MODE=true', 'VITE_MOCK_MODE=false' | Set-Content '%ENV_FILE%'"
    echo Mock mode disabled (VITE_MOCK_MODE=false)
) else (
    powershell -Command "(Get-Content '%ENV_FILE%') -replace 'VITE_MOCK_MODE=false', 'VITE_MOCK_MODE=true' | Set-Content '%ENV_FILE%'"
    echo Mock mode enabled (VITE_MOCK_MODE=true)
)

echo Please restart the development server for changes to take effect.
pause
