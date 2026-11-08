// src/EventDetails.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assetUrl } from './assetUrl';
import PartnerTile from './PartnerTile';
import { useI18n } from './i18n/I18nProvider';
import { localizeEvent, translateRole } from './i18n/eventTranslations';
import './palette.css';
import './EventDetails.css';

const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed.map(assetUrl) : [];
  } catch {
    return [];
  }
};

// Keeps the API order: roles appear in the order of their first partner.
const groupByRole = (partners) => {
  const groups = new Map();
  partners.forEach((partner) => {
    if (!groups.has(partner.role)) groups.set(partner.role, []);
    groups.get(partner.role).push(partner);
  });
  return [...groups.entries()];
};

const EventDetails = () => {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const [rawEvent, setEvent] = useState(null);
  const event = useMemo(() => localizeEvent(rawEvent, lang), [rawEvent, lang]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [partnerData, setPartnerData] = useState({ eventId: null, partners: [] });
  // Partners loaded for a previous event are ignored until this event's have arrived.
  const partners = partnerData.eventId === id ? partnerData.partners : [];

  // Separate from the event request: if this fails the page still works, just without the strip.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/events/${id}/partners`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setPartnerData({ eventId: id, partners: Array.isArray(data) ? data : [] }))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('[EventDetails] partners fetch error:', err);
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${id}`);
        if (response.status === 404) {
          setError('not-found');
          return;
        }
        if (!response.ok) throw new Error(`Eroare server: ${response.status}`);
        const data = await response.json();
        setEvent({
          ...data,
          images: parseImages(data.images),
        });
        setActiveImageIndex(0);
      } catch (err) {
        setError('error');
        console.error('[EventDetails] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-details-loading">
          <div className="loading-spinner"></div>
          <p>{t('eventDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found' || !event) {
    return (
      <div className="event-details-page">
        <div className="event-details-card event-message-card">
          <h2>{t('eventDetails.notFoundTitle')}</h2>
          <p>{t('eventDetails.notFoundText')}</p>
          <Link to="/events" className="event-back-btn">
            {t('eventDetails.backToAll')}
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="event-details-page">
        <div className="event-details-card event-message-card">
          <h2>{t('eventDetails.errorTitle')}</h2>
          <p>{t('eventDetails.errorText')}</p>
          <Link to="/events" className="event-back-btn">
            {t('eventDetails.backToAll')}
          </Link>
        </div>
      </div>
    );
  }

  const images = event.images || [];
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[activeImageIndex] || images[0] : null;

  const category = event.category || 'Social';
  const categoryClass = `badge-${category.toLowerCase()}`;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="event-details-page">
      <div className="event-details-nav">
        <Link to="/events" className="event-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{t('eventDetails.backLink')}</span>
        </Link>
      </div>

      <article className="event-details-card">
        {/* Left Column: Visual Gallery / Showcase */}
        <div className="event-gallery-section">
          {hasImages ? (
            <div className="event-main-image-wrapper">
              <img
                src={currentImage}
                alt={t('eventDetails.imageAlt', { title: event.title, number: activeImageIndex + 1 })}
                className="event-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assetUrl('/logo_asimbv_circle.png');
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="gallery-nav-btn prev"
                    onClick={handlePrevImage}
                    aria-label={t('eventDetails.prevImage')}
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-nav-btn next"
                    onClick={handleNextImage}
                    aria-label={t('eventDetails.nextImage')}
                  >
                    ›
                  </button>
                  <span className="gallery-counter-badge">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="event-no-image-placeholder">
              <img
                src={assetUrl('/logo_asimbv_circle.png')}
                alt={t('eventDetails.placeholderAlt')}
                className="event-placeholder-logo"
              />
              <span className="event-placeholder-label">{t('eventDetails.placeholderLabel')}</span>
            </div>
          )}

          {/* Thumbnails row if multiple images exist */}
          {images.length > 1 && (
            <div className="event-thumbnails-grid">
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`event-thumbnail-btn ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={t('eventDetails.selectImage', { number: index + 1 })}
                >
                  <img
                    src={imgUrl}
                    alt={t('eventDetails.thumbnailAlt', { number: index + 1 })}
                    className="event-thumbnail-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assetUrl('/logo_asimbv_circle.png');
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Event Information */}
        <div className="event-info-section">
          <div className="event-badges-row">
            <span className={`event-category-badge ${categoryClass}`}>
              {category}
            </span>

            <div className="event-date-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
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
              <a
                href={event.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-cta-form-btn"
              >
                <span>{t('events.signUp')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}

            <Link to="/events" className="event-secondary-back-btn">
              {t('eventDetails.allEvents')}
            </Link>
          </div>
        </div>
      </article>

      {partners.length > 0 && (
        <section className="event-partners-card">
          {groupByRole(partners).map(([role, members]) => (
            <div key={role}>
              <h2 className="section-label event-partners-label">{translateRole(role, lang)}</h2>
              <div className="partner-tiles-row">
                {members.map((partner) => (
                  <PartnerTile key={partner.name} partner={partner} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default EventDetails;