import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureCards.css';

const cardsData = [
  {
    id: 'events',
    title: 'Evenimente & Workshop-uri',
    description: 'Participă la conferințe IT, hackathoane, workshop-uri interactive și activități studențești memorabile.',
    buttonText: 'Vezi evenimentele',
    link: '/events',
    icon: (
      <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M8 14h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 18h.01"></path>
        <path d="M12 18h.01"></path>
        <path d="M16 18h.01"></path>
      </svg>
    )
  },
  {
    id: 'volunteering',
    title: 'Voluntariat',
    description: 'Fii parte din echipa ASIMBV! Dezvoltă-ți abilitățile de comunicare, organizare și leagă prietenii pe viață.',
    buttonText: 'Înscrie-te',
    link: '/volunteering',
    icon: (
      <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    )
  },
  {
    id: 'get-involved',
    title: 'Sponsorizări & Parteneriate',
    description: 'Suntem mereu deschiși la colaborări noi! Contactează-ne pentru a discuta despre oportunități de parteneriat, sponsorizări sau proiecte comune care să aducă valoare comunității IT din Brașov.',
    buttonText: 'Devino Partener',
    link: '/get-involved',
    icon: (
      <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
      </svg>
    )
  }
];

const FeatureCards = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <span className="features-badge">Oportunități & Activități</span>
          <h2 className="features-title">Descoperă Comunitatea ASIMBV</h2>
          <p className="features-subtitle">
            Alătură-te unei comunități pasionate de tehnologie, matematică și proiecte studențești de impact.
          </p>
        </div>

        <div className="features-grid">
          {cardsData.map((card) => (
            <div key={card.id} className="feature-card">
              <div className="feature-icon-wrapper">
                {card.icon}
              </div>
              <h3 className="feature-card-title">{card.title}</h3>
              <p className="feature-card-description">{card.description}</p>
              <Link to={card.link} className="feature-card-btn">
                <span>{card.buttonText}</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
