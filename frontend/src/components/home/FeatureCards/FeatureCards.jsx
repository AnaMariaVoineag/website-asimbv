import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useI18n } from '../../../context/I18nContext';
import { ArrowRightIcon, CalendarDaysIcon, HeartIcon, RocketIcon } from '../../icons';
import './FeatureCards.css';

const CARDS = [
  { id: 'events', link: ROUTES.events, Icon: CalendarDaysIcon },
  { id: 'volunteering', link: ROUTES.contact, Icon: HeartIcon },
  { id: 'partners', link: ROUTES.partners, Icon: RocketIcon },
];

const FeatureCards = () => {
  const { t } = useI18n();

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <span className="features-badge">{t('features.badge')}</span>
          <h2 className="features-title">{t('features.title')}</h2>
          <p className="features-subtitle">{t('features.subtitle')}</p>
        </div>

        <div className="features-grid">
          {CARDS.map(({ id, link, Icon }) => (
            <div key={id} className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon className="feature-icon" />
              </div>
              <h3 className="feature-card-title">{t(`features.cards.${id}.title`)}</h3>
              <p className="feature-card-description">{t(`features.cards.${id}.description`)}</p>
              <Link to={link} className="feature-card-btn">
                <span>{t(`features.cards.${id}.button`)}</span>
                <ArrowRightIcon className="btn-arrow" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
