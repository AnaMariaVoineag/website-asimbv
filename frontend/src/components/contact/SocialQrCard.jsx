import { useState } from 'react';
import { ExternalLinkIcon, QrCodeIcon } from '../icons';
import { SOCIAL_LINKS } from '../../constants/social';
import { useI18n } from '../../context/I18nContext';

const QR_COLOR = '003977';

const qrImageUrl = (value) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}&margin=10&color=${QR_COLOR}`;

const SocialQrCard = () => {
  const { t } = useI18n();
  const [selected, setSelected] = useState(SOCIAL_LINKS[0]);

  return (
    <div className="qr-access-card">
      <div className="qr-header">
        <div className="qr-header-icon">
          <QrCodeIcon size={22} />
        </div>
        <div>
          <h3 className="qr-title">{t('contact.qrTitle')}</h3>
          <p className="qr-subtitle">{t('contact.qrSubtitle')}</p>
        </div>
      </div>

      <div className="social-tabs-container">
        {SOCIAL_LINKS.map((social) => {
          const isActive = selected.id === social.id;
          return (
            <button
              key={social.id}
              className={`social-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelected(social)}
            >
              <span className="social-tab-icon" style={{ color: isActive ? '#ffffff' : social.color }}>
                <social.Icon size={22} />
              </span>
              <span>{social.name}</span>
            </button>
          );
        })}
      </div>

      <div className="qr-display-box">
        <div className="qr-image-wrapper">
          <img
            src={qrImageUrl(selected.url)}
            alt={t('contact.qrAlt', { name: selected.name })}
            className="qr-code-img"
            loading="lazy"
          />
        </div>
        <div className="qr-details">
          <div className="qr-social-badge" style={{ backgroundColor: selected.color }}>
            {selected.name}
          </div>
          <h4 className="qr-handle">{selected.handle}</h4>
          <a href={selected.url} target="_blank" rel="noopener noreferrer" className="qr-direct-link">
            <span>{t('contact.openPage')}</span>
            <ExternalLinkIcon size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialQrCard;
