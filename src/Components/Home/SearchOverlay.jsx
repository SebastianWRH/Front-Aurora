import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';

function SearchOverlay({ open, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setFilteredProducts([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
      
      return nameMatch || categoryMatch || descriptionMatch;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    onClose();
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url
    });
  };

  if (!open) return null;

  return (
    <div className="search-overlay">
      {/* Backdrop */}
      <div className="search-backdrop" onClick={onClose}></div>

      {/* Search Container */}
      <div className="search-container">
        {/* Header */}
        <div className="search-header">
          <div className="search-input-wrapper">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5"
              className="search-icon"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            
            <input
              type="text"
              placeholder="Buscar joyas, anillos, collares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button className="search-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="search-results">
          {loading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : searchTerm.trim() === '' ? (
            <div className="search-empty">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p>Busca tus joyas favoritas</p>
              <span>Escribe el nombre del producto o categoría</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="search-no-results">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p>No se encontraron resultados</p>
              <span>Intenta con otros términos de búsqueda</span>
            </div>
          ) : (
            <div className="search-products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="search-product-card"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="search-product-image">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                      }}
                    />
                  </div>
                  
                  <div className="search-product-info">
                    <span className="search-product-category">{product.category}</span>
                    <h3 className="search-product-name">{product.name}</h3>
                    <p className="search-product-price">S/ {product.price?.toFixed(2)}</p>
                    
                    <button 
                      className="search-product-cart"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25A1.125 1.125 0 0 1 3.13 20.507l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;