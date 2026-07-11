import { useState } from 'react';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'Como consulto disponibilidad?',
      answer: 'Agrega tus piezas favoritas a la lista o escribenos directamente. Te confirmaremos colores, stock y detalles antes de coordinar la entrega.'
    },
    {
      id: 2,
      question: 'Realizan entregas en Lima?',
      answer: 'Si, coordinamos entregas dentro de Lima Metropolitana. El punto, horario y costo se confirman por mensaje segun tu ubicacion.'
    },
    {
      id: 3,
      question: 'Puedo separar una pieza?',
      answer: 'Podemos ayudarte a reservar una pieza por un periodo corto mientras coordinas tu compra. La disponibilidad se confirma al momento de escribirnos.'
    },
    {
      id: 4,
      question: 'Los colores pueden variar?',
      answer: 'Las fotos buscan representar cada pieza con fidelidad, aunque algunos tonos pueden variar levemente por luz o pantalla.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <span className="contact-section-kicker">Detalles utiles</span>
        <h2 className="faq-title">Preguntas frecuentes</h2>

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
