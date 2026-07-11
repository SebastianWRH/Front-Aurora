import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const heroSlides = [
  { image: '/hero/aurora-hero.png', label: 'Aurora hero 1' },
  { image: '/hero/aurora-hero.png', label: 'Aurora hero 2' },
  { image: '/hero/aurora-hero.png', label: 'Aurora hero 3' }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="hero-section hero-carousel" aria-label="Presentacion Aurora">
      <div className="hero-slides">
        {heroSlides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            className={`hero-slide ${activeSlide === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-label={slide.label}
            aria-hidden={activeSlide !== index}
          />
        ))}
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-kicker">Catalogo virtual artesanal</span>
          <h1>IMPON TU ESTILO</h1>
          <p>
            Piezas delicadas para elevar tu presencia con brillo, calma y personalidad.
          </p>
          <p>
            Descubre pulseras y aretes seleccionados para acompanar tus momentos mas especiales.
          </p>

          <button onClick={() => navigate('/catalogo')} className="hero-btn">
            Ver catalogo
          </button>
        </div>
      </div>

      <div className="hero-carousel-dots" aria-label="Slides del hero">
        {heroSlides.map((slide, index) => (
          <button
            key={`${slide.label}-dot`}
            type="button"
            className={`hero-dot ${activeSlide === index ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Ver slide ${index + 1}`}
            aria-pressed={activeSlide === index}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
