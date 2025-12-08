import { useState } from 'react';

function OrderSearch({ onSearch }) {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    setLoading(true);
    await onSearch(orderCode.trim());
    setLoading(false);
  };

  return (
    <div className="os-search-container">
      <div className="os-search-hero">
        <div className="os-search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
          </svg>
        </div>
        <h1 className="os-search-title">Rastrea tu Pedido</h1>
        <p className="os-search-subtitle">
          Ingresa el código de tu orden para ver el estado de tu pedido
        </p>
      </div>

      <form onSubmit={handleSubmit} className="os-search-form">
        <div className="os-input-group">
          <input
            type="text"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
            placeholder="Ej: ABC123XYZ"
            className="os-input"
            maxLength="20"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="os-search-btn"
            disabled={loading || !orderCode.trim()}
          >
            {loading ? (
              <>
                <div className="os-spinner"></div>
                Buscando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Buscar Orden
              </>
            )}
          </button>
        </div>
      </form>

      <div className="os-search-info">
        <div className="os-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Encuentra tu código en el email de confirmación</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSearch;