import React from 'react';
import { useCatalogo } from '../../context/CatalogoContext';

const CatalogoControls = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy,
    filteredProducts 
  } = useCatalogo();

  const categories = ['Todos', 'Anillos', 'Collares', 'Pulseras', 'Aretes'];

  return (
    <div className="catalogo-controls">
      <div className="catalogo-controls-container">
        {/* Filtro por Categoría */}
        <div className="filter-section">
          <label className="filter-label">Categoría</label>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Ordenar */}
        <div className="sort-section">
          <label className="sort-label">Ordenar por</label>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Contador de Productos */}
      <div className="product-count">
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'pieza' : 'piezas'}</span>
      </div>
    </div>
  );
};

export default CatalogoControls;