$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Join-Path $projectRoot "backend"
$venvPython = Join-Path $backendRoot "venv\Scripts\python.exe"

Write-Host "Starting backend from $backendRoot" -ForegroundColor Cyan

if (-not (Test-Path $venvPython)) {
    Write-Host "Backend virtualenv was not found at $venvPython" -ForegroundColor Red
    exit 1
}

if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "Port 8000 is already in use. Backend may already be running." -ForegroundColor Yellow
    exit 0
}

Set-Location $backendRoot

try {
    & $venvPython .\server.py
} catch {
    Write-Host "Backend failed to start." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "If this is a fresh setup, install backend deps with:" -ForegroundColor Yellow
    Write-Host ".\venv\Scripts\pip.exe install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}
