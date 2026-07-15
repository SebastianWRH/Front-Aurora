import React from 'react';
import { useCatalogo } from '../../context/CatalogoContext';

const formatCount = (count) => `${count} ${count === 1 ? 'producto encontrado' : 'productos encontrados'}`;

const filterId = (prefix, value) =>
  `${prefix}-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const FilterAccordion = ({ title, children, defaultOpen = true }) => (
  <details className="filter-accordion" {...(defaultOpen ? { open: true } : {})}>
    <summary>
      <span>{title}</span>
      <span className="filter-accordion-icon" aria-hidden="true"></span>
    </summary>
    <div className="filter-content">
      {children}
    </div>
  </details>
);

const OptionButton = ({ active, onClick, children, count }) => (
  <button
    type="button"
    className={`filter-option ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <span>{children}</span>
    {typeof count === 'number' && <small>{count}</small>}
  </button>
);

const CheckboxOption = ({ id, checked, onChange, children, count }) => (
  <label className={`filter-check ${checked ? 'active' : ''}`} htmlFor={id}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <span>{children}</span>
    {typeof count === 'number' && <small>{count}</small>}
  </label>
);

const SortSelect = ({ sortBy, setSortBy }) => (
  <select
    className="sort-select"
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
  >
    <option value="featured">Destacados</option>
    <option value="newest">Mas nuevos</option>
    <option value="price-asc">Precio: menor a mayor</option>
    <option value="price-desc">Precio: mayor a menor</option>
    <option value="name">Nombre A-Z</option>
  </select>
);

const CatalogoControls = () => {
  const {
    filters,
    filterOptions,
    priceBounds,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    activeFilterCount,
    sortBy,
    setSortBy,
    filteredProducts
  } = useCatalogo();

  const countLabel = formatCount(filteredProducts.length);
  const hasPriceRange = priceBounds.hasPrices && priceBounds.min < priceBounds.max;
  const priceMinValue = filters.priceMin === '' ? priceBounds.min : Number(filters.priceMin);
  const priceMaxValue = filters.priceMax === '' ? priceBounds.max : Number(filters.priceMax);
  const hasCollectionFilters = filterOptions.hasFeatured || filterOptions.hasNew;

  const updatePrice = (key, value) => {
    if (value === '') {
      updateFilter(key, '');
      return;
    }

    const nextValue = Math.min(Math.max(Number(value), priceBounds.min), priceBounds.max);

    if (key === 'priceMin' && filters.priceMax !== '' && nextValue > Number(filters.priceMax)) {
      updateFilter('priceMax', String(nextValue));
    }

    if (key === 'priceMax' && filters.priceMin !== '' && nextValue < Number(filters.priceMin)) {
      updateFilter('priceMin', String(nextValue));
    }

    updateFilter(key, String(nextValue));
  };

  return (
    <>
      <aside className="catalogo-filter-panel" aria-label="Filtros del catalogo">
        <div className="filter-panel-header">
          <div>
            <span className="filter-label">Filtros</span>
            <p>{countLabel}</p>
          </div>

          {activeFilterCount > 0 && (
            <button type="button" className="clear-filters-btn" onClick={clearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="active-filter-summary">
            {activeFilterCount} {activeFilterCount === 1 ? 'filtro activo' : 'filtros activos'}
          </div>
        )}

        {filterOptions.categories.length > 0 && (
          <FilterAccordion title="Categoria">
            <div className="filter-options">
              <OptionButton
                active={filters.category === 'Todos'}
                onClick={() => updateFilter('category', 'Todos')}
              >
                Todos
              </OptionButton>

              {filterOptions.categories.map(category => (
                <OptionButton
                  key={category.value}
                  active={filters.category === category.value}
                  onClick={() => updateFilter('category', category.value)}
                >
                  {category.label}
                </OptionButton>
              ))}
            </div>
          </FilterAccordion>
        )}

        {hasPriceRange && (
          <FilterAccordion title="Precio">
            <div className="price-filter">
              <div className="price-range-values">
                <span>S/ {priceMinValue}</span>
                <span>S/ {priceMaxValue}</span>
              </div>

              <div className="price-sliders">
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMinValue}
                  onChange={(event) => updatePrice('priceMin', event.target.value)}
                  aria-label="Precio minimo"
                />
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMaxValue}
                  onChange={(event) => updatePrice('priceMax', event.target.value)}
                  aria-label="Precio maximo"
                />
              </div>

              <div className="price-inputs">
                <label>
                  Minimo
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={filters.priceMin}
                    placeholder={String(priceBounds.min)}
                    onChange={(event) => updatePrice('priceMin', event.target.value)}
                  />
                </label>
                <label>
                  Maximo
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={filters.priceMax}
                    placeholder={String(priceBounds.max)}
                    onChange={(event) => updatePrice('priceMax', event.target.value)}
                  />
                </label>
              </div>
            </div>
          </FilterAccordion>
        )}

        {filterOptions.materials.length > 0 && (
          <FilterAccordion title="Material">
            <div className="filter-options">
              {filterOptions.materials.map(material => (
                <CheckboxOption
                  key={material}
                  id={filterId('material', material)}
                  checked={filters.materials.includes(material)}
                  onChange={() => toggleArrayFilter('materials', material)}
                >
                  {material}
                </CheckboxOption>
              ))}
            </div>
          </FilterAccordion>
        )}

        {filterOptions.colors.length > 0 && (
          <FilterAccordion title="Color">
            <div className="filter-options">
              {filterOptions.colors.map(color => (
                <CheckboxOption
                  key={color}
                  id={filterId('color', color)}
                  checked={filters.colors.includes(color)}
                  onChange={() => toggleArrayFilter('colors', color)}
                >
                  {color}
                </CheckboxOption>
              ))}
            </div>
          </FilterAccordion>
        )}

        {filterOptions.hasAvailability && filterOptions.availability.length > 0 && (
          <FilterAccordion title="Disponibilidad">
            <div className="filter-options">
              {filterOptions.availability.map(option => (
                <CheckboxOption
                  key={option.value}
                  id={filterId('availability', option.value)}
                  checked={filters.availability.includes(option.value)}
                  onChange={() => toggleArrayFilter('availability', option.value)}
                  count={option.count}
                >
                  {option.label}
                </CheckboxOption>
              ))}
            </div>
          </FilterAccordion>
        )}

        {hasCollectionFilters && (
          <FilterAccordion title="Coleccion">
            <div className="filter-options">
              {filterOptions.hasFeatured && (
                <CheckboxOption
                  id="filter-featured"
                  checked={filters.featured}
                  onChange={() => updateFilter('featured', !filters.featured)}
                >
                  Productos destacados
                </CheckboxOption>
              )}

              {filterOptions.hasNew && (
                <CheckboxOption
                  id="filter-new"
                  checked={filters.isNew}
                  onChange={() => updateFilter('isNew', !filters.isNew)}
                >
                  Productos nuevos
                </CheckboxOption>
              )}
            </div>
          </FilterAccordion>
        )}

        <FilterAccordion title="Ordenar" defaultOpen={false}>
          <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
        </FilterAccordion>
      </aside>

      <div className="mobile-catalog-toolbar">
        <span>{countLabel}</span>
        <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </>
  );
};

export default CatalogoControls;
