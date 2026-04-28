#!/bin/bash

# Start Backend Server Script
# This script kills any existing processes on port 8000 and starts the backend server

echo "🛑 Checking for existing processes on port 8000..."
lsof -i tcp:8000 | awk 'NR!=1 {print $2}' | xargs kill -9 2>/dev/null
sleep 1

echo "🚀 Starting Backend Server..."
cd /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/backend

# Run the server and capture its output
python server.py

echo "❌ Backend server stopped"
