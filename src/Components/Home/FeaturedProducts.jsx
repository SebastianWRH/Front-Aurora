import React from 'react';
import ProductCard from '../Catalogo/ProductoCard';
import { useProducts } from '../../hooks/useProducts';

const FeaturedProducts = () => {
  const { products, loading } = useProducts({ featured: 'true' });

  if (loading) {
    return (
      <section className="featured-section">
        <div className="catalogo-loading">
          <div className="loading-spinner"></div>
          <p>Cargando destacados...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-container">
        <span className="section-kicker">Seleccion especial</span>
        <h2 className="category-title">Productos destacados</h2>
        <p className="featured-copy">
          Piezas pensadas para consultar, reservar y coordinar de forma personalizada.
        </p>
        <div className="catalogo-grid featured-grid">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
