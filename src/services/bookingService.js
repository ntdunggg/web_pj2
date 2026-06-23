import api from './api';

export const bookingService = {
  // Create new booking
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-tickets');
    return response.data;
  },

  // Get booking by ID
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get all bookings (Staff/Manager only)
  getAll: async (params) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Update booking status (Staff only)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking
  cancel: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
