import React from 'react';
import { Link } from 'react-router-dom';
import './PastEventsSection.css';

const milestonesData = [
  {
    id: 'infiintare',
    badge: 'Fondare',
    date: '6 Octombrie 2024',
    title: 'Înființarea ASIMBV',
    description: 'Punctul de pornire al asociației: un grup de studenți motivați de la Facultatea de Matematică și Informatică Brașov au unit forțele pentru a crea vocea oficială a studenților din cadrul facultății.',
    icon: (
      <svg className="milestone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
      </svg>
    )
  },
  {
    id: 'student-login',
    badge: 'Orientare Boboci',
    date: '1 Octombrie 2025',
    title: 'Student LogIn',
    description: 'Evenimentul emblematic dedicat noilor studenți din anul 1, menit să le ofere ghidare în cadrul mediului universitar, networking și un start excelent în viața de facultate.',
    icon: (
      <svg className="milestone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    )
  },
  {
    id: 'afiliere-uni',
    badge: 'Parteneriat Oficial',
    date: '28 Noiembrie 2025',
    title: 'Afilierea cu UNI (Uniunea Studenților Români)',
    description: 'Recunoașterea și afilierea oficială în cadrul regiunii Centru Nord a Uniunii Studenților Români.',
    icon: (
      <svg className="milestone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    )
  },
  {
    id: 'hackathon',
    badge: 'Competiție & Inovație',
    date: '24-25 Aprilie 2025',
    title: 'Hackathon Transilvania CodeStorm@MI',
    description: 'Competiție tehnică unde zeci de studenți au dezvoltat soluții software inovatoare în echipă.',
    icon: (
      <svg className="milestone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  }
];

const PastEventsSection = () => {
  return (
    <section className="past-events-section" id="evenimente-trecute">
      <div className="past-events-container">
        <div className="past-events-header">
          <span className="past-events-badge">Istoric & Evenimente</span>
          <h2 className="past-events-title">Momente cheie din parcursul nostru</h2>
          <p className="past-events-subtitle">
            O privire de ansamblu asupra principalelor inițiative și evenimente care au marcat evoluția comunității ASIMBV.
          </p>
        </div>

        <div className="milestones-grid">
          {milestonesData.map((item, index) => (
            <div key={item.id} className="milestone-card">
              <div className="milestone-card-top">
                <div className="milestone-icon-wrapper">
                  {item.icon}
                </div>
                <span className="milestone-step-number">0{index + 1}</span>
              </div>
              <div className="milestone-meta">
                <span className="milestone-tag">{item.badge}</span>
                <span className="milestone-date">
                  <svg className="date-mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {item.date}
                </span>
              </div>
              <h3 className="milestone-title">{item.title}</h3>
              <p className="milestone-description">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="past-events-cta-container">
          <Link to="/events" className="past-events-btn">
            <span>Află toată istoria</span>
            <svg className="btn-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PastEventsSection;
