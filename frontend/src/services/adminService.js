const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('soiree_token')}`,
});

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: authHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const adminService = {
  getReservations: () =>
    request('/admin/reservations'),

  updateStatus: (id, status) =>
    request(`/admin/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteReservation: (id) =>
    request(`/admin/reservations/${id}`, { method: 'DELETE' }),

  deleteAllDone: () =>
    request('/admin/reservations/done/all', { method: 'DELETE' }),

  getMenuItems: () =>
    request('/admin/menu'),

  // FormData uploads — no Content-Type header (browser sets multipart boundary)
  createMenuItem: (formData) =>
    fetch(`${API_URL}/admin/menu`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('soiree_token')}` },
      body: formData,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Create failed');
      return data;
    }),

  updateMenuItem: (id, formData) =>
    fetch(`${API_URL}/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('soiree_token')}` },
      body: formData,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Update failed');
      return data;
    }),

  deleteMenuItem: (id) =>
    request(`/admin/menu/${id}`, { method: 'DELETE' }),
};
