import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/icons';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useEvent, useEventPartners } from '../../hooks/useEvent';
import EventGallery from '../../components/event-details/EventGallery';
import EventInfo from '../../components/event-details/EventInfo';
import EventMessageCard from '../../components/event-details/EventMessageCard';
import EventPartners from '../../components/event-details/EventPartners';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { t } = useI18n();
  const { event, status } = useEvent(id);
  const partners = useEventPartners(id);
  // The event name once it has loaded, so tabs and history entries are easy to tell apart.
  useDocumentTitle(event ? `ASIMBV | ${event.title}` : t('eventDetails.pageTitle'));

  if (status === 'loading') {
    return (
      <div className="event-details-page">
        <div className="event-details-loading">
          <div className="loading-spinner"></div>
          <p>{t('eventDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="event-details-page">
        <EventMessageCard titleKey="eventDetails.notFoundTitle" textKey="eventDetails.notFoundText" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="event-details-page">
        <EventMessageCard titleKey="eventDetails.errorTitle" textKey="eventDetails.errorText" />
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-nav">
        <Link to={ROUTES.events} className="event-back-link">
          <ArrowLeftIcon strokeWidth={2.5} />
          <span>{t('eventDetails.backLink')}</span>
        </Link>
      </div>

      <article className="event-details-card">
        <EventGallery key={event.id} event={event} />
        <EventInfo event={event} />
      </article>

      <EventPartners partners={partners} />
    </div>
  );
};

export default EventDetails;
