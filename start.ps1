# Computer Repair Work Order System - PowerShell Startup Script

Write-Host "Starting Computer Repair Work Order System..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not detected, please install Node.js (>=16.0.0)" -ForegroundColor Red
    Write-Host "Download: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm not detected, please install npm (>=8.0.0)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check environment file
if (!(Test-Path ".env")) {
    Write-Host "ERROR: .env file not found" -ForegroundColor Red
    Write-Host "Please ensure .env file exists in the project root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Yellow
try {
    npm run install-all
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Dependency installation failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check MongoDB
Write-Host "Please ensure MongoDB service is running..." -ForegroundColor Yellow
Write-Host "If MongoDB is not installed, please install and start it" -ForegroundColor Yellow
Write-Host "Download: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or use Docker deployment (recommended):" -ForegroundColor Cyan
Write-Host "  npm run docker:up" -ForegroundColor White
Write-Host ""

# Start services
Write-Host "Starting services..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Start development server
npm run dev