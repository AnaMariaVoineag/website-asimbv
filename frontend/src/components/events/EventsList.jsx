import { Fragment } from 'react';
import EventCard from '../EventCard/EventCard';

// Cards separated by a timeline divider.
const EventsList = ({ events }) => (
  <div className="events-list">
    {events.map((event, index) => (
      <Fragment key={event.id || index}>
        <EventCard event={event} />

        {index < events.length - 1 && (
          <div className="timeline-divider">
            <div className="timeline-line"></div>
            <div className="timeline-dot"></div>
          </div>
        )}
      </Fragment>
    ))}
  </div>
);

export default EventsList;
