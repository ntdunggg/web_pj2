# Performance Ticket Booking System - Frontend# React + Vite



A modern, high-quality frontend application for a performance ticket booking system built with React.js, Vite, and Tailwind CSS.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🎯 FeaturesCurrently, two official plugins are available:



### Customer Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Browse Shows**: View all available performances with details and pricing- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Interactive Seating Map**: 500-seat venue with 3 zones (Zone A, Zone B, Level 2)

- **Multi-Seat Selection**: Select multiple seats in a single booking## React Compiler

- **Wednesday Discount**: Automatic 30% discount on Wednesday shows

- **Promotion Codes**: Apply discount vouchers at checkoutThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Payment Options**: Credit card or cash payment

- **My Tickets**: View booked tickets with QR codes for venue entry## Expanding the ESLint configuration



### Staff FeaturesIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- **Booking Management**: View all bookings with filtering
- **Status Updates**: Approve or reject bookings
- **Delivery Tracking**: Monitor booking status (Pending, Success, Rejected)

### Manager/Accountant Features
- **Event Management**: Create, edit, and delete shows
  - Upload show images with preview
  - Set date/time schedule
  - Zone-based pricing (different prices for each zone)
- **Promotion Management**: Create and manage discount codes
  - Percentage or fixed amount discounts
  - Activate/deactivate promotions
- **Reports & Analytics**: 
  - Revenue by show (bar chart)
  - Payment method breakdown (pie chart)
  - Seat occupancy statistics
  - Detailed metrics and KPIs

## 🛠 Tech Stack

- **Framework**: React.js 18+ with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **Icons**: Lucide React
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
```

### Running the Application

#### Test Mode (No Backend Required) - RECOMMENDED
Use the provided test script to run with mock data:
```bash
./test_frontend.sh
```

The application will start at `http://localhost:5173` with mock data enabled.

#### Manual Start
```bash
npm run dev
```

### Test Credentials (Test Mode)

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | password |
| Staff | staff@test.com | password |
| Manager | manager@test.com | password |

## 🎨 Design Features

### Seating Chart (500 Seats)
- **Level 1**: 
  - Zone A: 15 rows × 10 columns = 150 seats
  - Zone B: 15 rows × 10 columns = 150 seats
- **Level 2**: 20 rows × 10 columns = 200 seats
- Interactive seat selection with real-time status updates

### Wednesday Discount Logic
- Automatic 30% discount on Wednesday shows
- Formula: `Price_final = Price_base × 0.7`
- Visual badge on Wednesday shows

### Color Theme
- **Primary**: `#2563eb` (Modern Blue)
- **Seat Colors**: White (Available), Blue (Selected), Red (Sold), Yellow (Pending)

## 📁 Project Structure

```
src/
├── components/       # UI components
│   ├── ui/          # Base components
│   └── admin/       # Admin components
├── pages/           # Page components
├── services/        # API and mock services
├── hooks/           # Custom React hooks
├── contexts/        # Context providers
└── utils/           # Utilities and helpers
```

## 🧪 Test Mode Features

The test script (`test_frontend.sh`) enables:
- ✅ Complete mock data (no backend needed)
- ✅ All CRUD operations work in-memory
- ✅ 3 sample shows with pricing
- ✅ Full booking flow with QR codes
- ✅ Staff and admin dashboards
- ✅ Data persisted in localStorage

## 📱 Responsive Design

Fully responsive across all devices:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

## 🎓 Project Information

**Academic Project**: IT Student Thesis  
**Architecture**: 3-tier (Frontend, Backend, Database)  
**Year**: 2026

---

Built with ❤️ using React, Vite, and Tailwind CSS
# web_pj2
