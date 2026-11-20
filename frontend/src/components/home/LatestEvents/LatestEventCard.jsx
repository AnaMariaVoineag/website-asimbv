import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useI18n } from '../../../context/I18nContext';
import { categoryLabel } from '../../../dictionaries/eventTranslations';
import { assetUrl } from '../../../utils/assetUrl';
import { FALLBACK_IMAGE } from '../../../utils/image';
import { ArrowRightIcon, CalendarIcon } from '../../icons';

const LatestEventCard = ({ event }) => {
  const { t } = useI18n();
  const image = event.images[0] ?? null;

  return (
    <Link to={ROUTES.eventDetails(event.id)} className="latest-event-card">
      <div className="latest-event-image-wrapper">
        <img
          src={image || assetUrl(FALLBACK_IMAGE)}
          alt={event.title}
          className={`latest-event-image ${image ? '' : 'is-placeholder'}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = assetUrl(FALLBACK_IMAGE);
            e.currentTarget.classList.add('is-placeholder');
          }}
        />
        <span className="latest-event-category">{categoryLabel(t, event.category)}</span>
      </div>

      <div className="latest-event-body">
        <span className="milestone-date">
          <CalendarIcon className="date-mini-icon" />
          {event.date}
        </span>
        <h3 className="latest-event-title">{event.title}</h3>
        <p className="latest-event-description">{event.description}</p>
        <span className="latest-event-more">
          {t('latest.details')}
          <ArrowRightIcon className="latest-event-arrow" />
        </span>
      </div>
    </Link>
  );
};

export default LatestEventCard;
