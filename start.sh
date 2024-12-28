#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle script termination
cleanup() {
    echo -e "\n${RED}Shutting down servers...${NC}"
    # Kill all child processes
    pkill -P $$
    exit 0
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend && npm start & 
BACKEND_PID=$!

# Wait a moment to let backend initialize
sleep 2

# Start Frontend using local node_modules
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd ./frontend && ./node_modules/.bin/expo start --web &
FRONTEND_PID=$!

# Print startup message
echo -e "${GREEN}🚀 Development servers running:${NC}"
echo -e "${GREEN}Backend: http://localhost:3000${NC}"
echo -e "${GREEN}Frontend: http://localhost:19000${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID