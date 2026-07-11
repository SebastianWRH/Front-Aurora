import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Producto.css';
import ProductoGallery from '../Components/Producto/ProductoGallery';
import ProductoInfo from '../Components/Producto/ProductoInfo.jsx';
import ProductoRelated from '../Components/Producto/ProductoRelated';
import { ProductoProvider } from '../context/ProductoContext';

const Producto = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <ProductoProvider>
      <div className="producto">
        <div className="producto-main">
          <ProductoGallery />
          <ProductoInfo />
        </div>
        <ProductoRelated />
      </div>
    </ProductoProvider>
  );
};

export default Producto;
