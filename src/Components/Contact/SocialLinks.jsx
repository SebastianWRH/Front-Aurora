function SocialLinks() {
  const socialNetworks = [
    {
      id: 1,
      name: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      link: "https://instagram.com/aurora.joyas",
      color: "#E4405F"
    },
    {
      id: 2,
      name: "Facebook",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      link: "https://facebook.com/aurora.joyas",
      color: "#1877F2"
    },
    {
      id: 3,
      name: "TikTok",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
        </svg>
      ),
      link: "https://tiktok.com/@aurora.joyas",
      color: "#000000"
    },
    {
      id: 4,
      name: "Pinterest",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8.5 14.5c.5 2.5 2 4.5 4.5 4.5 4 0 6-3 6-7 0-3.5-2.5-6-6-6-4 0-7 2.5-7 6 0 2 1 3.5 2.5 4"></path>
        </svg>
      ),
      link: "https://pinterest.com/aurora.joyas",
      color: "#E60023"
    }
  ];

  return (
    <section className="social-section">
      <div className="social-container">
        <h2 className="social-title">Sígueme en Redes</h2>
        <p className="social-description">
          Descubre mis últimas creaciones y mantente al tanto de nuevas colecciones
        </p>
        
        <div className="social-grid">
          {socialNetworks.map(social => (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{ '--hover-color': social.color }}
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