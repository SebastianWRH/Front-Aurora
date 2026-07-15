const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const buildUrl = (path, params = {}) => {
  const url = new URL(path, API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'Todos') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const fetchJson = async (path, params, options = {}) => {
  const response = await fetch(buildUrl(path, params), options);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo cargar la informacion del catalogo');
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const getProducts = async (filters = {}) => {
  const data = await fetchJson('/api/products', filters);
  return data.products || [];
};

export const getFeaturedProducts = async () => {
  const data = await fetchJson('/api/products/featured');
  return data.products || [];
};

export const getProductBySlug = async (slug) => {
  const data = await fetchJson(`/api/products/${slug}`);
  return data.product || null;
};

export const getProductById = getProductBySlug;

export const getCategories = async () => {
  const data = await fetchJson('/api/categories');
  return data.categories || [];
};

export const getProductsByCategory = async (category) => {
  const data = await fetchJson(`/api/categories/${category}/products`);
  return data.products || [];
};

export const getSettings = async () => {
  const data = await fetchJson('/api/settings');
  return data.settings || null;
};

const adminFetch = async (path, { method = 'GET', body, params } = {}) => {
  const options = {
    method,
    credentials: 'include'
  };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  return fetchJson(path, params, options);
};

export const adminLogin = async (email, password) => {
  const data = await fetchJson('/api/admin/auth/login', undefined, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return data.admin;
};

export const adminLogout = async () => {
  await adminFetch('/api/admin/auth/logout', { method: 'POST' });
};

export const getCurrentAdmin = async () => {
  const data = await adminFetch('/api/admin/auth/me');
  return data.admin || null;
};

export const getAdminSessionStatus = async () => {
  const data = await adminFetch('/api/admin/auth/status');
  return data.admin || null;
};

export const getAdminProducts = async () => {
  const data = await adminFetch('/api/admin/products');
  return data.products || [];
};

export const createAdminProduct = async (formData) => {
  const data = await adminFetch('/api/admin/products', { method: 'POST', body: formData });
  return data.product;
};

export const updateAdminProduct = async (id, formData) => {
  const data = await adminFetch(`/api/admin/products/${id}`, { method: 'PUT', body: formData });
  return data.product;
};

export const deleteAdminProduct = async (id) => {
  await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
};

export const deleteAdminProductImage = async (productId, imageId) => {
  await adminFetch(`/api/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' });
};

export const getAdminCategories = async () => {
  const data = await adminFetch('/api/admin/categories');
  return data.categories || [];
};

export const createAdminCategory = async (formData) => {
  const data = await adminFetch('/api/admin/categories', { method: 'POST', body: formData });
  return data.category;
};

export const updateAdminCategory = async (id, formData) => {
  const data = await adminFetch(`/api/admin/categories/${id}`, { method: 'PUT', body: formData });
  return data.category;
};

export const deleteAdminCategory = async (id) => {
  await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
};

export const getAdminSettings = async () => {
  const data = await adminFetch('/api/admin/catalog-settings');
  return data.settings || null;
};

export const updateAdminSettings = async (settings) => {
  const data = await adminFetch('/api/admin/catalog-settings', {
    method: 'PUT',
    body: settings
  });
  return data.settings || null;
};

export const catalogApiUrl = API_URL;
