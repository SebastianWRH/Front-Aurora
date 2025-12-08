import React from 'react';
import '../styles/Producto.css';
import ProductoGallery from '../Components/Producto/ProductoGallery';
import ProductoInfo from '../Components/Producto/ProductoInfo.jsx';
import ProductoRelated from '../Components/Producto/ProductoRelated';
import { ProductoProvider } from '../context/ProductoContext';

const Producto = () => {
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