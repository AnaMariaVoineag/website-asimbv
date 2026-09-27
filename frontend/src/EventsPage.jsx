import React from 'react';
import EventCard from './EventCard';
import eventsData from './events.json';
import './palette.css';
import './EventsPage.css';

const EventsPage = () => {
  return (
    <div className="events-page-container">
      <h1 className="events-page-title">Evenimentele Noastre</h1>
      
      <div className="events-list">
        {eventsData.map((event, index) => (
          <React.Fragment key={event.id}>
            
            <EventCard event={event} />

            {index < eventsData.length - 1 && (
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