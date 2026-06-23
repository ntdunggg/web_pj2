import api from './api';

export const reportService = {
  // Get revenue report
  getRevenue: async (params) => {
    const response = await api.get('/reports/revenue', { params });
    return response.data;
  },

  // Get booking statistics
  getBookingStats: async (params) => {
    const response = await api.get('/reports/bookings', { params });
    return response.data;
  },

  // Get seat occupancy report
  getSeatOccupancy: async (params) => {
    const response = await api.get('/reports/seat-occupancy', { params });
    return response.data;
  },

  // Get payment method breakdown
  getPaymentMethodStats: async (params) => {
    const response = await api.get('/reports/payment-methods', { params });
    return response.data;
  },
};
