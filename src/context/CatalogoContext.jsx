import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const CatalogoContext = createContext();

// Hook personalizado para usar el contexto
export const useCatalogo = () => {
  const context = useContext(CatalogoContext);
  if (!context) {
    throw new Error('useCatalogo debe usarse dentro de CatalogoProvider');
  }
  return context;
};

// Provider del contexto
export const CatalogoProvider = ({ children }) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');
  
  // Obtener productos desde Supabase
  const { products, loading, error, refreshProducts } = useProducts();

  // Configurar categoría inicial desde el state de navegación
  useEffect(() => {
    
    if (location.state?.category) {
      const category = location.state.category;
 
      setSelectedCategory(category);
      
      // Limpiar el state después de aplicarlo
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    } else {
      // Si no hay categoría, resetear a 'Todos'
      setSelectedCategory('Todos');
    }
  }, [location.pathname, location.state]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => 
      selectedCategory === 'Todos' || product.category === selectedCategory
    );

    return filtered;
  }, [selectedCategory, products]);

  // Ordenar productos
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // featured (orden original)
      if (sortBy === 'featured') {
        // Primero los destacados
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      return 0;
    });
  }, [filteredProducts, sortBy]);

  const value = {
    products,
    selectedCategory,
    setSelectedCategory,
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