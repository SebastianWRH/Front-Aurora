import { useState } from 'react';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "¿Cuál es el tiempo de entrega?",
      answer: "El tiempo de entrega varía según el producto. Las piezas en stock se entregan en 2-3 días hábiles. Para joyas personalizadas, el tiempo es de 7-14 días."
    },
    {
      id: 2,
      question: "¿Realizas envíos a todo el Perú?",
      answer: "Sí, realizamos envíos a todo el Perú. En Lima, el envío es gratuito para compras mayores a S/200. Para provincia, coordinamos el envío según la ubicación."
    },
    {
      id: 3,
      question: "¿Puedo ver las joyas antes de comprar?",
      answer: "¡Por supuesto! Puedes agendar una cita en mi taller en San Isidro para ver las piezas en persona y recibir asesoría personalizada."
    },
    {
      id: 4,
      question: "¿Ofrecen garantía?",
      answer: "Todas nuestras joyas incluyen certificado de autenticidad y garantía de 6 meses contra defectos de fabricación. También ofrecemos servicio de mantenimiento."
    },
    {
      id: 5,
      question: "¿Aceptan diseños personalizados?",
      answer: "Sí, nos especializamos en crear piezas únicas según tus preferencias. Contáctame para discutir tu idea y crear la joya perfecta para ti."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Preguntas Frecuentes</h2>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2"
                  className="faq-icon"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;