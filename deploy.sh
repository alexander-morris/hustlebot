#!/bin/bash

# Get current timestamp for branch name
BRANCH_NAME="deploy-$(date +%Y%m%d-%H%M%S)"

# Stash any existing changes and create new branch
echo "Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Deploy: $BRANCH_NAME"

# Push the new branch
echo "Pushing branch..."
git push origin $BRANCH_NAME

# Switch to main and merge
echo "Merging to main..."
git checkout main
git pull origin main
git merge $BRANCH_NAME

# Push main
echo "Pushing main..."
git push origin main

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel deploy --prod

echo "Deployment complete!" 