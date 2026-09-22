import React from 'react';
import logoCircle from './assets/logo_asimbv_circle.png';
import './AboutSection.css';

const highlights = [
  {
    id: 1,
    title: 'Comunitate UniTBv',
    description: 'Reprezentăm și susținem studenții Facultății de Matematică și Informatică din Brașov.',
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Hackathoane & Workshop-uri',
    description: 'Organizăm evenimente tehnice de impact, inclusiv hackathonul Transilvania CodeStorm@MI.',
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Conexiune cu Industria IT',
    description: 'Facilităm puntea dintre studenți și companiile tech prin parteneriate și oportunități de carieră.',
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Dezvoltare & Voluntariat',
    description: 'Dezvoltăm abilități practice de leadership, organizare de proiecte și lucru în echipă.',
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  }
];

const AboutSection = () => {
  return (
    <section className="about-section" id="despre-noi">
      <div className="about-container">
        <div className="about-grid">
          {/* Left Column: Text & Highlights */}
          <div className="about-content">
            <span className="about-badge">Despre Noi</span>
            <h2 className="about-title">Comunitatea studenților pasionați de Informatică și Matematică</h2>
            <p className="about-paragraph">
              <strong>Asociația Studenților la Informatică și Matematică din Brașov (ASIMBV)</strong> s-a născut din dorința de a crea o comunitate unită și dinamică în cadrul <strong>Facultății de Matematică și Informatică</strong> a <strong>Universității Transilvania din Brașov</strong>.
            </p>
            <p className="about-paragraph">
              Misiunea noastră este de a transforma anii de facultate într-o experiență completă: conectăm studenții cu lideri din industria tehnologică, dezvoltăm proiecte inovatoare, sprijinim inițiativele academice și organizăm activități care fac diferența.
            </p>

            <div className="about-highlights-grid">
              {highlights.map((item) => (
                <div key={item.id} className="about-highlight-card">
                  <div className="about-highlight-icon-wrapper">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="about-highlight-title">{item.title}</h4>
                    <p className="about-highlight-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Brand Card */}
          <div className="about-visual">
            <div className="about-visual-card">
              <div className="about-visual-glow"></div>
              <img src={logoCircle} alt="Sigla ASIMBV" className="about-visual-seal" />
              <div className="about-visual-badge">
                <span className="about-visual-tag">FMI • UniTBv</span>
                <h3 className="about-visual-name">ASIM Brașov</h3>
                <p className="about-visual-quote">„Creat de studenți, pentru studenți.”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
