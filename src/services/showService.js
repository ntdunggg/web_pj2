import api from './api';

export const showService = {
  // Get all shows
  getAll: async () => {
    const response = await api.get('/shows');
    return response.data;
  },

  // Get show by ID
  getById: async (id) => {
    const response = await api.get(`/shows/${id}`);
    return response.data;
  },

  // Create new show (Admin only)
  create: async (showData) => {
    const response = await api.post('/shows', showData);
    return response.data;
  },

  // Update show (Admin only)
  update: async (id, showData) => {
    const response = await api.put(`/shows/${id}`, showData);
    return response.data;
  },

  // Delete show (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/shows/${id}`);
    return response.data;
  },

  // Get seat availability for a show
  getSeatAvailability: async (showId) => {
    const response = await api.get(`/shows/${showId}/seats`);
    return response.data;
  },

  // Upload show image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/shows/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
