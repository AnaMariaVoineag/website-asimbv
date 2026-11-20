import { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { assetUrl } from '../../utils/assetUrl';
import { FALLBACK_IMAGE, handleImageError } from '../../utils/image';

const EventGallery = ({ event }) => {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const images = event.images ?? [];
  const hasMultiple = images.length > 1;

  const showPrevious = () => setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  const showNext = () => setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));

  return (
    <div className="event-gallery-section">
      {images.length > 0 ? (
        <div className="event-main-image-wrapper">
          <img
            src={images[activeIndex] || images[0]}
            alt={t('eventDetails.imageAlt', { title: event.title, number: activeIndex + 1 })}
            className="event-main-image"
            onError={handleImageError}
          />

          {hasMultiple && (
            <>
              <button className="gallery-nav-btn prev" onClick={showPrevious} aria-label={t('eventDetails.prevImage')}>
                ‹
              </button>
              <button className="gallery-nav-btn next" onClick={showNext} aria-label={t('eventDetails.nextImage')}>
                ›
              </button>
              <span className="gallery-counter-badge">
                {activeIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="event-no-image-placeholder">
          <img
            src={assetUrl(FALLBACK_IMAGE)}
            alt={t('eventDetails.placeholderAlt')}
            className="event-placeholder-logo"
          />
          <span className="event-placeholder-label">{t('eventDetails.placeholderLabel')}</span>
        </div>
      )}

      {hasMultiple && (
        <div className="event-thumbnails-grid">
          {images.map((url, index) => (
            <button
              key={index}
              type="button"
              className={`event-thumbnail-btn ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={t('eventDetails.selectImage', { number: index + 1 })}
            >
              <img
                src={url}
                alt={t('eventDetails.thumbnailAlt', { number: index + 1 })}
                className="event-thumbnail-img"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGallery;
