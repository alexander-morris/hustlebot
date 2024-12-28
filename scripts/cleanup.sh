#!/bin/zsh

# Colors for terminal output
RED='\033[0;31m'
NC='\033[0m'

# List of ports to check
PORTS=(3000 19000 19001 19002 19006)

cleanup_ports() {
    echo -e "${RED}Cleaning up processes on ports...${NC}"
    
    for PORT in "${PORTS[@]}"; do
        PID=$(lsof -ti :$PORT)
        if [ ! -z "$PID" ]; then
            echo "Killing process on port $PORT (PID: $PID)"
            kill -9 $PID 2>/dev/null
        fi
    done

    # Kill any lingering node/expo processes
    pkill -f "node" 2>/dev/null
    pkill -f "expo" 2>/dev/null
    pkill -f "webpack" 2>/dev/null
    pkill -f "metro" 2>/dev/null
    
    # Clean Expo cache but preserve logs
    if [ -d "$HOME/.expo" ]; then
        # Backup logs
        if [ -f "$HOME/.expo/debug.log" ]; then
            mv "$HOME/.expo/debug.log" "$HOME/.expo/debug.log.bak"
        fi
        
        rm -rf "$HOME/.expo/web-build" 2>/dev/null
        rm -rf "$HOME/.expo/cache" 2>/dev/null
        rm -rf "$HOME/.expo/metro-cache" 2>/dev/null
        rm -rf "$HOME/.expo/web-cache" 2>/dev/null
        
        # Restore logs
        if [ -f "$HOME/.expo/debug.log.bak" ]; then
            mv "$HOME/.expo/debug.log.bak" "$HOME/.expo/debug.log"
        fi
    fi
    
    # Wait to ensure all processes are killed
    sleep 2
}

# Run cleanup
cleanup_ports