import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import './palette.css';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch events from backend`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events from database:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page-container">
      <h1 className="events-page-title">Evenimentele Noastre</h1>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem' }}>
          Se încarcă evenimentele din baza de date...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e', fontSize: '1.1rem' }}>
          A apărut o eroare la încărcarea evenimentelor: {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem' }}>
          Nu există evenimente în baza de date.
        </div>
      )}

      {!loading && !error && (
        <div className="events-list">
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
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
      )}
    </div>
  );
};

export default EventsPage;