# MediQuick Platform Deployment Setup Script
# This script prepares your project for Vercel deployment

Write-Host "🚀 MediQuick Platform - Deployment Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📦 Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependency installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location "backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependency installation failed!" -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Build frontend
Write-Host "🔧 Building frontend for production..." -ForegroundColor Yellow
Set-Location "frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ".."
Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
Write-Host ""

# Display next steps
Write-Host "🎉 Setup complete! Ready for deployment." -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Login to Vercel: vercel login" -ForegroundColor White
Write-Host "2. Deploy backend: cd backend && vercel" -ForegroundColor White
Write-Host "3. Deploy frontend: cd frontend && vercel" -ForegroundColor White
Write-Host "4. Set up environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "5. Update API URLs in your frontend config" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Quick deploy command: npm run deploy" -ForegroundColor Yellow