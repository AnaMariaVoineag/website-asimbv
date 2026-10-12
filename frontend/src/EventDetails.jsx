// src/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './palette.css';
import './EventDetails.css';

const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
          <p>Se încarcă detaliile evenimentului...</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found' || !event) {
    return (
      <div className="event-details-page">
        <div className="event-details-card event-message-card">
          <h2>Evenimentul nu a fost găsit</h2>
          <p>Evenimentul pe care îl cauți nu există sau a fost eliminat.</p>
          <Link to="/events" className="event-back-btn">
            ← Înapoi la toate evenimentele
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="event-details-page">
        <div className="event-details-card event-message-card">
          <h2>A apărut o eroare</h2>
          <p>Nu s-au putut prelua datele despre eveniment. Verifică conexiunea sau reîncearcă.</p>
          <Link to="/events" className="event-back-btn">
            ← Înapoi la toate evenimentele
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
          <span>Înapoi la toate evenimentele</span>
        </Link>
      </div>

      <article className="event-details-card">
        {/* Left Column: Visual Gallery / Showcase */}
        <div className="event-gallery-section">
          {hasImages ? (
            <div className="event-main-image-wrapper">
              <img
                src={currentImage}
                alt={`${event.title} - imagine ${activeImageIndex + 1}`}
                className="event-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo_asimbv_circle.png';
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="gallery-nav-btn prev"
                    onClick={handlePrevImage}
                    aria-label="Imagine anterioară"
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-nav-btn next"
                    onClick={handleNextImage}
                    aria-label="Imagine următoare"
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
                src="/logo_asimbv_circle.png"
                alt="ASIMBv Emblem"
                className="event-placeholder-logo"
              />
              <span className="event-placeholder-label">Eveniment Oficial ASIMBv</span>
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
                  aria-label={`Selectează imaginea ${index + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatură ${index + 1}`}
                    className="event-thumbnail-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo_asimbv_circle.png';
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
            <h3 className="section-label">Despre acest eveniment</h3>
            <p className="event-description-text">{event.description}</p>
          </div>

          <div className="event-details-actions">
            {event.formUrl && (
              <a
                href={event.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-cta-form-btn"
              >
                <span>Înscrie-te / Formular Înscriere</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}

            <Link to="/events" className="event-secondary-back-btn">
              ← Toate evenimentele
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventDetails;