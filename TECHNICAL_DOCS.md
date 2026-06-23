# Technical Documentation Summary

## 📦 Project Overview

**Project Name**: Performance Ticket Booking System - Frontend  
**Type**: React.js Single Page Application (SPA)  
**Build Tool**: Vite  
**Styling**: Tailwind CSS  

## 🏗 Architecture

### Three-Tier Architecture
```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │  ← This Project
│  - User Interface                   │
│  - State Management                 │
│  - Business Logic                   │
└─────────────────────────────────────┘
              ↕ HTTP/REST
┌─────────────────────────────────────┐
│      BACKEND (Node.js/Express)      │  ← Your Backend
│  - API Endpoints                    │
│  - Authentication                   │
│  - Business Rules                   │
└─────────────────────────────────────┘
              ↕ SQL
┌─────────────────────────────────────┐
│    DATABASE (PostgreSQL/MySQL)      │  ← Your Database
│  - Data Persistence                 │
│  - Relationships                    │
└─────────────────────────────────────┘
```

## 🎯 Core Business Logic

### 1. Wednesday Discount Logic
**Formula**: `Price_final = Price_base × 0.7` (30% discount)

**Implementation**:
- File: `src/hooks/useWednesdayDiscount.js`
- Uses `date-fns` library to check if date is Wednesday
- Automatically applied in booking flow
- Discount shown in booking summary

```javascript
const isWednesday = isDateWednesday(showDate);
const finalPrice = isWednesday ? basePrice * 0.7 : basePrice;
```

### 2. Seating System
**Capacity**: 500 seats total

**Configuration**:
```
Level 1 (300 seats):
  - Zone A: 15 rows × 10 cols = 150 seats
  - Zone B: 15 rows × 10 cols = 150 seats

Level 2 (200 seats):
  - Single zone: 20 rows × 10 cols = 200 seats
```

**Seat Numbering**:
- Format: `[ZONE]-[ROW][COLUMN]`
- Examples: `A-A1`, `B-C5`, `L2-K8`
- Row: Letters (A-T)
- Column: Numbers (1-10)

**Seat States**:
- AVAILABLE: Can be selected
- SELECTED: Currently selected by user
- SOLD: Already booked
- PENDING: Temporarily held

### 3. Booking Flow
```
1. Browse Shows
   ↓
2. Select Show
   ↓
3. Choose Seats (Interactive Map)
   ↓
4. Apply Discounts
   - Wednesday (auto)
   - Promotion Code (optional)
   ↓
5. Choose Payment Method
   - Credit Card (validated)
   - Cash (pay at venue)
   ↓
6. Create Booking
   ↓
7. Generate Tickets with QR Codes
```

### 4. Promotion System
**Types**:
- **Percentage**: 10% off, 20% off, etc.
- **Fixed Amount**: $10 off, $20 off, etc.

**Application**:
- Applied after Wednesday discount
- Single promo code per booking
- Formula: `Total = (Base_Price × 0.7_if_Wednesday) - Promo_Discount`

### 5. Payment Processing
**Credit Card Validation**:
- Luhn Algorithm for card number
- MM/YY format for expiry
- Must be future date
- CVV: 3-4 digits

**File**: `src/utils/validation.js`

## 🔐 Authentication & Authorization

### User Roles
1. **CUSTOMER**
   - Browse shows
   - Book tickets
   - View my tickets
   - Routes: `/`, `/show/:id`, `/my-tickets`

2. **STAFF**
   - View all bookings
   - Update booking status
   - Routes: `/staff/bookings`

3. **MANAGER / ACCOUNTANT**
   - All staff permissions
   - Manage events
   - Manage promotions
   - View reports
   - Routes: `/admin/dashboard`

### Implementation
- Context: `src/contexts/AuthContext.jsx`
- Protected Routes: `src/App.jsx`
- Token storage: localStorage
- Role checking: `hasRole(roles)` method

## 📡 Data Flow

### Standard Mode (With Backend)
```
Component → Service Provider → API Service → Axios → Backend API
                                                            ↓
Component ← Service Provider ← API Service ← Axios ← Backend API
```

