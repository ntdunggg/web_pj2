import api from './api';

export const promotionService = {
  // Get all promotions
  getAll: async () => {
    const response = await api.get('/promotions');
    return response.data;
  },

  // Get promotion by code
  getByCode: async (code) => {
    const response = await api.get(`/promotions/code/${code}`);
    return response.data;
  },

  // Create promotion (Manager only)
  create: async (promotionData) => {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  },

  // Update promotion (Manager only)
  update: async (id, promotionData) => {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Delete promotion (Manager only)
  delete: async (id) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  // Apply promotion to booking
  apply: async (code, bookingAmount) => {
    const response = await api.post('/promotions/apply', { code, amount: bookingAmount });
    return response.data;
  },
};
