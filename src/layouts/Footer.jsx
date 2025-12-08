import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="aurora-footer-main">
      <div className="aurora-footer-wrapper">
        
        {/* Columna 1: Marca y Descripción */}
        <div className="aurora-footer-nav-column aurora-footer-brand-section">
          <h2 className="aurora-footer-brand-logo">AURORA</h2>
          <p className="aurora-footer-brand-desc">
            Creando joyas excepcionales que capturan la esencia de la elegancia atemporal.
          </p>
          <div className="aurora-footer-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="aurora-footer-social-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="aurora-footer-social-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="aurora-footer-social-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="aurora-footer-social-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M10 16c0-4 4-4 4-8"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Enlaces</h3>
          <ul className="aurora-footer-nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/contacto">Contáctame</Link></li>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
          </ul>
        </div>

        {/* Columna 3: Colecciones */}
        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Colecciones</h3>
          <ul className="aurora-footer-nav-list">
            <li><Link to="/catalogo?category=anillos">Anillos</Link></li>
            <li><Link to="/catalogo?category=collares">Collares</Link></li>
            <li><Link to="/catalogo?category=pulseras">Pulseras</Link></li>
            <li><Link to="/catalogo?category=aretes">Aretes</Link></li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Contacto</h3>
          <ul className="aurora-footer-contact-list">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Lima, Perú</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+51 942 346 985</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>contacto@aurora.pe</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Línea divisoria */}
      <div className="aurora-footer-separator"></div>

      {/* Bottom: Copyright y Enlaces legales */}
      <div className="aurora-footer-bottom-section">
        <div className="aurora-footer-bottom-wrapper">
          <p className="aurora-footer-copyright-text">
            © {currentYear} Aurora Joyería. Todos los derechos reservados.
          </p>
          <div className="aurora-footer-legal-links">
            <Link to="/privacidad">Política de Privacidad</Link>
            <span className="aurora-footer-legal-separator">•</span>
            <Link to="/terminos">Términos y Condiciones</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;