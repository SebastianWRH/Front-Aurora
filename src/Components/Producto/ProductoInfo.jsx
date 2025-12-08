import React from 'react';
import { useProducto } from '../../context/ProductoContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const ProductoInfo = () => {
  const { 
    producto, 
    loading, 
    error,
    quantity,
    incrementQuantity,
    decrementQuantity,
    goBack
  } = useProducto();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Función para navegar al catálogo con categoría
  const handleCategoryClick = (e) => {
    e.preventDefault();
    navigate('/catalogo', { state: { category: producto.category } });
  };

  // Función para agregar al carrito
  const handleAddToCart = () => {
    if (!producto || stock === 0) return;

    // Agregar producto con la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image_url,
        category: producto.category,
        stock: stock
      });
    }

    // Opcional: Mostrar feedback
    console.log(`${quantity} unidad(es) de ${producto.name} agregado(s) al carrito`);
  };

  // Función para comprar ahora
  const handleBuyNow = () => {
    if (!producto || stock === 0) return;

    // Agregar al carrito con la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image_url,
        category: producto.category,
        stock: stock
      });
    }

    // Redirigir al checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="producto-info">
        <div className="info-loading">
          <div className="loading-spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="producto-info">
        <div className="info-error">
          <p>{error}</p>
          <button onClick={goBack} className="back-btn">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  // Manejar tanto 'stock' como 'Stock' por si acaso
  const stock = producto.Stock ?? producto.stock ?? 0;

  return (
    <div className="producto-info">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="separator">›</span>
        <Link to="/catalogo">Catálogo</Link>
        <span className="separator">›</span>
        <a 
          href="/catalogo" 
          onClick={handleCategoryClick}
          style={{ cursor: 'pointer' }}
        >
          {producto.category}
        </a>
        <span className="separator">›</span>
        <span className="current">{producto.name}</span>
      </div>

      {/* Categoría */}
      <span className="producto-category">{producto.category}</span>

      {/* Nombre */}
      <h1 className="producto-name">{producto.name}</h1>

      {/* Precio */}
      <div className="producto-price-section">
        <p className="producto-price">
          S/{parseFloat(producto.price).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <span className="price-tax">Incluye IGV</span>
      </div>

      {/* Descripción */}
      {producto.description && (
        <div className="producto-description">
          <h3>Descripción</h3>
          <p>{producto.description}</p>
        </div>
      )}

      {/* Stock */}
      <div className="producto-stock">
        {stock > 0 ? (
          <>
            <span className="stock-available">✓ En stock</span>
            {stock <= 5 && (
              <span className="stock-low">
                Solo quedan {stock} disponibles
              </span>
            )}
          </>
        ) : (
          <span className="stock-unavailable">✗ Agotado</span>
        )}
      </div>

      {/* Cantidad */}
      {stock > 0 && (
        <div className="producto-quantity">
          <label>Cantidad</label>
          <div className="quantity-selector">
            <button 
              className="qty-btn"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              −
            </button>
            <input 
              type="number" 
              value={quantity} 
              readOnly
              className="qty-input"
            />
            <button 
              className="qty-btn"
              onClick={incrementQuantity}
              disabled={quantity >= stock}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="producto-actions">
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Agregar al Carrito
        </button>
        <button 
          className="buy-now-btn"
          onClick={handleBuyNow}
          disabled={stock === 0}
        >
          Comprar Ahora
        </button>
      </div>

      {/* Información adicional */}
      <div className="producto-features">
        <div className="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Garantía de autenticidad</span>
        </div>
        <div className="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <span>Pago seguro</span>
        </div>
        <div className="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Envío en 24-48 horas</span>
        </div>
      </div>
    </div>
  );
};

export default ProductoInfo;