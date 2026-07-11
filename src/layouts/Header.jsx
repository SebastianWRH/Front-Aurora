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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header">
        <nav className="header-container">
          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/" className="marca" onClick={closeMenu}>
            <h1>AURORA</h1>
            <span>Catalogo virtual</span>
          </Link>

          <div className={`menu ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={closeMenu}>Inicio</Link>
            <Link to="/catalogo" onClick={closeMenu}>Catalogo</Link>
            <Link to="/contacto" onClick={closeMenu}>Contacto</Link>
          </div>

          {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

          <div className="acciones">
            <button className="icon-search" onClick={() => setOpenSearch(true)} aria-label="Buscar productos">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" className="search-svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            <button className="icon-cart" onClick={toggleCart} aria-label="Abrir mi seleccion">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" className="cart-svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 7.5h6m-7.5 4.5h9m-10.5 4.5h12M5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5Z" />
              </svg>
              {getCartCount() > 0 && (
                <div className="count-product">
                  <span id="contador-productos">{getCartCount()}</span>
                </div>
              )}
            </button>
          </div>
        </nav>
      </header>

      <SearchOverlay open={openSearch} onClose={() => setOpenSearch(false)} />
      <CartDrawer />
    </>
  );
}

export default Header;
