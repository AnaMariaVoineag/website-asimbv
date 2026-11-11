import { Link } from 'react-router-dom';
import { assetUrl } from './assetUrl';
import { useLatestEvents, firstEventImage } from './useLatestEvents';
import { useI18n } from './i18n/I18nProvider';
import { localizeEvent, categoryLabel } from './i18n/eventTranslations';
import './LatestEvents.css';

const FALLBACK_IMAGE = '/logo_asimbv_circle.png';

const CalendarIcon = () => (
  <svg className="date-mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const LatestEventCard = ({ event }) => {
  const { t } = useI18n();
  const image = firstEventImage(event.images);

  return (
    <Link to={`/event-details/${event.id}`} className="latest-event-card">
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
          <CalendarIcon />
          {event.date}
        </span>
        <h3 className="latest-event-title">{event.title}</h3>
        <p className="latest-event-description">{event.description}</p>
        <span className="latest-event-more">
          {t('latest.details')}
          <ArrowIcon className="latest-event-arrow" />
        </span>
      </div>
    </Link>
  );
};

/**
 * Section showing the most recent events from the database, newest first, each with its front image.
 * It stays in sync with the database on its own (see useLatestEvents), so new events appear automatically.
 *
 * Every prop is optional, so <LatestEvents /> works as-is on any page.
 */
const LatestEvents = ({
  count = 3,
  badge,
  title,
  subtitle,
  showAllLink = true,
  id = 'evenimente-recente',
}) => {
  const { t, lang } = useI18n();
  const { events, status } = useLatestEvents(count);
  // Texts default to the current language; pass a string (or '' to hide one) to override.
  const badgeText = badge ?? t('latest.badge');
  const titleText = title ?? t('latest.title');
  const subtitleText = subtitle ?? t('latest.subtitle');

  return (
    <section className="past-events-section" id={id}>
      <div className="past-events-container">
        {(badgeText || titleText || subtitleText) && (
          <div className="past-events-header">
            {badgeText && <span className="past-events-badge">{badgeText}</span>}
            {titleText && <h2 className="past-events-title">{titleText}</h2>}
            {subtitleText && <p className="past-events-subtitle">{subtitleText}</p>}
          </div>
        )}

        {status === 'loading' && (
          <div className="latest-events-grid" aria-busy="true">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="latest-event-card latest-event-skeleton">
                <div className="latest-event-image-wrapper" />
                <div className="latest-event-body">
                  <div className="skeleton-line skeleton-short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="latest-events-error">
            {t('latest.error')}
          </p>
        )}

        {status === 'ready' && events.length > 0 && (
          <div className="latest-events-grid">
            {events.map((event) => (
              <LatestEventCard key={event.id} event={localizeEvent(event, lang)} />
            ))}
          </div>
        )}

        {showAllLink && (
          <div className="past-events-cta-container">
            <Link to="/events" className="past-events-btn">
              <span>{t('latest.all')}</span>
              <ArrowIcon className="btn-cta-arrow" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestEvents;
