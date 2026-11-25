import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getPartners } from '../../services/partnersService';
import { assetUrl } from '../../utils/assetUrl';
import './PartnersBar.css';

export const PARTNERS_ANCHOR = 'parteneri';

// Order of the partner types in the bar; within a type, the order set in the admin dashboard.
const TYPE_ORDER = ['educational', 'affiliation', 'association', 'company'];

const sortPartners = (partners) =>
  partners
    .map((partner, index) => ({ partner, index }))
    .sort((a, b) => TYPE_ORDER.indexOf(a.partner.type) - TYPE_ORDER.indexOf(b.partner.type) || a.index - b.index)
    .map(({ partner }) => partner);

const PartnerItem = ({ partner, label }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = partner.logoUrl && !logoFailed;

  const content = (
    <>
      <span className="partners-bar-logo">
        {showLogo ? (
          <img src={assetUrl(partner.logoUrl)} alt={partner.name} loading="lazy" onError={() => setLogoFailed(true)} />
        ) : (
          <span className="partners-bar-name">{partner.name}</span>
        )}
      </span>
      <span className="partners-bar-label">{label}</span>
    </>
  );

  return partner.websiteUrl ? (
    <a className="partners-bar-item" href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" title={partner.name}>
      {content}
    </a>
  ) : (
    <div className="partners-bar-item" title={partner.name}>{content}</div>
  );
};

// Logos of the association's partners and sponsors, shown above the footer on every page.
const PartnersBar = () => {
  const { t, lang } = useI18n();
  const { data, status } = useAsyncData('partners', (signal) => getPartners({ signal }));

  // On error or with no partners the bar simply isn't there.
  if (status === 'error' || (status === 'ready' && !data?.length)) return null;

  const labelOf = (partner) =>
    (lang === 'en' ? partner.labelEn || partner.label : partner.label) || t(`partnersBar.types.${partner.type}`);

  return (
    <section id={PARTNERS_ANCHOR} className="partners-bar" aria-label={t('partnersBar.title')} aria-busy={status === 'loading'}>
      <div className="partners-bar-inner">
        <h2 className="partners-bar-title">{t('partnersBar.title')}</h2>
        {status === 'ready' && (
          <div className="partners-bar-grid">
            {sortPartners(data).map((partner) => (
              <PartnerItem key={partner.name} partner={partner} label={labelOf(partner)} />
            ))}
          </div>
        )}
        <Link to={ROUTES.contact} className="partners-bar-cta">{t('partnersBar.cta')} →</Link>
      </div>
    </section>
  );
};

export default PartnersBar;
