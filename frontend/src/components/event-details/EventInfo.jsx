import { Link } from 'react-router-dom';
import { CalendarIcon, ExternalLinkIcon } from '../icons';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { categoryLabel } from '../../dictionaries/eventTranslations';

const EventInfo = ({ event }) => {
  const { t } = useI18n();
  const category = event.category || 'Social';

  return (
    <div className="event-info-section">
      <div className="event-badges-row">
        <span className={`event-category-badge badge-${category.toLowerCase()}`}>
          {categoryLabel(t, category)}
        </span>

        <div className="event-date-chip">
          <CalendarIcon />
          <span>{event.date}</span>
        </div>
      </div>

      <h1 className="event-details-title">{event.title}</h1>

      <div className="event-description-box">
        <h3 className="section-label">{t('eventDetails.about')}</h3>
        <p className="event-description-text">{event.longDescription || event.description}</p>
      </div>

      <div className="event-details-actions">
        {event.formUrl && (
          <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="event-cta-form-btn">
            <span>{t('events.signUp')}</span>
            <ExternalLinkIcon strokeWidth={2.5} />
          </a>
        )}

        <Link to={ROUTES.events} className="event-secondary-back-btn">
          {t('eventDetails.allEvents')}
        </Link>
      </div>
    </div>
  );
};

export default EventInfo;
