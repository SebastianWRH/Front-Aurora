import ContactHero from '../Components/Contact/ContactHero';
import ContactMethods from '../Components/Contact/ContacMethods';
import SocialLinks from '../Components/Contact/SocialLinks';
import FAQSection from '../Components/Contact/FAQSection';
import '../styles/Contact.css';

function Contacto() {
  return (
    <div className="contact-page">
      <ContactHero />
      <ContactMethods />
      <SocialLinks />
      <FAQSection />
    </div>
  );
}

export default Contacto;