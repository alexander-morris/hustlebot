#!/bin/zsh

print_blue() { print -P "%F{blue}$1%f" }
print_red() { print -P "%F{red}$1%f" }

print_blue "Checking system status..."

# Check Node version
print_blue "Node version:"
node --version

# Check yarn version
print_blue "Yarn version:"
yarn --version

# Check running processes
print_blue "Checking ports..."
lsof -i :3000
lsof -i :19006

# Check Expo status
print_blue "Checking Expo..."
ls -la ~/.expo

# Check logs
print_blue "Recent logs:"
tail -n 20 ~/.expo/debug.log 2>/dev/null

# Check dependencies
print_blue "Checking dependencies..."
(cd frontend && yarn check) || print_red "Frontend dependencies issue"
(cd backend && yarn check) || print_red "Backend dependencies issue" 