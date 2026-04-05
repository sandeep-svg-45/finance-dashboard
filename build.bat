@echo off
echo Building Finance Dashboard for Production...
cd app
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Optimizing assets...
call npm run build
echo.
echo SUCCESS: Production build is ready in 'app/dist'!
pause
