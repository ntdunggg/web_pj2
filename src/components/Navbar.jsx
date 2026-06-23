import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Home, User, LogOut, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { USER_ROLES } from '../utils/constants';

export const Navbar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <Ticket className="h-8 w-8" />
            <span className="text-xl font-bold">NTDFilm</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span className="hidden md:inline">Home</span>
                </Link>

                {hasRole(USER_ROLES.CUSTOMER) && (
                  <Link
                    to="/my-tickets"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Ticket className="h-5 w-5" />
                    <span className="hidden md:inline">My Tickets</span>
                  </Link>
                )}

                {hasRole(USER_ROLES.STAFF) && (
                  <Link
                    to="/staff/bookings"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="hidden md:inline">Bookings</span>
                  </Link>
                )}

                {hasRole([USER_ROLES.MANAGER, USER_ROLES.ACCOUNTANT]) && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-4 border-l">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
