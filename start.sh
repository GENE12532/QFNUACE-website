#!/bin/bash

# Computer Repair Work Order System - Quick Start Script
# For Linux/macOS systems

echo "Starting Computer Repair Work Order System..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not detected, please install Node.js (>=16.0.0)"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not detected, please install npm (>=8.0.0)"
    exit 1
fi

# Show version info
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check environment file
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found"
    echo "Please ensure .env file exists in the project root directory"
    exit 1
fi

# Install dependencies
echo "Installing project dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "Dependency installation failed"
    exit 1
fi

echo "Dependencies installed successfully"

# Check MongoDB
echo "Please ensure MongoDB service is running..."
echo "If MongoDB is not installed, please install and start it"
echo "Or use Docker deployment (recommended): npm run docker:up"

# Start services
echo "Starting services..."
echo "Backend API: http://localhost:3000"
echo "Frontend App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================="

npm run dev