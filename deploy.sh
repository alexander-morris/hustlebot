#!/bin/bash

# Source the setup script
source scripts/deploy/setup.sh || {
    echo "Failed to source setup script"
    exit 1
}

# Run setup
setup_deployment || {
    echo "Deployment setup failed"
    exit 1
}

# Deploy to Vercel
print_blue "Deploying to Vercel..."
vercel deploy --prod || {
    print_red "Deployment failed"
    exit 1
}

print_green "🚀 Deployment complete!" 