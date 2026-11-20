import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useI18n } from '../../../context/I18nContext';
import { localizeEvent } from '../../../dictionaries/eventTranslations';
import { useLatestEvents } from '../../../hooks/useLatestEvents';
import AnimatedTitle from '../../AnimatedTitle/AnimatedTitle';
import Reveal from '../../Reveal/Reveal';
import { ArrowRightIcon } from '../../icons';
import LatestEventCard from './LatestEventCard';
import LatestEventsSkeleton from './LatestEventsSkeleton';
import './LatestEvents.css';

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
          <Reveal className="past-events-header">
            {badgeText && <span className="past-events-badge">{badgeText}</span>}
            {titleText && <AnimatedTitle className="past-events-title" text={titleText} />}
            {subtitleText && <p className="past-events-subtitle">{subtitleText}</p>}
          </Reveal>
        )}

        {status === 'loading' && <LatestEventsSkeleton count={count} />}

        {status === 'error' && <p className="latest-events-error">{t('latest.error')}</p>}

        {status === 'ready' && events.length > 0 && (
          <Reveal stagger className="latest-events-grid">
            {events.map((event) => (
              <LatestEventCard key={event.id} event={localizeEvent(event, lang)} />
            ))}
          </Reveal>
        )}

        {showAllLink && (
          <Reveal from="zoom" className="past-events-cta-container">
            <Link to={ROUTES.events} className="past-events-btn">
              <span>{t('latest.all')}</span>
              <ArrowRightIcon className="btn-cta-arrow" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default LatestEvents;
