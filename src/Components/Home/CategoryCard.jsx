import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ title, image, description }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    // Navegar al catálogo con la categoría seleccionada
    navigate('/catalogo', { state: { category: title } });
  };

  return (
    <div className="category-card">
      <div className="category-card-image">
        <img src={image} alt={title} />
        <div className="category-overlay">
          <button className="category-btn" onClick={handleExplore}>
            Explorar
          </button>
        </div>
      </div>
      <div className="category-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;