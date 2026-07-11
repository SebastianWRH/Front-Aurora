import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { createWhatsAppLink, formatWhatsAppDisplay } from "../lib/whatsapp";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const displayWhatsAppNumber = formatWhatsAppDisplay(settings.whatsapp_number);
  const storeName = settings.store_name || 'Aurora Catalogo';

  return (
    <footer className="aurora-footer-main">
      <div className="aurora-footer-wrapper">
        <div className="aurora-footer-nav-column aurora-footer-brand-section">
          <h2 className="aurora-footer-brand-logo">AURORA</h2>
          <p className="aurora-footer-brand-desc">
            Catalogo virtual de piezas delicadas. Elige tus favoritos y coordina la compra por WhatsApp.
          </p>
          <div className="aurora-footer-social-links">
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="aurora-footer-social-item"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M17.5 6.5h.01"></path>
              </svg>
            </a>
            <a
              href={createWhatsAppLink('Hola, quiero consultar por el catalogo de Aurora.', settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="aurora-footer-social-item"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.3l1.1-4a8.4 8.4 0 1 1 15.4-4.5Z"></path>
                <path d="M9.1 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.4.5c-.1.1-.2.3-.1.5.4.8 1.1 1.5 2 1.9.2.1.4.1.5-.1l.6-.7c.1-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .7-.5 1.4-1.1 1.6-.6.2-1.8.1-3.2-.7-1.7-1-3-2.3-3.8-4.1-.6-1.3-.5-2.1-.2-2.7Z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Enlaces</h3>
          <ul className="aurora-footer-nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catalogo</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Colecciones</h3>
          <ul className="aurora-footer-nav-list">
            <li><Link to="/catalogo?category=pulseras">Pulseras</Link></li>
            <li><Link to="/catalogo?category=aretes">Aretes</Link></li>
            <li><Link to="/catalogo?category=collares">Collares</Link></li>
          </ul>
        </div>

        <div className="aurora-footer-nav-column">
          <h3 className="aurora-footer-nav-title">Consulta</h3>
          <ul className="aurora-footer-contact-list">
            <li><span>Compra coordinada por WhatsApp</span></li>
            <li><span>{displayWhatsAppNumber}</span></li>
            <li><span>Consulta disponibilidad antes de comprar</span></li>
          </ul>
        </div>
      </div>

      <div className="aurora-footer-separator"></div>

      <div className="aurora-footer-bottom-section">
        <div className="aurora-footer-bottom-wrapper">
          <p className="aurora-footer-copyright-text">
            &copy; {currentYear} {storeName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
