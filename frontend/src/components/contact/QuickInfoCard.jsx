import { MailIcon, MapPinIcon } from '../icons';
import { CONTACT_EMAIL } from '../../constants/social';
import { useI18n } from '../../context/I18nContext';

const QuickInfoCard = () => {
  const { t } = useI18n();

  return (
    <div className="quick-info-card">
      <h3 className="info-card-title">{t('contact.infoTitle')}</h3>

      <div className="info-item">
        <div className="info-icon-box">
          <MailIcon size={20} />
        </div>
        <div className="info-content">
          <span className="info-label">{t('contact.officialEmail')}</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="info-value link">{CONTACT_EMAIL}</a>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon-box">
          <MapPinIcon size={20} />
        </div>
        <div className="info-content">
          <span className="info-label">{t('contact.addressLabel')}</span>
          <span className="info-value">
            {t('contact.address')}
            <br />
            {t('contact.addressFaculty')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoCard;
