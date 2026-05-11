const API_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const authService = {
  login: (email, password) =>
    request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (firstName, lastName, username, email, password) =>
    request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    }),

  logout: (token) =>
    request('/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }),
};
