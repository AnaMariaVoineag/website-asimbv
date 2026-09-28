import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import fallbackEvents from './events.json';
import './palette.css';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Try fetching via relative proxy URL or direct backend URL
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.warn("Could not fetch from /api/events, attempting direct port 5197 or fallback:", err);
        try {
          const directResponse = await fetch('http://localhost:5197/api/events');
          if (directResponse.ok) {
            const directData = await directResponse.json();
            if (Array.isArray(directData) && directData.length > 0) {
              setEvents(directData);
            }
          }
        } catch (directErr) {
          console.info("Using local fallback events dataset.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page-container">
      <h1 className="events-page-title">Evenimentele Noastre</h1>
      
      <div className="events-list">
        {events.map((event, index) => (
          <React.Fragment key={event.id || index}>
            <EventCard event={event} />

            {index < events.length - 1 && (
              <div className="timeline-divider">
                <div className="timeline-line"></div>
                <div className="timeline-dot"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;