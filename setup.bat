@echo off
REM RAF Chatbot - Complete Setup Script for Windows

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo RAF Chatbot - Complete Setup (Windows)
echo ==========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is required but not installed
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is required but not installed
    exit /b 1
)

echo [OK] Python and Node.js installed

REM Backend setup
echo.
echo ==========================================
echo Setting up Backend...
echo ==========================================
echo.

cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo WARNING: Edit backend\.env and add your OPENAI_API_KEY
)

cd ..

REM Frontend setup
echo.
echo ==========================================
echo Setting up Frontend...
echo ==========================================
echo.

cd frontend

echo Installing Node.js dependencies...
call npm install

if not exist .env.local (
    echo Creating .env.local file from template...
    copy .env.example .env.local
)

cd ..

echo.
echo ==========================================
echo [SUCCESS] Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Backend (Command Prompt):
echo    cd backend
echo    venv\Scripts\activate
echo    REM Edit .env and add OPENAI_API_KEY
echo    uvicorn app.main:app --reload
echo.
echo 2. Frontend (New Command Prompt):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo For more help, see QUICKSTART.md
echo.

pause
