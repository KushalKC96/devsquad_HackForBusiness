@echo off
echo Starting Kostra Development Environment...
echo.

echo Killing any existing processes on port 5000...
call kill-port-5000.bat

echo.
echo Starting backend server...
start "Kostra Backend" cmd /k "npm run dev"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting frontend server...
cd /d "c:\Users\kusha\DEVSQUAD\Client"
start "Kostra Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul
