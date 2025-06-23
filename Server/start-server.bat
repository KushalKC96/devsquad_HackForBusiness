@echo off
echo 🚀 Kostra Backend Server Helper
echo.
echo Current processes on port 5000:
netstat -ano | findstr :5000
echo.

if exist kill-port-5000.bat (
    echo Option 1: npm run dev:kill
    echo Option 2: kill-port-5000.bat
) else (
    echo Available commands:
)
echo Option 3: npm run dev
echo.

echo Trying to start server...
npm run dev
