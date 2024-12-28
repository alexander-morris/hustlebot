#!/bin/zsh

setopt NO_NOMATCH  # Prevent zsh from treating # as a pattern

# Define colors using print -P instead of ANSI codes
function print_blue() { print -P "%F{blue}$1%f" }
function print_green() { print -P "%F{green}$1%f" }
function print_red() { print -P "%F{red}$1%f" }

# Function to handle script termination
function cleanup() {
    print_red "\nShutting down servers..."
    # Kill processes more gracefully
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM EXIT

# Run cleanup script first
print_blue "Running cleanup..."
./scripts/cleanup.sh

# Wait a moment for processes to fully terminate
sleep 2

# Install dependencies
print_blue "Installing dependencies..."
(cd frontend && yarn install)
(cd backend && yarn install)

# Check if MongoDB is running
print_blue "Checking MongoDB status..."
if ! brew services list | grep mongodb-community > /dev/null 2>&1; then
    print_red "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Start MongoDB if not running
if ! brew services list | grep mongodb-community | grep started > /dev/null 2>&1; then
    print_blue "Starting MongoDB..."
    brew services start mongodb-community@7.0
fi

# Initialize database with test data
print_blue "Initializing database..."
(cd backend && node scripts/init-db.js)

# Start log analysis in development
if [ "$NODE_ENV" = "development" ]; then
    node scripts/analyze-logs.js &
    LOG_ANALYZER_PID=$!
fi

# Start Backend in development mode
print_blue "Starting Backend Server in development mode..."
(cd backend && NODE_ENV=development yarn dev) & 
BACKEND_PID=$!

# Wait for backend to initialize
sleep 5

# Verify backend is running
if ! lsof -i :3000 > /dev/null; then
    print_red "Backend failed to start on port 3000"
    exit 1
fi

# Start Frontend in development mode
print_blue "Starting Frontend Server in development mode..."
# Set environment variables for frontend
export BROWSER='google chrome'
export BROWSER_ARGS="--new-window http://localhost:19006/?ref=TEST1234"
(cd frontend && yarn dev) &
FRONTEND_PID=$!

# Print startup message
print_green "🚀 Development servers running:"
print_blue "Environment: DEVELOPMENT"
print_green "Backend: http://localhost:3000"
print_green "Frontend: http://localhost:19006/?ref=TEST1234"

# Wait for all processes
wait $BACKEND_PID $FRONTEND_PID