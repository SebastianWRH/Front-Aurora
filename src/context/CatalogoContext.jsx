/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const CatalogoContext = createContext();

export const useCatalogo = () => {
  const context = useContext(CatalogoContext);
  if (!context) {
    throw new Error('useCatalogo debe usarse dentro de CatalogoProvider');
  }
  return context;
};

export const CatalogoProvider = ({ children }) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const { products, loading, error, refreshProducts } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = location.state?.category || params.get('category') || 'Todos';
    const timeoutId = window.setTimeout(() => {
      setSelectedCategory(category);

      if (location.state?.category) {
        window.history.replaceState({}, document.title);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, location.state]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'Todos' ||
        product.category === selectedCategory ||
        product.category_slug === selectedCategory;

      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.material?.toLowerCase().includes(search) ||
        product.color?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === 'price-desc') return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);

      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }

      return 0;
    });
  }, [filteredProducts, sortBy]);

  const value = {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredProducts,
    sortedProducts,
    loading,
    error,
    refreshProducts
  };

  return (
    <CatalogoContext.Provider value={value}>
      {children}
    </CatalogoContext.Provider>
  );
};
