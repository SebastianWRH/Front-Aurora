import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import SearchOverlay from "../Components/Home/SearchOverlay";
import CartDrawer from "../Components/Cart/CartDrawer";
import "../Components/Home/SearchOverlay.css";
import "./Header.css";

function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCart, getCartCount } = useCart();

  return (
    <>
      <header className="header">
        <nav className="header-container">

          {/* NUEVO: Botón Hamburguesa */}
          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Marca */}
          <div className="marca">
            <h1>AURORA</h1>
          </div>

          {/* Menú centrado */}
          <div className={`menu ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            <Link to="/contacto" onClick={() => setMenuOpen(false)}>Contáctame</Link>
            {/* NUEVO: Link rastrear en menú móvil */}
            <Link to="/rastrear-pedido" onClick={() => setMenuOpen(false)} className="track-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Rastrear Pedido
            </Link>
          </div>

          {/* NUEVO: Overlay para cerrar menú */}
          {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

          {/* Acciones */}
          <div className="acciones">

            {/* NUEVO: Icono Rastrear Pedido (desktop) */}
            <Link to="/rastrear-pedido" className="icon-track">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" className="track-svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </Link>

            {/* Icono Search */}
            <div className="icon-search" onClick={() => setOpenSearch(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" className="search-svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 
                  5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>

            {/* Icono Carrito */}
            <div className="icon-cart" onClick={toggleCart}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" className="cart-svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 
                  0v4.5m11.356-1.993 1.263 12c.07.665-.45 
                  1.243-1.119 1.243H4.25A1.125 1.125 0 
                  0 1 3.13 20.507l1.264-12A1.125 1.125 0 
                  0 1 5.513 7.5h12.974c.576 0 
                  1.059.435 1.119 1.007Z" />
              </svg>
              {getCartCount() > 0 && (
                <div className="count-product">
                  <span id="contador-productos">{getCartCount()}</span>
                </div>
              )}
            </div>

          </div>

        </nav>
      </header>

      {/* Overlay de búsqueda */}
      <SearchOverlay open={openSearch} onClose={() => setOpenSearch(false)} />
      
      {/* Drawer del carrito */}
      <CartDrawer />
    </>
  );
}

export default Header;