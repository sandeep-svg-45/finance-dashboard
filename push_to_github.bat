@echo off
setlocal

echo.
echo ==========================================
echo  📤 Push to GitHub: Finance Dashboard
echo ==========================================
echo.

:: Manually set Git Identity (provided by USER)
echo Setting Git identity...
git config --global user.email "sandeepreddylotla28@gmail.com"
git config --global user.name "sandeep-svg-45"
echo Identity set successfully!
echo.

:: Initialize Git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
)

:: Ensure we are on the main branch
git branch -M main

:: Add all files and commit
echo Staging files and creating first commit...
git add .
git commit -m "Initialize Finance Dashboard: Rich Liquid Glass UI"

:: Set GitHub URL
set github_url=https://github.com/sandeep-svg-45/finance-dashboard.git

:: Add remote and push
echo.
echo Connecting to GitHub and pushing to:
echo %github_url%
echo.

:: Check if remote exists
git remote -v | findstr "origin" >nul
if %errorlevel% equ 0 (
    git remote remove origin
)

git remote add origin %github_url%
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] PUSH FAILED. 
    echo If you see 'permission denied', ensure you are logged in to GitHub.
    echo Run this to login: gh auth login (if you have GitHub CLI)
) else (
    echo.
    echo ==========================================
    echo  ✅ SUCCESS: Your dashboard is on GitHub!
    echo ==========================================
)

pause
