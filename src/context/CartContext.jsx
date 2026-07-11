/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const storageKey = 'auroraConsultationList';
const legacyStorageKey = 'auroraCart';

const getCartItemKey = (item) => item.cart_id || String(item.id);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedList = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      if (savedList) {
        setCartItems(JSON.parse(savedList));
      }
    } catch (error) {
      console.error('Error al cargar la lista de consulta:', error);
      localStorage.removeItem(storageKey);
      localStorage.removeItem(legacyStorageKey);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
      localStorage.removeItem(legacyStorageKey);
    } catch (error) {
      console.error('Error al guardar la lista de consulta:', error);
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    const quantityToAdd = Number(product.quantity) || 1;
    const cartId = product.cart_id || (product.variant_id ? `${product.id}:${product.variant_id}` : String(product.id));

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => getCartItemKey(item) === cartId);

      if (existingItem) {
        return prevItems.map(item =>
          getCartItemKey(item) === cartId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prevItems, { ...product, cart_id: cartId, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (cartItemKey) => {
    setCartItems(prevItems => prevItems.filter(item => getCartItemKey(item) !== String(cartItemKey)));
  };

  const updateQuantity = (cartItemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemKey);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        getCartItemKey(item) === String(cartItemKey) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity) || 0;
      return Number.isNaN(price) ? total : total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 0), 0);
  };

  const toggleCart = () => {
    setIsCartOpen(isOpen => !isOpen);
  };

  const value = {
    cartItems,
    selectionItems: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
