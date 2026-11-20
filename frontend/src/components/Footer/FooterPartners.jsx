import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import PartnerTile from '../PartnerTile/PartnerTile';

const FooterPartners = ({ partners }) => {
  const { t } = useI18n();

  if (partners.length === 0) return null;

  return (
    <div className="footer-partners">
      <Link to={ROUTES.partners} className="footer-partners-title">{t('footer.ourPartners')}</Link>
      <div className="partner-tiles-row">
        {partners.map((partner) => (
          <PartnerTile key={partner.name} partner={partner} />
        ))}
      </div>
    </div>
  );
};

export default FooterPartners;
