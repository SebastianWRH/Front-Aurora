import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../lib/supabaseClient';
import { useProducts } from '../hooks/useProducts';

const ProductoContext = createContext();

export const useProducto = () => {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error('useProducto debe usarse dentro de ProductoProvider');
  }
  return context;
};

export const ProductoProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Obtener todos los productos para relacionados
  const { products: allProducts } = useProducts();

  useEffect(() => {
    if (id) {
      fetchProducto();
    }
  }, [id]);

  const fetchProducto = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      
      if (!data) {
        setError('Producto no encontrado');
        return;
      }
      
      setProducto(data);
      setSelectedImage(0);
      setQuantity(1);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar producto:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = allProducts
    .filter(p => p.category === producto?.category && p.id !== producto?.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    console.log('Agregar al carrito:', {
      producto: producto.id,
      cantidad: quantity
    });
    // Aquí implementarías la lógica del carrito
  };

  const handleBuyNow = () => {
    console.log('Comprar ahora:', {
      producto: producto.id,
      cantidad: quantity
    });
    // Aquí implementarías la lógica de compra directa
  };

  const incrementQuantity = () => {
    if (producto && quantity < producto.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    handleBuyNow,
    relatedProducts,
    goBack
  };

  return (
    <ProductoContext.Provider value={value}>
      {children}
    </ProductoContext.Provider>
  );
};