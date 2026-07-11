import React from 'react';
import { useCatalogo } from '../../context/CatalogoContext';

const CatalogoControls = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredProducts
  } = useCatalogo();

  return (
    <div className="catalogo-controls">
      <div className="catalogo-search-row">
        <label className="filter-label" htmlFor="catalog-search">Buscar piezas</label>
        <input
          id="catalog-search"
          className="catalog-search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Collares, perlas, dorado..."
        />
      </div>

      <div className="catalogo-controls-container">
        <div className="filter-section">
          <label className="filter-label">Categoria</label>
          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === 'Todos' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Todos')}
            >
              Todos
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.name || selectedCategory === category.slug ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

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

      <div className="product-count">
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'pieza' : 'piezas'}</span>
      </div>
    </div>
  );
};

export default CatalogoControls;
