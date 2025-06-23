@echo off
echo Killing any process using port 5000...

REM Kill specific port 5000 processes
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process ID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Also kill any node.exe processes that might be hanging
echo Killing any hanging node processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nodemon.exe >nul 2>&1

echo Waiting 2 seconds for cleanup...
timeout /t 2 /nobreak >nul

echo Starting development server...
npm run dev
