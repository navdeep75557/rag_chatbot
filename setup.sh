#!/bin/bash

# RAF Chatbot - Complete Setup Script

set -e  # Exit on error

echo "=========================================="
echo "RAF Chatbot - Complete Setup"
echo "=========================================="

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v python &> /dev/null; then
    echo "✗ Python 3.10+ is required but not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "✗ Node.js 18+ is required but not installed"
    exit 1
fi

python_version=$(python --version | cut -d' ' -f2)
node_version=$(node --version | cut -d'v' -f2)

echo "  Python: $python_version"
echo "  Node.js: $node_version"

# Backend setup
echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="

cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Setup environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit backend/.env and add your OPENAI_API_KEY"
fi

cd ..

# Frontend setup
echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="

cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Setup environment file
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from template..."
    cp .env.example .env.local
fi

cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # or venv\Scripts\activate on Windows"
echo "   # Edit .env and add OPENAI_API_KEY"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. Frontend (new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more help, see QUICKSTART.md"
