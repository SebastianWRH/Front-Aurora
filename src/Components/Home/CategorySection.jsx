import React from 'react';
import CategoryCard from './CategoryCard';
import { useCategories } from '../../hooks/useCategories';

const CategorySection = () => {
  const { categories, loading } = useCategories();

  return (
    <section className="category-section" id="categorias">
      <div className="category-container">
        <span className="section-kicker">Explora por estilo</span>
        <h2 className="category-title">Categorias del catalogo</h2>

        {loading ? (
          <div className="catalogo-loading">
            <div className="loading-spinner"></div>
            <p>Cargando categorias...</p>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                title={category.name}
                slug={category.slug}
                image={category.image}
                description={category.description}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
