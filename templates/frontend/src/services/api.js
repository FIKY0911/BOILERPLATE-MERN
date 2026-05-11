import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Items API ──────────────────────────────────────────────
export const itemsAPI = {
  getAll: () => API.get('/items'),
  getById: (id) => API.get(`/items/${id}`),
  create: (data) => API.post('/items', data),
  update: (id, data) => API.put(`/items/${id}`, data),
  delete: (id) => API.delete(`/items/${id}`),
};

export default API;
