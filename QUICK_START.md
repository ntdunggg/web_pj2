# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Navigate to Project Directory
```bash
cd "/Users/khanhnq35/Downloads/Project II/ticket-booking-frontend"
```

### 2. Run the Test Script
```bash
./test_frontend.sh
```

That's it! The application will start with mock data at `http://localhost:5173`

## 📋 What You Get

### ✅ Pre-loaded Sample Data
- 3 Performance Shows (including Wednesday shows with auto-discount)
- All 500 seats available for booking
- 2 Promotion codes: WELCOME10 (10% off), SAVE20 ($20 off)

### 👥 Test Users (Login Credentials)

**Customer Account**
- Email: `customer@test.com`
- Password: `password`
- Access: Browse shows, book tickets, view my tickets

**Staff Account**
- Email: `staff@test.com`
- Password: `password`
- Access: View and manage all bookings

**Manager Account**
- Email: `manager@test.com`
- Password: `password`
- Access: Full admin (manage events, promotions, view reports)

## 🎯 Quick Feature Tour

### For Customers:
1. **Login** with customer@test.com
2. **Browse Shows** on home page
3. **Click "Book Tickets"** on any show
4. **Select Seats** from the interactive seating chart
5. **Apply Promo Code** (try: WELCOME10)
6. **Complete Payment** (use test card or cash)
7. **View Your Tickets** with QR codes in "My Tickets"

### For Staff:
1. **Login** with staff@test.com
2. Navigate to **"Bookings"** from top menu
3. **View all bookings** with status
4. **Approve or Reject** pending bookings

### For Managers:
1. **Login** with manager@test.com
2. Navigate to **"Dashboard"** from top menu
3. **Event Management**: Add new shows with images and pricing
4. **Promotions**: Create discount codes
5. **Reports**: View revenue charts and statistics

## 🎨 Key Features to Test

### Wednesday Discount
- Book tickets for the "Phantom of the Opera" (Jan 22) - it's a Wednesday!
- You'll automatically get 30% off - watch the price update

### Multi-Seat Booking
- Select multiple seats in different zones
- See price calculation in real-time
- Different prices for Zone A, Zone B, and Level 2

### QR Code Tickets
- Complete a booking
- Go to "My Tickets"
- Each ticket has a unique QR code for venue entry

### Payment Validation
- Try booking with credit card
- Card number must pass Luhn algorithm validation
- Expiry date must be valid (MM/YY format)
- CVV must be 3-4 digits

### Admin Features
- Create a new show with custom pricing
- Upload show image (or paste URL)
- Create promotion codes (percentage or fixed amount)
- View interactive charts in Reports section

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically try the next available port (5174, 5175, etc.)

### Dependencies Not Installed
If you see errors about missing modules:
```bash
npm install
```

### Clear Mock Data
To reset all mock data:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete all entries
4. Refresh the page

## 📱 Responsive Testing

Try these viewport sizes:
- **Desktop**: 1920x1080 (full experience)
- **Tablet**: 768x1024 (optimized layout)
- **Mobile**: 375x667 (mobile-friendly)

Use browser DevTools (F12) > Toggle Device Toolbar to test different sizes.

## 🎯 Test Scenarios

### Scenario 1: Complete Customer Journey
1. Register new account (or login as customer)
2. Browse available shows
3. Select a Wednesday show (get 30% discount)
4. Choose 3 seats from different zones
5. Apply promo code "WELCOME10"
6. Complete payment with card
7. View tickets with QR codes

### Scenario 2: Staff Workflow
1. Login as staff
2. View all pending bookings
3. Approve some bookings
4. Reject others (seats will be released)
5. Check booking statistics

### Scenario 3: Manager Tasks
1. Login as manager
2. Create a new show
3. Set zone-specific pricing
4. Create a new promotion (e.g., "EARLY20" for 20% off)
5. View revenue reports
6. Check seat occupancy statistics

## 📊 What to Look For

### UX/UI Quality
✅ Modern, clean design with blue theme  
✅ Smooth transitions and interactions  
✅ Clear visual feedback on actions  
✅ Loading states for async operations  
✅ Error messages when something goes wrong  

### Functionality
✅ Real-time seat availability updates  
✅ Accurate price calculations  
✅ Discount logic working correctly  
✅ QR code generation  
✅ Charts and visualizations  

### Responsive Design
✅ Layout adapts to screen size  
✅ Touch-friendly on mobile  
✅ Readable on all devices  

## 💡 Pro Tips

1. **Multiple Tabs**: Open the app in multiple browser tabs to simulate different users
2. **Local Storage**: All data is stored locally, so it persists between sessions
3. **No Backend Needed**: Everything works offline with mock data
4. **Safe to Experiment**: You can't break anything - just refresh to reset!

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the code structure in src/ directory
- All components are well-commented
- Services are modular and easy to understand

## 🎓 For Your Thesis Defense

Key points to highlight:
1. **Modern Tech Stack**: React + Vite + Tailwind CSS
2. **Role-Based Access**: Customer, Staff, Manager roles
3. **Business Logic**: Wednesday discount, promotion codes
4. **Interactive UI**: 500-seat seating chart
5. **Data Visualization**: Charts for revenue and occupancy
6. **Complete Flow**: From browsing to QR ticket generation
7. **Test Mode**: Frontend can run independently

---

**Enjoy testing the application! 🎉**
