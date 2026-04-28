$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Join-Path $projectRoot "frontend"
$tempRoot = Join-Path $frontendRoot ".tmp"

Write-Host "Starting frontend from $frontendRoot" -ForegroundColor Cyan

if (-not (Test-Path $frontendRoot)) {
    Write-Host "Frontend folder was not found at $frontendRoot" -ForegroundColor Red
    exit 1
}

if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host "Port 3000 is already in use. Frontend may already be running." -ForegroundColor Yellow
    exit 0
}

New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

$env:TMP = $tempRoot
$env:TEMP = $tempRoot
$env:BROWSER = "none"

Set-Location $frontendRoot
& npm.cmd start
