import React from 'react';
import "../styles/Home.css";
import HeroSection from "../Components/Home/HeroSection";
import CategorySection from "../Components/Home/CategorySection";
import FeaturedProducts from "../Components/Home/FeaturedProducts";


const Home = () => {
  return (
    <div className="home">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </div>
  );
};

export default Home;
