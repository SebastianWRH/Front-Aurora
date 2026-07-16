import React from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import ProductCard from './ProductoCard';

const CatalogoGrid = () => {
  const { sortedProducts, loading, error, clearFilters, activeFilterCount } = useCatalogo();

  if (loading) {
    return (
      <div className="catalogo-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

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

  if (sortedProducts.length === 0) {
    return (
      <div className="no-products">
        <p>No encontramos productos con esos filtros.</p>
        {activeFilterCount > 0 && (
          <button type="button" className="clear-filters-btn" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="catalogo-grid">
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} catalogLayout />
      ))}
    </div>
  );
};

export default CatalogoGrid;
