import { useSettings } from '../../hooks/useSettings';
import { createWhatsAppLink, formatWhatsAppDisplay } from '../../lib/whatsapp';

function ContactMethods() {
  const { settings } = useSettings();
  const displayWhatsAppNumber = formatWhatsAppDisplay(settings.whatsapp_number);
  const instagramHandle = settings.instagram_url
    ? `@${settings.instagram_url.replace(/\/$/, '').split('/').pop()}`
    : 'Instagram';

  const contactOptions = [
    {
      id: 1,
      title: 'WhatsApp',
      description: 'Respuesta directa para disponibilidad, colores y reservas.',
      value: displayWhatsAppNumber,
      action: 'Escribir ahora',
      link: createWhatsAppLink('Hola, quiero consultar por el catalogo de Aurora.', settings.whatsapp_number)
    },
    {
      id: 2,
      title: 'Instagram',
      description: 'Novedades, combinaciones y piezas destacadas de temporada.',
      value: instagramHandle,
      action: 'Ver Instagram',
      link: settings.instagram_url
    },
    {
      id: 3,
      title: 'Catalogo',
      description: 'Explora pulseras y aretes antes de enviarnos tu seleccion.',
      value: 'Lima - Peru',
      action: 'Ver catalogo',
      link: '/catalogo'
    }
  ];

  return (
    <section className="contact-methods">
      <div className="contact-methods-container">
        <span className="contact-section-kicker">Canales de atencion</span>
        <h2 className="contact-methods-title">Formas de consulta</h2>

        <div className="contact-methods-grid">
          {contactOptions.map(option => (
            <div key={option.id} className="contact-card">
              <div className="contact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6m-8.25 8.25 2.25-2.25h9A2.25 2.25 0 0 0 18.75 15V6.75A2.25 2.25 0 0 0 16.5 4.5h-9A2.25 2.25 0 0 0 5.25 6.75V15a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>

              <h3 className="contact-card-title">{option.title}</h3>
              <p className="contact-card-description">{option.description}</p>
              <span className="contact-card-value">{option.value}</span>

              <a
                href={option.link}
                target={option.link.startsWith('http') ? '_blank' : undefined}
                rel={option.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-card-button"
              >
                {option.action}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactMethods;
