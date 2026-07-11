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

const fetchJson = async (path, params) => {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo cargar la informacion del catalogo');
  }

  return response.json();
};

export const getProducts = async (filters = {}) => {
  const data = await fetchJson('/api/products', filters);
  return data.products || [];
};

export const getFeaturedProducts = async () => {
  return getProducts({ featured: 'true' });
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

export const catalogApiUrl = API_URL;
