import React from 'react';
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleExplore = () => {
    navigate('/catalogo');
  };
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop" 
            alt="Joyería elegante" 
          />
        </div>
        <div className="hero-content">
          <h1>Impón tu estilo con nuestra bisutería artesanal única</h1>
        
            <p>Sumérgete en el mundo de la elegancia natural. Cada pieza está hecha a mano
            con dedicación, cuidando cada detalle para que expreses tu autenticidad con estilo.</p> 
            <p>Diseños atemporales, materiales nobles y ese toque artesanal que marca la diferencia.</p>
            <p>No sigas modas. Llévalas puestas!</p>
           
          <button onClick={handleExplore}  className="hero-btn">Ver Colección</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;