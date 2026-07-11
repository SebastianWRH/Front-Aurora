import { useSettings } from '../../hooks/useSettings';
import { createWhatsAppLink } from '../../lib/whatsapp';

function SocialLinks() {
  const { settings } = useSettings();

  const socialNetworks = [
    {
      id: 1,
      name: 'Instagram',
      link: settings.instagram_url,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M17.5 6.5h.01"></path>
        </svg>
      )
    },
    {
      id: 2,
      name: 'WhatsApp',
      link: createWhatsAppLink('Hola, quiero conocer mas sobre Aurora.', settings.whatsapp_number),
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.3l1.1-4a8.4 8.4 0 1 1 15.4-4.5Z"></path>
          <path d="M9.1 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.4.5c-.1.1-.2.3-.1.5.4.8 1.1 1.5 2 1.9.2.1.4.1.5-.1l.6-.7c.1-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .7-.5 1.4-1.1 1.6-.6.2-1.8.1-3.2-.7-1.7-1-3-2.3-3.8-4.1-.6-1.3-.5-2.1-.2-2.7Z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="social-section">
      <div className="social-container">
        <span className="contact-section-kicker">Inspiracion diaria</span>
        <h2 className="social-title">Conecta con Aurora</h2>
        <p className="social-description">
          Mira nuevas piezas, ideas para combinar y anuncios de disponibilidad.
        </p>

        <div className="social-grid">
          {socialNetworks.map(social => (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <div className="social-icon">
                {social.icon}
              </div>
              <span className="social-name">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialLinks;
