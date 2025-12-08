import React from 'react';
import { useProducto } from '../../context/ProductoContext';
import { useNavigate } from 'react-router-dom';

const ProductoRelated = () => {
  const { relatedProducts } = useProducto();
  const navigate = useNavigate();

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="producto-related">
      <div className="related-container">
        <h2 className="related-title">Productos Relacionados</h2>
        
        <div className="related-grid">
          {relatedProducts.map(product => (
            <div 
              key={product.id}
              className="related-card"
              onClick={() => navigate(`/producto/${product.id}`)}
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
                  ${parseFloat(product.price).toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
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