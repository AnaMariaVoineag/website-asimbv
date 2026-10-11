import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css'; 

const EventCard = ({ event }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = event.images && event.images.length > 0;
  const validImages = hasImages ? event.images.slice(0, 3) : [];

  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [validImages.length]);

  const category = event.category || 'Social';
  const categoryClass = `badge-${category.toLowerCase()}`;

  return (
    <div className={`event-card ${!hasImages ? 'no-image-card' : ''}`}>
      
      {hasImages && (
        <div className="event-image-section">
          <img 
            src={validImages[currentIndex]} 
            alt={event.title} 
            className="event-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://picsum.photos/seed/${event.id || 'fallback'}/800/600`;
            }}
          />
          
          <div className="event-badge-overlay">
            <span className={`event-category-badge ${categoryClass}`}>
              {category}
            </span>
          </div>

          {validImages.length > 1 && (
            <div className="event-dots">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="event-text-section">
        <div className="event-meta-header">
          <div className="event-date">
            <svg className="event-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{event.date}</span>
          </div>
        </div>

        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>

        <div className="event-action-wrapper">
          {event.formUrl && (
            <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="event-form-link-btn">
              <span>Înscrie-te / Formular Înscriere</span>
            </a>
          )}

          <Link to={`/event-details/${event.id}`} className="event-details-link-btn">
            <span>Vezi detalii eveniment</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;