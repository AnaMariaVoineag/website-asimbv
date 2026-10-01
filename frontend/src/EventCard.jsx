import React, { useState, useEffect } from 'react';

const EventCard = ({ event }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    event.imageUrl || `https://picsum.photos/seed/${event.id}A/800/600`,
    `https://picsum.photos/seed/${event.id}B/800/600`,
    `https://picsum.photos/seed/${event.id}C/800/600`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [images.length]);

  const category = event.category || 'Social';
  const categoryClass = `badge-${category.toLowerCase()}`;

  return (
    <div className="event-card">
      <div className="event-image-section">
        <img 
          src={images[currentIndex]} 
          alt={event.title} 
          className="event-image"
          loading="lazy"
        />
        
        <div className="event-badge-overlay">
          <span className={`event-category-badge ${categoryClass}`}>
            {category}
          </span>
        </div>

        <div className="event-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

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
          <span className={`event-inline-badge ${categoryClass}`}>
            {category}
          </span>
        </div>

        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>

        {event.formUrl && (
          <div className="event-action-wrapper">
            <a
              href={event.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-form-link-btn"
            >
              <span>Înscrie-te / Formular Înscriere</span>
              <svg className="event-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;