### Test Mode (Mock Data)
```
Component → Service Provider → Mock Service → LocalStorage
                                                     ↓
Component ← Service Provider ← Mock Service ← LocalStorage
```

**Switching Modes**:
- Environment: `VITE_TEST_MODE=true/false`
- File: `src/services/index.js` (serviceProvider)

## 🗂 File Structure Explanation

### `/components`
- **`/ui`**: Reusable base components (Button, Card, Input, etc.)
- **`/admin`**: Admin-specific complex components
- Root: Feature components (SeatingChart, PaymentForm, etc.)

### `/pages`
- Each file represents a route/page
- Contains page-level logic and layout
- Uses Layout wrapper for consistent UI

### `/services`
- **`api.js`**: Axios configuration, interceptors
- **`*Service.js`**: Individual service modules
- **`mockService.js`**: Complete mock implementation
- **`index.js`**: Service provider (switches between mock/real)

### `/hooks`
- Custom React hooks for reusable logic
- `useWednesdayDiscount`: Discount calculation
- `useBooking`: Complete booking state management

### `/contexts`
- React Context providers
- `AuthContext`: Authentication, user state, role management

### `/utils`
- **`constants.js`**: App-wide constants
- **`validation.js`**: Form validation functions
- **`dateUtils.js`**: Date manipulation
- **`ticketUtils.js`**: Ticket ID generation
- **`cn.js`**: Tailwind class merging utility

## 🎨 Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        600: '#2563eb',  // Main brand color
        ...
      }
    }
  }
}
```

### Component Patterns
```jsx
// Using cn utility for conditional classes
<button className={cn(
  'base-styles',
  isActive && 'active-styles',
  disabled && 'disabled-styles'
)} />
```

## 📊 State Management

### Authentication State
- **Location**: React Context (`AuthContext`)
- **Storage**: localStorage (persisted)
- **Data**: user object, token, role

### Booking State
- **Location**: Custom hook (`useBooking`)
- **Scope**: Component-level (ShowDetailsPage)
- **Data**: selected seats, payment method, pricing

### Server State
- **Pattern**: Component state + useEffect
- **Data**: shows, bookings, seats, promotions
- **Caching**: None (refetch on mount)

## 🔄 API Integration

### Expected Backend Endpoints

**Authentication**:
- `POST /api/auth/login`
- `POST /api/auth/register`

**Shows**:
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Show details
- `POST /api/shows` - Create show (admin)
- `PUT /api/shows/:id` - Update show (admin)
- `DELETE /api/shows/:id` - Delete show (admin)
- `GET /api/shows/:id/seats` - Seat availability
- `POST /api/shows/upload` - Upload image

**Bookings**:
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-tickets` - User's bookings
- `GET /api/bookings` - All bookings (staff/admin)
- `PATCH /api/bookings/:id/status` - Update status (staff)

**Promotions**:
- `GET /api/promotions` - List promotions
- `GET /api/promotions/code/:code` - Get by code
- `POST /api/promotions` - Create (admin)
- `PUT /api/promotions/:id` - Update (admin)
- `DELETE /api/promotions/:id` - Delete (admin)

**Reports**:
- `GET /api/reports/revenue` - Revenue data
- `GET /api/reports/seat-occupancy` - Occupancy data
- `GET /api/reports/payment-methods` - Payment stats

### Request/Response Formats

**Example: Create Booking**
```javascript
// Request
POST /api/bookings
{
  "userId": "1",
  "showId": "1",
  "seats": [
    { "zone": "zone_a", "row": 0, "col": 0, "seatNumber": "A-A1" }
  ],
  "paymentMethod": "card",
  "totalAmount": 70.00,
  "promotionCode": "WELCOME10"
}

// Response
{
  "id": "123",
  "userId": "1",
  "showId": "1",
  "tickets": [
    { "id": "TKT-...", "seatNumber": "A-A1", ... }
  ],
  "status": "pending",
  "totalAmount": 70.00,
  "createdAt": "2026-01-15T..."
}
```

## 🧪 Testing Strategy

