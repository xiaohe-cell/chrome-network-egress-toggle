$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifest = Join-Path $root "extension\manifest.json"
$background = Join-Path $root "extension\background.js"
$clashScript = Join-Path $root "clash\chrome-egress-listeners.js"

foreach ($path in @($manifest, $background, $clashScript)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing required file: $path"
    }
}

Get-Content -LiteralPath $manifest -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null

Write-Host "Source files: OK" -ForegroundColor Green

$listeners = netstat -ano -p tcp | Select-String -Pattern ':7895\s|:7896\s'
if ($listeners) {
    Write-Host "Current listeners:" -ForegroundColor Cyan
    $listeners | ForEach-Object { Write-Host $_.Line.Trim() }
} else {
    Write-Host "Ports 7895 and 7896 are not listening. Apply/reload the Clash script first." -ForegroundColor Yellow
}

Write-Host "Check complete. No configuration was changed." -ForegroundColor Green

