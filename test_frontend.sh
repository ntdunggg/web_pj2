#!/bin/bash

# Frontend Test Mode Script
# This script launches the frontend in test mode with mock data

echo "======================================"
echo "Performance Ticket Booking System"
echo "Frontend Test Mode"
echo "======================================"
echo ""

# Set test mode environment variable
export VITE_TEST_MODE=true

# Store test mode in localStorage (will be read by the app)
echo "Enabling test mode with mock data..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting development server in TEST MODE..."
echo "The application will use mock data (no backend required)"
echo ""
echo "Test Credentials:"
echo "  Customer: customer@test.com / password"
echo "  Staff:    staff@test.com / password"
echo "  Manager:  manager@test.com / password"
echo ""
echo "Features available in test mode:"
echo "  ✓ Browse shows"
echo "  ✓ Select seats and book tickets"
echo "  ✓ Apply promotions"
echo "  ✓ View my tickets with QR codes"
echo "  ✓ Staff: Manage bookings"
echo "  ✓ Admin: Manage events, promotions, view reports"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================"
echo ""

# Start the development server
npm run dev
