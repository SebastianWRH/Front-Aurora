import React from 'react';
import { useProducto } from '../../context/ProductoContext';

const ProductoGallery = () => {
  const { producto, loading, selectedImage, setSelectedImage } = useProducto();

  if (loading) {
    return (
      <div className="producto-gallery">
        <div className="gallery-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  // Si el producto tiene múltiples imágenes, las usaríamos aquí
  // Por ahora usamos solo la imagen principal
  const images = [producto.image_url];
  
  // Manejar tanto 'stock' como 'Stock' por si acaso
  const stock = producto.Stock ?? producto.stock ?? 0;

  return (
    <div className="producto-gallery">
      {/* Imagen Principal */}
      <div className="gallery-main">
        <img 
          src={images[selectedImage]} 
          alt={producto.name}
          className="main-image"
        />
        {producto.featured && (
          <span className="gallery-badge">Destacado</span>
        )}
        
        {/* Badge de stock bajo */}
        {stock <= 3 && stock > 0 && (
          <span className="gallery-badge stock-low" style={{
            top: 'auto',
            bottom: '20px',
            background: 'linear-gradient(135deg, #e63946 0%, #c9184a 100%)'
          }}>
            ¡Últimas unidades!
          </span>
        )}
        
        {/* Badge sin stock */}
        {stock === 0 && (
          <span className="gallery-badge stock-out" style={{
            top: 'auto',
            bottom: '20px'
          }}>
            Agotado
          </span>
        )}
      </div>

      {/* Miniaturas (si hay múltiples imágenes) */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <div 
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={img} alt={`${producto.name} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductoGallery;