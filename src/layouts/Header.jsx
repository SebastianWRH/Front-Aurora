import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import SearchOverlay from "../Components/Home/SearchOverlay";
import CartDrawer from "../Components/Cart/CartDrawer";
import "../Components/Home/SearchOverlay.css";
import "./Header.css";

function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const { toggleCart, getCartCount } = useCart();

  return (
    <>
      <header className="header">
        <nav className="header-container">

          {/* Marca */}
          <div className="marca">
            <h1>AURORA</h1>
          </div>

          {/* Menú centrado */}
          <div className="menu">
            <Link to="/">Inicio</Link>
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/contacto">Contáctame</Link>
          </div>

          {/* Acciones */}
          <div className="acciones">

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