const BASE_URL = '/api';

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('nexauth_token');
export const setToken = (t) => localStorage.setItem('nexauth_token', t);
export const removeToken = () => localStorage.removeItem('nexauth_token');

export const getUser = () => {
  const raw = localStorage.getItem('nexauth_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};
export const setUser = (u) => localStorage.setItem('nexauth_user', JSON.stringify(u));
export const removeUser = () => localStorage.removeItem('nexauth_user');

// ─── Base request ─────────────────────────────────────────────────────────────

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) headers['Authorization'] = `Token ${token}`;

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.non_field_errors?.[0] ||
      Object.values(data)?.[0]?.[0] ||
      data?.detail ||
      'Something went wrong.';
    throw new Error(msg);
  }
  return data;
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (formData) =>
    request('/auth/register/', { method: 'POST', body: formData }),

  login: (credentials) =>
    request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () => request('/auth/logout/', { method: 'POST' }),
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userAPI = {
  getProfile: () => request('/user/profile/'),

  updateProfile: (formData) =>
    request('/user/profile/update/', { method: 'PATCH', body: formData }),
};