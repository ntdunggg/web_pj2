import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { ShowDetailsPage } from './pages/ShowDetailsPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { USER_ROLES } from './utils/constants';

console.log('App.jsx loaded successfully');

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/show/:id" element={<ShowDetailsPage />} />

      {/* Customer Routes */}
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <BookingSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/bookings"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STAFF]}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ACCOUNTANT]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
