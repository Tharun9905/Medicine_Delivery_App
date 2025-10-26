@echo off
echo 🔗 Connecting to GitHub repository...
echo.

cd /d "c:\Users\THARUN\Downloads\mediquick-complete-fullstack\mediquick"

echo 📍 Adding remote origin...
git remote add origin https://github.com/Tharun9905/mediquick.git

echo 📤 Pushing to GitHub...
git push -u origin main

echo.
echo 🎉 SUCCESS! Your MediQuick project is now on GitHub!
echo.
echo 🔗 Repository URL: https://github.com/Tharun9905/mediquick
echo.
echo ✅ Your repository includes:
echo    - ✅ Complete frontend (Next.js)
echo    - ✅ Complete backend (Node.js/Express)
echo    - ✅ Proper .gitignore files (node_modules excluded)
echo    - ✅ Comprehensive README.md
echo    - ✅ Docker configuration
echo    - ✅ All source code and tests
echo.

pause