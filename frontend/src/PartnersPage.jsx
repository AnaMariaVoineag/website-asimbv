// src/PartnersPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PartnerTile from './PartnerTile';
import { useI18n } from './i18n/I18nProvider';
import './palette.css';
import './PartnersPage.css';

// Sections appear in this order, and only when they have at least one partner.
const SECTIONS = ['educational', 'affiliation', 'association', 'company'];

const PartnersPage = () => {
  const { t } = useI18n();
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
        <h1 className="partners-title">{t('partners.title')}</h1>
        <p className="partners-subtitle">
          {t('partners.subtitle')}
        </p>
      </header>

      {status === 'loading' && <p className="partners-message">{t('partners.loading')}</p>}
      {status === 'error' && (
        <p className="partners-message">{t('partners.error')}</p>
      )}

      {SECTIONS.map((type) => {
        const members = partners.filter((partner) => partner.type === type);
        if (members.length === 0) return null;
        return (
          <section key={type} className="partners-section">
            <h2 className="partners-section-title">{t(`partners.sections.${type}`)}</h2>
            <div className="partner-tiles-row">
              {members.map((partner) => (
                <PartnerTile key={partner.name} partner={partner} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="partners-cta">
        <h2 className="partners-cta-title">{t('partners.ctaTitle')}</h2>
        <p className="partners-cta-text">
          {t('partners.ctaText')}
        </p>
        <Link to="/contact" className="partners-cta-btn">{t('partners.ctaButton')}</Link>
      </section>
    </div>
  );
};

export default PartnersPage;
