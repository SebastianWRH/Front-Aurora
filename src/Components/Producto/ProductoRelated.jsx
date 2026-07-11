import React from 'react';
import { useProducto } from '../../context/ProductoContext';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { formatPrice } from '../../lib/whatsapp';

const ProductoRelated = () => {
  const { relatedProducts } = useProducto();
  const navigate = useNavigate();
  const { settings } = useSettings();

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="producto-related">
      <div className="related-container">
        <h2 className="related-title">Piezas relacionadas</h2>
        
        <div className="related-grid">
          {relatedProducts.map(product => (
            <div 
              key={product.id}
              className="related-card"
              onClick={() => navigate(`/producto/${product.slug || product.id}`)}
            >
              <div className="related-image">
                <img src={product.image_url} alt={product.name} />
                {product.featured && (
                  <span className="related-badge">Destacado</span>
                )}
              </div>
              <div className="related-info">
                <span className="related-category">{product.category}</span>
                <h3 className="related-name">{product.name}</h3>
                <p className="related-price">
                  {formatPrice(product.price, settings.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductoRelated;
