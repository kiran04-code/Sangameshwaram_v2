#!/bin/bash

# Combined Start Script for Backend and Frontend
# Now with Port-Clearing capabilities

echo "🎯 Initializing Sangameshwar Services..."

# --- PORT CLEANUP SECTION ---
# Define your ports
BACKEND_PORT=8000
FRONTEND_PORT=3000

echo "🔍 Checking for ghost processes on Port $BACKEND_PORT and $FRONTEND_PORT..."

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        echo "⚠️  Port $port is busy (PID: $pid). Terminating..."
        kill -9 $pid
        sleep 1 # Give the OS a second to release the socket
    else
        echo "✅ Port $port is clear."
    fi
}

# Run the cleanup
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

echo ""
echo "🚀 Ports ready. Starting servers..."
echo "   Backend: http://localhost:$BACKEND_PORT"
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo ""

# --- STARTUP SECTION ---

# Make scripts executable (Using your specific paths)
chmod +x /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/start-backend.sh
chmod +x /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/start-frontend.sh

# Start backend in a new terminal
echo "📋 Launching Backend Terminal..."
open -a Terminal /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/start-backend.sh

sleep 2

# Start frontend in a new terminal
echo "📋 Launching Frontend Terminal..."
open -a Terminal /Users/shreeharshmshivpuje/SANGAMESHWAR/new/Sangameshwarm/start-frontend.sh

echo ""
echo "✨ Success! Systems are booting up."