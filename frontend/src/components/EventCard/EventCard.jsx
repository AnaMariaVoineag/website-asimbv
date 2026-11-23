import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { categoryLabel } from '../../dictionaries/eventTranslations';
import { useImageCarousel } from '../../hooks/useImageCarousel';
import { handleImageError } from '../../utils/image';
import { CalendarIcon } from '../icons';
import './EventCard.css';

const MAX_IMAGES = 3;

const EventCard = ({ event }) => {
  const { t } = useI18n();
  const images = (event.images ?? []).slice(0, MAX_IMAGES);
  const hasImages = images.length > 0;
  const [currentIndex, setCurrentIndex] = useImageCarousel(images.length);

  const category = event.category || 'Social';

  return (
    <div className={`event-card ${hasImages ? '' : 'no-image-card'}`}>
      {hasImages && (
        <div className="event-image-section">
          <img
            src={images[currentIndex]}
            alt={event.title}
            className="event-image"
            loading="lazy"
            onError={handleImageError}
          />

          <div className="event-badge-overlay">
            <span className={`event-category-badge badge-${category.toLowerCase()}`}>
              {categoryLabel(t, category)}
            </span>
          </div>

          {images.length > 1 && (
            <div className="event-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={t('events.goToImage', { number: index + 1 })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="event-text-section">
        <div className="event-meta-header">
          <div className="event-date">
            <CalendarIcon className="event-date-icon" />
            <span>{event.date}</span>
          </div>
        </div>

        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>

        <div className="event-action-wrapper">
          {event.formUrl && (
            <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="event-form-link-btn">
              <span>{t('events.signUp')}</span>
            </a>
          )}

          <Link to={ROUTES.eventDetails(event.id)} className="event-details-link-btn">
            <span>{t('events.seeDetails')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
