#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle script termination
cleanup() {
    echo -e "\n${RED}Shutting down servers...${NC}"
    pkill -P $$
    exit 0
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB status...${NC}"
if ! mongod --version > /dev/null 2>&1; then
    echo -e "${RED}MongoDB is not installed. Please install MongoDB first.${NC}"
    exit 1
fi

# Clear terminal and show startup message
clear
echo -e "${GREEN}Starting development environment...${NC}"

# Initialize database with test data
echo -e "${BLUE}Initializing database...${NC}"
cd backend && node scripts/init-db.js
cd ..

# Start Backend with hot reload
echo -e "${BLUE}Starting Backend Server with hot reload...${NC}"
cd backend && npm run watch & 
BACKEND_PID=$!

# Wait for backend to initialize
sleep 2

# Start Frontend with hot reload
echo -e "${BLUE}Starting Frontend Server with hot reload...${NC}"
cd ../frontend && EXPO_NO_DAEMON=1 npm run watch &
FRONTEND_PID=$!

# Print startup message
echo -e "\n${GREEN}🚀 Development servers running:${NC}"
echo -e "${GREEN}Backend: http://localhost:3000${NC}"
echo -e "${GREEN}Frontend: http://localhost:19006${NC}"
echo -e "${BLUE}👀 Watching for changes in both frontend and backend...${NC}"

# Make the script executable
chmod +x dev.sh

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 