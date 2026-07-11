import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { formatPrice, generateProductWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  const placeholderImage = 'https://via.placeholder.com/600x760/f7f1ea/9b7b52?text=Aurora';
  const isUnavailable = product.stock_status === 'Agotado';
  const hasOptions = product.has_variants || Number(product.variant_count || 0) > 1;

  const handleViewDetails = () => {
    navigate(`/producto/${product.slug || product.id}`);
  };

  const handleAddToSelection = (event) => {
    event.stopPropagation();
    if (isUnavailable) return;

    if (hasOptions) {
      handleViewDetails();
      return;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image_url,
      category: product.category,
      stock_status: product.stock_status
    });
    setIsCartOpen(true);
  };

  const handleWhatsApp = (event) => {
    event.stopPropagation();
    const message = generateProductWhatsAppMessage(product, 1, settings.currency);
    openWhatsApp(message, settings.whatsapp_number);
  };

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="product-image-container">
        <img
          src={imageError ? placeholderImage : product.image_url}
          alt={product.name}
          className="product-image"
          onError={() => setImageError(true)}
        />

        {product.featured && <span className="product-badge">Destacado</span>}
        <span className={`product-badge stock-badge status-${product.stock_status?.replaceAll(' ', '-').toLowerCase()}`}>
          {product.stock_status}
        </span>

        <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
          <button className="quick-view-btn" onClick={handleViewDetails}>
            Ver detalle
          </button>
          <button className="add-to-cart-btn" onClick={handleAddToSelection} disabled={isUnavailable}>
            {isUnavailable ? 'Agotado' : hasOptions ? 'Elegir opcion' : 'Agregar a mi lista'}
          </button>
          <button className="whatsapp-card-btn" onClick={handleWhatsApp}>
            Consultar por WhatsApp
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        {product.description && (
          <p className="product-description">
            {product.description.length > 86
              ? `${product.description.substring(0, 86)}...`
              : product.description}
          </p>
        )}

        <div className="product-meta">
          {product.material && <span>{product.material}</span>}
          {product.color && <span>{product.color}</span>}
        </div>

        {product.price !== null && product.price !== undefined && (
          <p className="product-price">{formatPrice(product.price, settings.currency)}</p>
        )}

        <div className="product-mobile-actions">
          <button className="add-to-cart-btn" onClick={handleAddToSelection} disabled={isUnavailable}>
            {isUnavailable ? 'Agotado' : 'Agregar a la lista'}
          </button>
          <button className="whatsapp-card-btn" onClick={handleWhatsApp}>
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
