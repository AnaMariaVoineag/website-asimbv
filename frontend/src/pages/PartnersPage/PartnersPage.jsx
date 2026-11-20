import { Link } from 'react-router-dom';
import PartnerTile from '../../components/PartnerTile/PartnerTile';
import PartnersSkeleton from '../../components/partners/PartnersSkeleton';
import Reveal from '../../components/Reveal/Reveal';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getPartners } from '../../services/partnersService';
import './PartnersPage.css';

// Sections appear in this order, and only when they have at least one partner.
const SECTIONS = ['educational', 'affiliation', 'association', 'company'];

const PartnersPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('partners.pageTitle'));
  const { data, status } = useAsyncData('partners', (signal) => getPartners({ signal }));
  const partners = data ?? [];

  return (
    <div className="partners-page">
      <header className="partners-header">
        <h1 className="partners-title">{t('partners.title')}</h1>
        <p className="partners-subtitle">{t('partners.subtitle')}</p>
      </header>

      {status === 'loading' && <PartnersSkeleton />}
      {status === 'error' && <p className="partners-message">{t('partners.error')}</p>}

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

      {/* Held back while loading: it would otherwise sit under the empty page and be pushed down by the partners. */}
      {status !== 'loading' && (
        <Reveal as="section" once className="partners-cta">
          <h2 className="partners-cta-title">{t('partners.ctaTitle')}</h2>
          <p className="partners-cta-text">{t('partners.ctaText')}</p>
          <Link to={ROUTES.contact} className="partners-cta-btn">{t('partners.ctaButton')}</Link>
        </Reveal>
      )}
    </div>
  );
};

export default PartnersPage;
