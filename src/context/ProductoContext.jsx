/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../lib/catalogApi';
import { useProducts } from '../hooks/useProducts';

const ProductoContext = createContext();

const getVariantImageIndex = (product, variant) => {
  const images = product?.images || [];
  if (!images.length || !variant) return 0;

  if (variant.image_url) {
    const imageIndex = images.findIndex(image => image.image_url === variant.image_url);
    if (imageIndex >= 0) return imageIndex;
  }

  const variantIndex = product.variants?.findIndex(item => item.id === variant.id) ?? -1;
  return variantIndex >= 0 && variantIndex < images.length ? variantIndex : 0;
};

export const useProducto = () => {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error('useProducto debe usarse dentro de ProductoProvider');
  }
  return context;
};

export const ProductoProvider = ({ children }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { products: allProducts } = useProducts();

  const fetchProducto = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductBySlug(slug);

      if (!data) {
        setError('Producto no encontrado');
        return;
      }

      const defaultVariant =
        data.variants?.find(variant => variant.stock_status !== 'Agotado') ||
        data.variants?.[0] ||
        null;

      setProducto(data);
      setSelectedVariantId(defaultVariant?.id ?? null);
      setSelectedImage(defaultVariant ? getVariantImageIndex(data, defaultVariant) : 0);
      setQuantity(1);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar producto:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProducto();
    }
  }, [slug, fetchProducto]);

  const relatedProducts = allProducts
    .filter(p => p.category_slug === producto?.category_slug && p.id !== producto?.id)
    .slice(0, 4);

  const selectedVariant = useMemo(() => {
    if (!producto?.variants?.length) return null;
    return producto.variants.find(variant => variant.id === selectedVariantId) || null;
  }, [producto, selectedVariantId]);

  const selectedPrice = useMemo(() => {
    if (!producto) return null;
    if (producto.price === null || producto.price === undefined) return producto.price;

    const basePrice = Number(producto.price);
    if (Number.isNaN(basePrice)) return producto.price;

    return basePrice + Number(selectedVariant?.price_adjustment || 0);
  }, [producto, selectedVariant]);

  const selectVariant = useCallback((variant) => {
    setSelectedVariantId(variant?.id ?? null);

    if (producto && variant) {
      setSelectedImage(getVariantImageIndex(producto, variant));
    }
  }, [producto]);

  const incrementQuantity = () => {
    setQuantity(current => current + 1);
  };

  const decrementQuantity = () => {
    setQuantity(current => Math.max(1, current - 1));
  };

  const goBack = () => {
    navigate(-1);
  };

  const value = {
    producto,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    selectedVariant,
    selectVariant,
    selectedPrice,
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    relatedProducts,
    goBack
  };

  return (
    <ProductoContext.Provider value={value}>
      {children}
    </ProductoContext.Provider>
  );
};
