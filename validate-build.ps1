$ErrorActionPreference = "Stop"

Write-Host "Starting build validation..." -ForegroundColor Green

# Clean previous build
if (Test-Path "dist") {
    Write-Host "Cleaning previous build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "dist"
}

# Production build
Write-Host "Running production build..." -ForegroundColor Yellow
ng build --configuration production

# Check if build was successful
if (-not (Test-Path "dist/cmdesk/browser")) {
    Write-Host "Build failed! Check the errors above." -ForegroundColor Red
    exit 1
}

# Check for essential files
$requiredFiles = @(
    "index.html",
    "main-*.js",
    "polyfills-*.js",
    "styles-*.css",
    "robots.txt"
)

Write-Host "Checking for required files..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    $found = Get-ChildItem -Path "dist/cmdesk/browser" -Filter $file
    if (-not $found) {
        Write-Host "Missing required file: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Validating index.html..." -ForegroundColor Yellow
$indexContent = Get-Content "dist/cmdesk/browser/index.html" -Raw
if (-not $indexContent.Contains("<base href=`"/`">")) {
    Write-Host "Warning: base href not found in index.html" -ForegroundColor Yellow
}

Write-Host "Build validation completed successfully!" -ForegroundColor Green
