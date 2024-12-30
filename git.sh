#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Print functions
print_blue() { echo -e "${BLUE}$1${NC}"; }
print_green() { echo -e "${GREEN}$1${NC}"; }
print_red() { echo -e "${RED}$1${NC}"; }

# Check git status
check_git_changes() {
    # Count changed files
    local changed_files=$(git status --porcelain | wc -l)
    
    if [ "$changed_files" -eq 0 ]; then
        print_blue "No changes to commit"
        exit 0
    elif [ "$changed_files" -lt 5 ]; then
        print_blue "Small change set detected ($changed_files files)"
        return 1
    else
        print_blue "Large change set detected ($changed_files files)"
        return 0
    fi
}

# Create feature branch
create_feature_branch() {
    local branch_name="feature/$(date +%Y%m%d-%H%M%S)"
    print_blue "Creating new branch: $branch_name"
    
    git checkout -b "$branch_name" || {
        print_red "Failed to create branch"
        exit 1
    }
    
    git add . || {
        print_red "Failed to stage changes"
        exit 1
    }
    
    git commit -m "feat: $branch_name" || {
        print_red "Failed to commit changes"
        exit 1
    }
    
    git push origin "$branch_name" || {
        print_red "Failed to push branch"
        exit 1
    }
    
    print_green "✨ Feature branch created and pushed"
}

# Commit to current branch
commit_changes() {
    print_blue "Committing to current branch"
    
    git add . || {
        print_red "Failed to stage changes"
        exit 1
    }
    
    git commit -m "chore: small updates" || {
        print_red "Failed to commit changes"
        exit 1
    }
    
    git push || {
        print_red "Failed to push changes"
        exit 1
    }
    
    print_green "✨ Changes committed and pushed"
}

# Main logic
if check_git_changes; then
    create_feature_branch
else
    commit_changes
fi 