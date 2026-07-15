import React from 'react';
import { useProducto } from '../../context/ProductoContext';

const ProductoGallery = () => {
  const { producto, loading, selectedImage, setSelectedImage, selectedVariant, galleryImages, fallbackImage } = useProducto();

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

  const images = galleryImages?.length ? galleryImages : [producto.image_url || fallbackImage].filter(Boolean);
  const activeImage = images[selectedImage] || images[0] || fallbackImage;
  const activeStockStatus = selectedVariant?.stock_status || producto.stock_status;

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <div className={`producto-gallery ${images.length > 1 ? 'has-thumbnails' : ''}`}>
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <button
              key={img}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={img}
                alt={`${producto.name} ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="gallery-main">
        <img
          src={activeImage}
          alt={producto.name}
          className="main-image"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        {producto.featured && <span className="gallery-badge">Destacado</span>}
        <span className="gallery-badge stock-low">{activeStockStatus}</span>
      </div>
    </div>
  );
};

export default ProductoGallery;
