/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '../lib/catalogApi';
import { useProducts } from '../hooks/useProducts';

const ProductoContext = createContext();
const fallbackImage = 'https://via.placeholder.com/800x1000/f7f1ea/9b7b52?text=Aurora';

const uniqueImages = (images = []) => [...new Set(images.filter(Boolean))];

const getGeneralGallery = (product) => {
  if (!product) return [];

  const mainImage = product.main_image?.image_url || product.image_url;
  const gallery = (product.gallery_images || []).map(image => image.image_url).filter(Boolean);
  const images = uniqueImages([mainImage, ...gallery]);

  if (images.length) return images;
  const legacyImages = uniqueImages((product.images || []).map(image => image.image_url));
  return legacyImages.length ? legacyImages : [fallbackImage];
};

const getVariantGallery = (product, variant) => {
  const generalGallery = getGeneralGallery(product);
  if (!variant) return generalGallery;

  const variantCover = variant.main_image?.image_url || variant.image_url;
  const variantGallery = (variant.gallery_images || []).map(image => image.image_url).filter(Boolean);
  const variantLegacy = (variant.images || []).map(image => image.image_url).filter(Boolean);
  const variantImages = uniqueImages([variantCover, ...variantGallery]);

  if (variantImages.length) return variantImages;
  if (variantLegacy.length) return uniqueImages(variantLegacy);

  return generalGallery.length ? generalGallery : [fallbackImage];
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

      setProducto(data);
      setSelectedVariantId(null);
      setSelectedImage(0);
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

  const galleryImages = useMemo(() => (
    getVariantGallery(producto, selectedVariant)
  ), [producto, selectedVariant]);

  useEffect(() => {
    if (selectedImage >= galleryImages.length) {
      setSelectedImage(0);
    }
  }, [galleryImages, selectedImage]);

  const selectVariant = useCallback((variant) => {
    setSelectedVariantId(variant?.id ?? null);
    setSelectedImage(0);
  }, []);

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
    galleryImages,
    fallbackImage,
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
