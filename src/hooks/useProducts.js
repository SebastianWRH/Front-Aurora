import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../lib/catalogApi';

export const useProducts = (filters = {}) => {
  const { category, search, featured, stock_status: stockStatus } = filters;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({
        category,
        search,
        featured,
        stock_status: stockStatus
      });
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, featured, stockStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refreshProducts = () => {
    fetchProducts();
  };

  return { products, loading, error, refreshProducts };
};
