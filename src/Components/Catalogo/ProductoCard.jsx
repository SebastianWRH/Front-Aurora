import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Imagen placeholder si hay error
  const placeholderImage = 'https://via.placeholder.com/500x500/f5f5f5/d4af37?text=Aurora+Joyeria';

  // Manejar tanto 'stock' como 'Stock' por si acaso
  const stock = product.Stock ?? product.stock ?? 0;

  const handleViewDetails = () => {
    navigate(`/producto/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evitar que se active el click del card
    
    if (stock === 0) return;

    // Agregar producto al carrito
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      category: product.category,
      stock: stock
    });

    // Opcional: Mostrar feedback visual (puedes implementar un toast/notification)
    console.log('Producto agregado al carrito:', product.name);
  };

  return (
    <div 
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
        {product.featured && (
          <span className="product-badge">Destacado</span>
        )}
        
        {/* Badge de stock bajo */}
        {stock <= 3 && stock > 0 && (
          <span className="product-badge stock-badge" style={{
            top: 'auto',
            bottom: '15px',
            background: 'linear-gradient(135deg, #e63946 0%, #c9184a 100%)'
          }}>
            ¡Últimas unidades!
          </span>
        )}
        
        {/* Badge sin stock */}
        {stock === 0 && (
          <span className="product-badge stock-badge" style={{
            top: 'auto',
            bottom: '15px',
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
          }}>
            Agotado
          </span>
        )}

        <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
          <button 
            className="quick-view-btn"
            onClick={handleViewDetails}
          >
            Ver Detalles
          </button>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        
        {/* Mostrar descripción si existe */}
        {product.description && (
          <p className="product-description" style={{
            fontSize: '13px',
            color: '#999',
            marginBottom: '10px',
            lineHeight: '1.5'
          }}>
            {product.description.substring(0, 60)}...
          </p>
        )}
        
        <p className="product-price">
          S/{parseFloat(product.price).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        
        {/* Indicador de stock */}
        {stock > 0 && stock <= 5 && (
          <p style={{
            fontSize: '12px',
            color: '#e63946',
            marginTop: '5px',
            fontWeight: '300'
          }}>
            Solo quedan {stock} disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;