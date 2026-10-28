param(
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"
$stage = Join-Path $dist "chrome-network-egress-toggle-$Version"
$zip = "$stage.zip"

if (Test-Path -LiteralPath $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
}
if (Test-Path -LiteralPath $zip) {
    Remove-Item -LiteralPath $zip -Force
}

New-Item -ItemType Directory -Force -Path $stage | Out-Null

foreach ($name in @("extension", "clash", "docs", "scripts")) {
    Copy-Item -LiteralPath (Join-Path $root $name) -Destination $stage -Recurse
}

foreach ($name in @("README.md", "SECURITY.md", "LICENSE")) {
    Copy-Item -LiteralPath (Join-Path $root $name) -Destination $stage
}

Compress-Archive -LiteralPath $stage -DestinationPath $zip -CompressionLevel Optimal
Get-FileHash -Algorithm SHA256 -LiteralPath $zip

