const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('soiree_token')}`,
});

const request = async (endpoint, options = {}) => {
  const { headers: extraHeaders, ...rest } = options;
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { ...authHeaders(), ...(extraHeaders ?? {}) },
    ...rest,
  });
  if (!res.ok) {
    let message = 'Request failed';
    try { ({ message } = await res.json()); } catch { /* non-JSON error body */ }
    throw new Error(message);
  }
  return res.json();
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
      if (!r.ok) {
        let message = 'Create failed';
        try { ({ message } = await r.json()); } catch { /* non-JSON error body */ }
        throw new Error(message);
      }
      return r.json();
    }),

  updateMenuItem: (id, formData) =>
    fetch(`${API_URL}/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('soiree_token')}` },
      body: formData,
    }).then(async (r) => {
      if (!r.ok) {
        let message = 'Update failed';
        try { ({ message } = await r.json()); } catch { /* non-JSON error body */ }
        throw new Error(message);
      }
      return r.json();
    }),

  deleteMenuItem: (id) =>
    request(`/admin/menu/${id}`, { method: 'DELETE' }),
};
