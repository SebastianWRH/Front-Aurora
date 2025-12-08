import React from 'react';
import CategoryCard from './CategoryCard';


const CategorySection = () => {
  const categories = [
    {
      id: 1,
      title: 'Anillos',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      description: 'Compromiso y elegancia eterna'
    },
    {
      id: 2,
      title: 'Aretes',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      description: 'Elegancia para tus oídos'
    },
    {
      id: 3,
      title: 'Collares',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      description: 'Resalta tu cuello con estilo'
    },
    {
      id: 4,
      title: 'Pulseras',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      description: 'Adornar tus muñecas'
    }
  ];

  return (
    <section className="category-section">
      <div className="category-container">
        <h2 className="category-title">Compra por Categoría</h2>
        <div className="category-grid">
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              title={category.title}
              image={category.image}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;