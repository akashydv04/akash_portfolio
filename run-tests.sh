#!/bin/bash

# Test Runner Script
# This script ensures tests run against the latest build

echo "🧪 Preparing to run tests..."

# Step 1: Kill any existing preview servers
echo "📦 Stopping old preview servers..."
pkill -f "vite preview" 2>/dev/null || true
sleep 2

# Step 2: Build the latest version
echo "🔨 Building latest version..."
npm run build

# Step 3: Start preview server and run tests
echo "🚀 Starting preview server and running tests..."
npm test

# Step 4: Show report
echo "📊 Opening test report..."
npx playwright show-report
