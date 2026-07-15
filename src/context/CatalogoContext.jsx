/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const CatalogoContext = createContext();

const storageKey = 'aurora-catalogo-filtros';
const defaultFilters = {
  category: 'Todos',
  priceMin: '',
  priceMax: '',
  materials: [],
  colors: [],
  availability: [],
  featured: false,
  isNew: false
};

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const readStoredState = () => {
  if (typeof window === 'undefined') {
    return { filters: defaultFilters, sortBy: 'featured' };
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey));
    if (!stored) return { filters: defaultFilters, sortBy: 'featured' };

    return {
      filters: {
        ...defaultFilters,
        ...stored.filters,
        materials: Array.isArray(stored.filters?.materials) ? stored.filters.materials : [],
        colors: Array.isArray(stored.filters?.colors) ? stored.filters.colors : [],
        availability: Array.isArray(stored.filters?.availability) ? stored.filters.availability : []
      },
      sortBy: stored.sortBy || 'featured'
    };
  } catch {
    return { filters: defaultFilters, sortBy: 'featured' };
  }
};

const getPriceNumber = (product) => {
  const price = Number(product.price);
  return Number.isFinite(price) ? price : null;
};

const hasRecentDate = (dateValue) => {
  if (!dateValue) return false;

  const timestamp = new Date(dateValue).getTime();
  if (Number.isNaN(timestamp)) return false;

  const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  return daysSince >= 0 && daysSince <= 45;
};

const isNewProduct = (product) =>
  Boolean(product.is_new || product.isNew || product.new || hasRecentDate(product.created_at));

const isOutOfStock = (product) => {
  const status = normalizeText(product.stock_status);
  return status.includes('agotado') || status.includes('sin stock');
};

const getProductColors = (product) => {
  const values = [];
  if (product.color) values.push(product.color);

  (product.variants || []).forEach((variant) => {
    const variantName = normalizeText(variant.name || variant.type || 'color');
    if (variant.value && variantName.includes('color')) values.push(variant.value);
    if (variant.color_name) values.push(variant.color_name);
  });

  return [...new Set(values.filter(Boolean))];
};

const uniqueOptions = (values) => {
  const optionMap = new Map();

  values.filter(Boolean).forEach((value) => {
    const key = normalizeText(value);
    if (key && !optionMap.has(key)) {
      optionMap.set(key, String(value).trim());
    }
  });

  return [...optionMap.values()].sort((a, b) => a.localeCompare(b, 'es'));
};

export const useCatalogo = () => {
  const context = useContext(CatalogoContext);
  if (!context) {
    throw new Error('useCatalogo debe usarse dentro de CatalogoProvider');
  }
  return context;
};

export const CatalogoProvider = ({ children }) => {
  const location = useLocation();
  const storedState = useMemo(() => readStoredState(), []);
  const [filters, setFilters] = useState(storedState.filters);
  const [sortBy, setSortBy] = useState(storedState.sortBy);

  const { products, loading, error, refreshProducts } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = location.state?.category || params.get('category');
    if (!category) return undefined;

    const timeoutId = window.setTimeout(() => {
      setFilters(current => ({ ...current, category }));

      if (location.state?.category) {
        window.history.replaceState({}, document.title);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, location.state]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ filters, sortBy }));
  }, [filters, sortBy]);

  const updateFilter = useCallback((key, value) => {
    setFilters(current => ({ ...current, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(current => {
      const currentValues = Array.isArray(current[key]) ? current[key] : [];
      const exists = currentValues.includes(value);

      return {
        ...current,
        [key]: exists
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const priceBounds = useMemo(() => {
    const prices = products
      .map(getPriceNumber)
      .filter(price => price !== null);

    if (!prices.length) {
      return { min: 0, max: 0, hasPrices: false };
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
      hasPrices: true
    };
  }, [products]);

  const filterOptions = useMemo(() => {
    const productCategoryOptions = products
      .map(product => ({
        value: product.category_slug || product.category,
        label: product.category || product.category_slug
      }))
      .filter(option => option.value && option.label);

    const categoryOptions = categories
      .filter(category => products.some(product => (
        normalizeText(product.category_slug) === normalizeText(category.slug) ||
        normalizeText(product.category) === normalizeText(category.name)
      )))
      .map(category => ({
        value: category.slug || category.name,
        label: category.name || category.slug
      }));

    const categoriesMap = new Map();
    [...categoryOptions, ...productCategoryOptions].forEach((option) => {
      const key = normalizeText(option.value);
      if (key && !categoriesMap.has(key)) categoriesMap.set(key, option);
    });

    const outOfStockCount = products.filter(isOutOfStock).length;
    const inStockCount = products.length - outOfStockCount;

    return {
      categories: [...categoriesMap.values()].sort((a, b) => a.label.localeCompare(b.label, 'es')),
      materials: uniqueOptions(products.map(product => product.material)),
      colors: uniqueOptions(products.flatMap(getProductColors)),
      availability: [
        { value: 'in-stock', label: 'En stock', count: inStockCount },
        { value: 'out-of-stock', label: 'Agotado', count: outOfStockCount }
      ].filter(option => option.count > 0),
      hasAvailability: products.length > 0,
      hasFeatured: products.some(product => Boolean(product.featured)),
      hasNew: products.some(isNewProduct)
    };
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const minPrice = filters.priceMin === '' ? null : Number(filters.priceMin);
    const maxPrice = filters.priceMax === '' ? null : Number(filters.priceMax);
    const selectedMaterials = filters.materials.map(normalizeText);
    const selectedColors = filters.colors.map(normalizeText);

    return products.filter(product => {
      const productPrice = getPriceNumber(product);
      const productCategory = normalizeText(product.category);
      const productCategorySlug = normalizeText(product.category_slug);
      const selectedCategory = normalizeText(filters.category);
      const productColors = getProductColors(product).map(normalizeText);

      const matchesCategory =
        filters.category === 'Todos' ||
        productCategory === selectedCategory ||
        productCategorySlug === selectedCategory;

      const matchesPrice =
        (minPrice === null || (productPrice !== null && productPrice >= minPrice)) &&
        (maxPrice === null || (productPrice !== null && productPrice <= maxPrice));

      const matchesMaterial =
        !selectedMaterials.length || selectedMaterials.includes(normalizeText(product.material));

      const matchesColor =
        !selectedColors.length || selectedColors.some(color => productColors.includes(color));

      const outOfStock = isOutOfStock(product);
      const matchesAvailability =
        !filters.availability.length ||
        (filters.availability.includes('in-stock') && !outOfStock) ||
        (filters.availability.includes('out-of-stock') && outOfStock);

      const matchesFeatured = !filters.featured || Boolean(product.featured);
      const matchesNew = !filters.isNew || isNewProduct(product);

      return (
        matchesCategory &&
        matchesPrice &&
        matchesMaterial &&
        matchesColor &&
        matchesAvailability &&
        matchesFeatured &&
        matchesNew
      );
    });
  }, [filters, products]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === 'price-desc') return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'es');
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);

      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }

      return 0;
    });
  }, [filteredProducts, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'Todos') count += 1;
    if (filters.priceMin !== '' || filters.priceMax !== '') count += 1;
    count += filters.materials.length;
    count += filters.colors.length;
    count += filters.availability.length;
    if (filters.featured) count += 1;
    if (filters.isNew) count += 1;
    return count;
  }, [filters]);

  const value = {
    products,
    categories,
    filters,
    filterOptions,
    priceBounds,
    selectedCategory: filters.category,
    setSelectedCategory: (category) => updateFilter('category', category),
    sortBy,
    setSortBy,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    activeFilterCount,
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
