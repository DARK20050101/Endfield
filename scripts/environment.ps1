# Dot-source this file before native commands; changes only the current process.
$endfieldCache = Join-Path (Split-Path -Parent $PSScriptRoot) '../.cache/endfield'
$endfieldCache = [System.IO.Path]::GetFullPath($endfieldCache)
if (-not $env:RUSTUP_HOME) { $env:RUSTUP_HOME = Join-Path $endfieldCache 'rustup' }
if (-not $env:CARGO_HOME) { $env:CARGO_HOME = Join-Path $endfieldCache 'cargo' }
$endfieldCargoBin = Join-Path $env:CARGO_HOME 'bin'
if (Test-Path -LiteralPath $endfieldCargoBin) { $env:PATH = "$endfieldCargoBin;$env:PATH" }
$env:npm_config_cache = Join-Path $endfieldCache 'npm'
# Set ANDROID_HOME, NDK_HOME and JAVA_HOME explicitly once the SDK is installed.
