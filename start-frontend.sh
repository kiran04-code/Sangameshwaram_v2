#!/bin/bash

# Start Frontend Server Script
# This script starts the React development server

echo "🚀 Starting Frontend Server..."
cd /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
npm start

echo "❌ Frontend server stopped"
