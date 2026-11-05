// src/PartnersPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PartnerTile from './PartnerTile';
import './palette.css';
import './PartnersPage.css';

// Sections appear in this order, and only when they have at least one partner.
const SECTIONS = [
  { type: 'educational', title: 'Parteneri educaționali' },
  { type: 'affiliation', title: 'Afiliați la' },
  { type: 'association', title: 'Asociații cu care am colaborat' },
  { type: 'company', title: 'Parteneri și sponsori' },
];

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/partners', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Eroare server: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setPartners(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('[PartnersPage] fetch error:', err);
        setStatus('error');
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="partners-page">
      <header className="partners-header">
        <h1 className="partners-title">Partenerii noștri</h1>
        <p className="partners-subtitle">
          Organizațiile alături de care construim o comunitate mai puternică pentru studenți.
        </p>
      </header>

      {status === 'loading' && <p className="partners-message">Se încarcă partenerii...</p>}
      {status === 'error' && (
        <p className="partners-message">Nu s-au putut prelua partenerii. Reîncearcă mai târziu.</p>
      )}

      {SECTIONS.map(({ type, title }) => {
        const members = partners.filter((partner) => partner.type === type);
        if (members.length === 0) return null;
        return (
          <section key={type} className="partners-section">
            <h2 className="partners-section-title">{title}</h2>
            <div className="partner-tiles-row">
              {members.map((partner) => (
                <PartnerTile key={partner.name} partner={partner} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="partners-cta">
        <h2 className="partners-cta-title">Vrei să devii partener ASIMBv?</h2>
        <p className="partners-cta-text">
          Suntem deschiși la colaborări, sponsorizări și proiecte comune pentru studenții din Brașov.
        </p>
        <Link to="/contact" className="partners-cta-btn">Contactează-ne</Link>
      </section>
    </div>
  );
};

export default PartnersPage;
