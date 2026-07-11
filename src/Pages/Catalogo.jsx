import React from 'react';
import '../styles/Catalogo.css';
import { CatalogoProvider } from '../context/CatalogoContext';
import CatalogoHeader from '../Components/Catalogo/CatalogoHeader';
import CatalogoControls from '../Components/Catalogo/CatalogoControls';
import CatalogoGrid from '../Components/Catalogo/CatalogoGrid';

const Catalogo = () => {
  return (
    <CatalogoProvider>
      <div className="catalogo">
        <CatalogoHeader />
        <CatalogoControls />
        <CatalogoGrid />
      </div>
    </CatalogoProvider>
  );
};

export default Catalogo;
