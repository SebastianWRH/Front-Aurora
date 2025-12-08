function ContactMethods() {
  const contactOptions = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      ),
      title: "WhatsApp",
      description: "Escríbeme directamente",
      value: "+51 987 654 321",
      action: "Enviar Mensaje",
      link: "https://wa.me/51987654321"
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      title: "Email",
      description: "Envíame un correo",
      value: "aurora@joyas.com",
      action: "Abrir Email",
      link: "mailto:aurora@joyas.com"
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
      title: "Ubicación",
      description: "Visítame en mi taller",
      value: "San Isidro, Lima - Perú",
      action: "Ver Mapa",
      link: "https://maps.google.com"
    }
  ];

  return (
    <section className="contact-methods">
      <div className="contact-methods-container">
        <h2 className="contact-methods-title">Formas de Contacto</h2>
        
        <div className="contact-methods-grid">
          {contactOptions.map(option => (
            <div key={option.id} className="contact-card">
              <div className="contact-card-icon">
                {option.icon}
              </div>
              
              <h3 className="contact-card-title">{option.title}</h3>
              <p className="contact-card-description">{option.description}</p>
              <span className="contact-card-value">{option.value}</span>
              
              <a 
                href={option.link} 
                target="_blank" 
                rel="noopener noreferrer"
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