### Test Mode Features
1. **Mock Data**: Pre-populated shows, users, promotions
2. **LocalStorage**: Data persists between sessions
3. **No Network**: All operations work offline
4. **Realistic**: Simulates API delays

### Test Scenarios Covered
✅ Complete booking flow  
✅ Wednesday discount calculation  
✅ Multi-seat selection  
✅ Payment validation  
✅ QR code generation  
✅ Role-based access  
✅ Staff booking management  
✅ Admin CRUD operations  
✅ Chart rendering  

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints used */
sm: 640px   // Small devices
md: 768px   // Medium devices (tablets)
lg: 1024px  // Large devices (desktops)
xl: 1280px  // Extra large
2xl: 1536px // 2X Extra large
```

### Responsive Patterns
- Mobile-first approach
- Grid layouts collapse on mobile
- Seating chart scrollable on small screens
- Navigation menu adapts to screen size

## 🚀 Performance Considerations

### Optimizations Implemented
1. **React.memo**: Not used (small app, premature optimization)
2. **useMemo**: Used for expensive calculations (seat grids, pricing)
3. **useCallback**: Used for event handlers passed to children
4. **Code Splitting**: Route-based (automatic with Vite)
5. **Image Loading**: External URLs (no bundling)

### Bundle Size
- Estimated production build: ~300-400KB (gzipped)
- Main contributors: React, React Router, Recharts

## 🔒 Security Considerations

### Implemented
- Token-based auth (localStorage)
- Role-based access control
- Input validation (client-side)
- XSS protection (React default)

### Not Implemented (Backend Responsibility)
- Password hashing
- CSRF protection
- Rate limiting
- SQL injection prevention

## 📝 Development Guidelines

### Code Style
- Functional components with hooks
- Arrow functions for components
- Tailwind for styling (no CSS files)
- PropTypes: Not used (consider adding for production)

### Naming Conventions
- Components: PascalCase (`ShowCard.jsx`)
- Hooks: camelCase with 'use' prefix (`useBooking.js`)
- Services: camelCase with 'Service' suffix (`showService.js`)
- Constants: UPPER_SNAKE_CASE

### Git Workflow (Recommended)
```bash
main           # Production-ready code
├── develop    # Integration branch
│   ├── feature/booking-flow
│   ├── feature/admin-panel
│   └── bugfix/seat-selection
```

## 🎓 For Your Thesis

### Key Technical Achievements
1. ✅ Modern React patterns (Hooks, Context)
2. ✅ Clean architecture (separation of concerns)
3. ✅ Reusable component library
4. ✅ Complex business logic (discounts, seat management)
5. ✅ Data visualization (Recharts)
6. ✅ QR code generation
7. ✅ Form validation
8. ✅ Responsive design
9. ✅ Mock service for testing
10. ✅ Role-based authorization

### Thesis Defense Points
- **Problem Solved**: Manual ticket booking → Automated online system
- **Technology Choice**: React (industry standard, component-based)
- **Architecture**: 3-tier separation of concerns
- **UX Focus**: Interactive seating map, real-time pricing
- **Business Rules**: Wednesday discount, zone-based pricing
- **Security**: Role-based access, validated inputs
- **Testing**: Complete mock implementation
- **Scalability**: Service layer can switch to real API

## 📚 Dependencies Explained

### Core
- **react**: UI library
- **react-dom**: DOM rendering
- **react-router-dom**: Client-side routing

### Utilities
- **axios**: HTTP client
- **date-fns**: Date manipulation (lightweight alternative to moment.js)
- **clsx**: Conditional class names
- **tailwind-merge**: Merge Tailwind classes correctly

### UI
- **lucide-react**: Icon library (modern, tree-shakeable)
- **recharts**: Chart library (React-based)
- **qrcode.react**: QR code generation

### Development
- **vite**: Build tool (fast, modern)
- **tailwindcss**: Utility-first CSS
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes

---

**Total Implementation Time**: Professional-grade codebase  
**Code Quality**: Production-ready with proper structure  
**Documentation**: Comprehensive README and guides  
**Ready for**: Thesis presentation and live demo
