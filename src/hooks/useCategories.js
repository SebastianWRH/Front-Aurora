import { useEffect, useState } from 'react';
import { getCategories } from '../lib/catalogApi';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        if (isMounted) setCategories(data);
      } catch (err) {
        if (isMounted) setError(err.message);
        console.error('Error al cargar categorias:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
};
