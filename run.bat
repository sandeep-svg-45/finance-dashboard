@echo off
echo Starting Finance Dashboard...
cd app
if not exist node_modules (
    echo Installing dependencies... this may take a moment.
    call npm install
)
echo Launching server...
npm run dev
