@echo off
echo 🚀 MediQuick GitHub Setup Starting...
echo.

cd /d "c:\Users\THARUN\Downloads\mediquick-complete-fullstack\mediquick"

echo 📁 Current directory: %CD%
echo.

echo 🔧 Setting up git configuration...
git config user.name "Tharun9905"
git config user.email "tharun@example.com"

echo ✅ Git configuration complete
echo.

echo 📋 Checking git status...
git status
echo.

echo 📄 Adding all files...
git add .
echo.

echo 💾 Committing changes...
git commit -m "docs: Update README with comprehensive project documentation"
echo.

echo 🌟 Changing branch to main...
git branch -M main
echo.

echo 📊 Final git status:
git status
echo.

echo 🎉 Project is ready for GitHub!
echo.
echo 🔗 Next steps:
echo 1. Go to https://github.com/new
echo 2. Repository name: mediquick
echo 3. Description: Medicine delivery platform built with Next.js and Node.js
echo 4. Make it Public
echo 5. DON'T initialize with README (we already have one)
echo 6. Click 'Create repository'
echo.
echo 🚀 Then run these commands:
echo git remote add origin https://github.com/Tharun9905/mediquick.git
echo git push -u origin main
echo.

pause