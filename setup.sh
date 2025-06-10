#!/bin/bash

echo "🎵 Setting up HarrisApp Development Environment..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm run server:install

# Setup environment file
echo "🔧 Setting up environment configuration..."
cd server
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created server/.env file"
    echo "⚠️  Please edit server/.env and add your Harris Jazz Lines API key:"
    echo "   WES_API_KEY=your-actual-api-key-here"
else
    echo "ℹ️  server/.env already exists"
fi

cd ..

echo ""
echo "🎸 HarrisApp setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your API key"
echo "2. Run 'npm run dev:full' to start both frontend and backend"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "For more information, see CONTRIBUTING.md"