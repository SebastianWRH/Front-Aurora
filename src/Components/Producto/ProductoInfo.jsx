import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducto } from '../../context/ProductoContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { formatPrice, generateProductWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp';

const colorSwatches = {
  amarillo: '#f4c430',
  azul: '#1f45d8',
  multicolor: 'conic-gradient(#121826, #1f45d8, #d4af37, #7c3aed, #121826)',
  morado: '#6f3bb5',
  negro: '#1f1d1b',
  rosado: '#d94fa3',
  verde: '#14884f'
};

const getSwatchStyle = (value = '') => {
  const normalizedValue = value.toLowerCase();
  const colorKey = Object.keys(colorSwatches).find(key => normalizedValue.includes(key));
  return { background: colorSwatches[colorKey] || '#d7c6ad' };
};

const ProductoInfo = () => {
  const {
    producto,
    loading,
    error,
    selectedVariant,
    selectVariant,
    selectedPrice,
    quantity,
    incrementQuantity,
    decrementQuantity,
    goBack
  } = useProducto();
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleCategoryClick = (e) => {
    e.preventDefault();
    navigate('/catalogo', { state: { category: producto.category_slug || producto.category } });
  };

  const handleAddToSelection = () => {
    if (!producto || producto.stock_status === 'Agotado') return;

    const variantLabel = selectedVariant
      ? `${selectedVariant.name}: ${selectedVariant.value}`
      : null;

    addToCart({
      cart_id: selectedVariant ? `${producto.id}:${selectedVariant.id}` : String(producto.id),
      id: producto.id,
      slug: producto.slug,
      name: producto.name,
      price: selectedPrice,
      image: selectedVariant?.image_url || producto.image_url,
      category: producto.category,
      color: selectedVariant?.name?.toLowerCase() === 'color' ? selectedVariant.value : producto.color,
      variant_id: selectedVariant?.id,
      variant_label: variantLabel,
      stock_status: producto.stock_status,
      quantity
    });
    setIsCartOpen(true);
  };

  const handleWhatsApp = () => {
    if (!producto) return;

    const message = generateProductWhatsAppMessage({
      ...producto,
      price: selectedPrice,
      color: selectedVariant?.name?.toLowerCase() === 'color' ? selectedVariant.value : producto.color,
      variant_label: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : null
    }, quantity, settings.currency);
    openWhatsApp(message, settings.whatsapp_number);
  };

  if (loading) {
    return (
      <div className="producto-info">
        <div className="info-loading">
          <div className="loading-spinner"></div>
          <p>Cargando informacion...</p>
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
            Volver al catalogo
          </button>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  const activeStockStatus = selectedVariant?.stock_status || producto.stock_status;
  const displayColor = selectedVariant?.name?.toLowerCase() === 'color'
    ? selectedVariant.value
    : producto.color;
  const hasVariantOptions = producto.variants?.length > 1;
  const variantName = producto.variants?.[0]?.name || 'Variante';
  const isColorVariant = variantName.toLowerCase() === 'color';
  const isUnavailable = producto.stock_status === 'Agotado' || activeStockStatus === 'Agotado';

  return (
    <div className="producto-info">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="separator">/</span>
        <Link to="/catalogo">Catalogo</Link>
        <span className="separator">/</span>
        <a href="/catalogo" onClick={handleCategoryClick}>
          {producto.category}
        </a>
        <span className="separator">/</span>
        <span className="current">{producto.name}</span>
      </div>

      <h1 className="producto-name">{producto.name}</h1>

      <div className="producto-price-section">
        {selectedPrice !== null && selectedPrice !== undefined && (
          <p className="producto-price">{formatPrice(selectedPrice, settings.currency)}</p>
        )}
      </div>

      <a href="/catalogo" onClick={handleCategoryClick} className="producto-category">
        {producto.category}
      </a>

      {producto.description && (
        <div className="producto-description">
          <h3>Descripcion</h3>
          <p>{producto.description}</p>
        </div>
      )}

      <div className="producto-specs">
        {producto.material && <span>Material: {producto.material}</span>}
        {displayColor && <span>Color: {displayColor}</span>}
        {producto.size && <span>Medida: {producto.size}</span>}
      </div>

      <div className="producto-stock">
        <span className={isUnavailable ? 'stock-unavailable' : 'stock-available'}>
          {activeStockStatus}
        </span>
      </div>

      {producto.tags?.length > 0 && (
        <div className="producto-tags">
          {producto.tags.map(tag => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      )}

      {hasVariantOptions && (
        <div className="producto-variants">
          <div className="variants-header">
            <h3>{isColorVariant ? 'Selecciona color' : 'Variantes disponibles'}</h3>
            {selectedVariant && <span>{selectedVariant.value}</span>}
          </div>

          <div className={`variant-options ${isColorVariant ? 'color-options' : ''}`}>
            {producto.variants.map(variant => {
              const isActive = selectedVariant?.id === variant.id;
              const isSoldOut = variant.stock_status === 'Agotado';

              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`variant-option ${isActive ? 'active' : ''}`}
                  onClick={() => selectVariant(variant)}
                  disabled={isSoldOut}
                  aria-pressed={isActive}
                >
                  {isColorVariant && <span className="variant-swatch" style={getSwatchStyle(variant.value)} />}
                  <span>{variant.value}</span>
                  {isSoldOut && <small>Agotado</small>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isUnavailable && (
        <div className="producto-quantity">
          <label>Cantidad para consultar</label>
          <div className="quantity-selector">
            <button className="qty-btn" onClick={decrementQuantity} disabled={quantity <= 1}>
              -
            </button>
            <input type="number" value={quantity} readOnly className="qty-input" />
            <button className="qty-btn" onClick={incrementQuantity}>
              +
            </button>
          </div>
        </div>
      )}

      <div className="producto-actions">
        <button
          className="add-to-cart-btn"
          onClick={handleAddToSelection}
          disabled={isUnavailable}
        >
          Agregar a mi lista
        </button>
        <button className="buy-now-btn" onClick={handleWhatsApp}>
          Consultar por WhatsApp
        </button>
      </div>

      <div className="producto-features">
        <div className="feature-item">
          <span>Consulta disponibilidad antes de comprar</span>
        </div>
        <div className="feature-item">
          <span>Coordinacion de entrega por WhatsApp</span>
        </div>
        <div className="feature-item">
          <span>Piezas seleccionadas con acabado artesanal</span>
        </div>
      </div>
    </div>
  );
};

export default ProductoInfo;
