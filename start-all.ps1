$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendScript = Join-Path $projectRoot "start-backend.ps1"
$frontendScript = Join-Path $projectRoot "start-frontend.ps1"

Write-Host "Using project path: $projectRoot" -ForegroundColor Cyan

if (-not (Test-Path $backendScript)) {
    Write-Host "Missing backend launcher: $backendScript" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendScript)) {
    Write-Host "Missing frontend launcher: $frontendScript" -ForegroundColor Red
    exit 1
}

Write-Host "Opening backend window..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $backendScript
)

Start-Sleep -Seconds 2

Write-Host "Opening frontend window..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $frontendScript
)

Write-Host "Frontend should open on http://localhost:3000" -ForegroundColor Green
Write-Host "Backend should open on http://localhost:8000" -ForegroundColor Green
