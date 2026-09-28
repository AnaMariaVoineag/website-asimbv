import React, { useState, useEffect } from 'react';

const EventCard = ({ event }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    `https://picsum.photos/seed/${event.id}A/800/600`,
    `https://picsum.photos/seed/${event.id}B/800/600`,
    `https://picsum.photos/seed/${event.id}C/800/600`,
    `https://picsum.photos/seed/${event.id}D/800/600`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="event-card">
      <div className="event-image-section">
        <img 
          src={images[currentIndex]} 
          alt={event.title} 
          className="event-image"
        />
        
        <div className="event-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>

      <div className="event-text-section">
        <div className="event-date">{event.date}</div>
        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;