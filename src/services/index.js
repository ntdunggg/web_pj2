import { showService } from './showService';
import { bookingService } from './bookingService';
import { promotionService } from './promotionService';
import { reportService } from './reportService';
import { authService } from './authService';
import { mockService } from './mockService';

// Check if we're in test mode
const isTestMode = () => {
  return import.meta.env.VITE_TEST_MODE === 'true' || localStorage.getItem('testMode') === 'true';
};

// Service provider that switches between real API and mock
export const serviceProvider = {
  // Auth
  login: async (credentials) => {
    if (isTestMode()) {
      return mockService.login(credentials);
    }
    return authService.login(credentials);
  },

  register: async (userData) => {
    if (isTestMode()) {
      return mockService.register(userData);
    }
    return authService.register(userData);
  },

  logout: () => {
    if (isTestMode()) {
      mockService.logout();
    } else {
      authService.logout();
    }
  },

  getCurrentUser: () => {
    if (isTestMode()) {
      return mockService.getCurrentUser();
    }
    return authService.getCurrentUser();
  },

  isAuthenticated: () => {
    if (isTestMode()) {
      return !!mockService.getCurrentUser();
    }
    return authService.isAuthenticated();
  },

  // Shows
  getShows: async () => {
    if (isTestMode()) {
      return mockService.getShows();
    }
    return showService.getAll();
  },

  getShowById: async (id) => {
    if (isTestMode()) {
      return mockService.getShowById(id);
    }
    return showService.getById(id);
  },

  createShow: async (showData) => {
    if (isTestMode()) {
      return mockService.createShow(showData);
    }
    return showService.create(showData);
  },

  updateShow: async (id, showData) => {
    if (isTestMode()) {
      return mockService.updateShow(id, showData);
    }
    return showService.update(id, showData);
  },

  deleteShow: async (id) => {
    if (isTestMode()) {
      return mockService.deleteShow(id);
    }
    return showService.delete(id);
  },

  uploadShowImage: async (file) => {
    if (isTestMode()) {
      // Return a placeholder URL in test mode
      return { url: URL.createObjectURL(file) };
    }
    return showService.uploadImage(file);
  },

  // Seats
  getSeatAvailability: async (showId) => {
    if (isTestMode()) {
      return mockService.getSeatAvailability(showId);
    }
    return showService.getSeatAvailability(showId);
  },

  // Bookings
  createBooking: async (bookingData) => {
    if (isTestMode()) {
      return mockService.createBooking(bookingData);
    }
    return bookingService.create(bookingData);
  },

  getMyBookings: async () => {
    if (isTestMode()) {
      const user = serviceProvider.getCurrentUser();
      console.log('getMyBookings - current user from serviceProvider:', user);
      return mockService.getMyBookings(user?.id);
    }
    return bookingService.getMyBookings();
  },

  getAllBookings: async (params) => {
    if (isTestMode()) {
      return mockService.getAllBookings();
    }
    return bookingService.getAll(params);
  },

  updateBookingStatus: async (id, status) => {
    if (isTestMode()) {
      return mockService.updateBookingStatus(id, status);
    }
    return bookingService.updateStatus(id, status);
  },

  submitPayment: async ({ bookingId, userId, method, phone, address }) => {
    if (isTestMode()) {
      return mockService.submitPayment({ bookingId, userId, method, phone, address });
    }
    return bookingService.submitPayment({ bookingId, method, phone, address });
  },

  // Promotions
  getPromotions: async () => {
    if (isTestMode()) {
      return mockService.getPromotions();
    }
    return promotionService.getAll();
  },

  getPromotionByCode: async (code) => {
    if (isTestMode()) {
      return mockService.getPromotionByCode(code);
    }
    return promotionService.getByCode(code);
  },

  createPromotion: async (promotionData) => {
    if (isTestMode()) {
      return mockService.createPromotion(promotionData);
    }
    return promotionService.create(promotionData);
  },

  updatePromotion: async (id, promotionData) => {
    if (isTestMode()) {
      return mockService.updatePromotion(id, promotionData);
    }
    return promotionService.update(id, promotionData);
  },

  deletePromotion: async (id) => {
    if (isTestMode()) {
      return mockService.deletePromotion(id);
    }
    return promotionService.delete(id);
  },

  // Reports
  getRevenueReport: async (params) => {
    if (isTestMode()) {
      return mockService.getRevenueReport();
    }
    return reportService.getRevenue(params);
  },

  getSeatOccupancy: async (params) => {
    if (isTestMode()) {
      return mockService.getSeatOccupancy();
    }
    return reportService.getSeatOccupancy(params);
  },

  getPaymentMethodStats: async (params) => {
    if (isTestMode()) {
      const report = await mockService.getRevenueReport();
      return report.paymentMethods;
    }
    return reportService.getPaymentMethodStats(params);
  },
};

export const enableTestMode = () => {
  localStorage.setItem('testMode', 'true');
  mockService.init();
};

export const disableTestMode = () => {
  localStorage.removeItem('testMode');
};
