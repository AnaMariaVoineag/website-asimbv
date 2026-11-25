import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useI18n } from '../../../context/I18nContext';
import AnimatedTitle from '../../AnimatedTitle/AnimatedTitle';
import Reveal from '../../Reveal/Reveal';
import Tilt from '../../Tilt/Tilt';
import { ArrowRightIcon, CalendarDaysIcon, HeartIcon, RocketIcon } from '../../icons';
import './FeatureCards.css';

const CARDS = [
  { id: 'events', link: ROUTES.events, Icon: CalendarDaysIcon },
  { id: 'volunteering', link: ROUTES.contact, Icon: HeartIcon },
  { id: 'partners', link: ROUTES.contact, Icon: RocketIcon },
];

const FeatureCards = () => {
  const { t } = useI18n();

  return (
    <section className="features-section">
      <div className="features-container">
        <Reveal className="features-header">
          <span className="features-badge">{t('features.badge')}</span>
          <AnimatedTitle className="features-title" text={t('features.title')} />
          <p className="features-subtitle">{t('features.subtitle')}</p>
        </Reveal>

        <Reveal stagger className="features-grid">
          {CARDS.map(({ id, link, Icon }) => (
            <Tilt key={id} className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon className="feature-icon" />
              </div>
              <h3 className="feature-card-title">{t(`features.cards.${id}.title`)}</h3>
              <p className="feature-card-description">{t(`features.cards.${id}.description`)}</p>
              <Link to={link} className="feature-card-btn">
                <span>{t(`features.cards.${id}.button`)}</span>
                <ArrowRightIcon className="btn-arrow" />
              </Link>
            </Tilt>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default FeatureCards;
