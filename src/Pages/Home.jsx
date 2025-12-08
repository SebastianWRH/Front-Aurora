import React from 'react';
import "../styles/Home.css";
import HeroSection from "../Components/Home/HeroSection";
import CategorySection from "../Components/Home/CategorySection";


const Home = () => {
  return (
    <div className="home">
      <HeroSection />
      <CategorySection />
    </div>
  );
};

export default Home;