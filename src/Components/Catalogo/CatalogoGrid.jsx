import React from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import ProductCard from './ProductoCard';

const CatalogoGrid = () => {
  const { sortedProducts, loading, error } = useCatalogo();

  // Estado de carga
  if (loading) {
    return (
      <div className="catalogo-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="catalogo-error">
        <p>Error al cargar productos: {error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Sin productos
  if (sortedProducts.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="catalogo-grid">
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CatalogoGrid;