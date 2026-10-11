// src/EventDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsData from './eventsData.json';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  
  // Găsim evenimentul pe baza ID-ului din URL
  const event = eventsData.find(e => e.id === id);

  if (!event) {
    return <div className="event-not-found">Evenimentul nu a fost găsit!</div>;
  }

  // Folosim prima imagine din array sau un fallback dacă nu are imagini
  const mainImage = event.images && event.images.length > 0 
    ? event.images[0] 
    : `https://picsum.photos/seed/${event.id}/400/600`;

  return (
    <div className="event-details-page">
      

      <div className="event-header-top">
        <h1>{event.title}</h1>
      </div>

      <div className="event-details-container">
        <div className="event-details-left">
          <img src={mainImage} alt={event.title} className="event-poster" />
        </div>

        <div className="event-details-right">
          <p className="lorem-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p className="meta-info">Data: <span>{event.date}</span></p>
          <p className="meta-info">Categoria: <span>{event.category}</span></p>

          <div className="cast-list">
            <p><strong>Participanți cheie:</strong></p>
            <ul>
              <li><span className="star solid">★</span> Voluntar 1</li>
              <li><span className="star outline">☆</span> Organizator Principal</li>
              <li><span className="star solid">★</span> Invitat Special</li>
              <li><span className="star outline">☆</span> Coordonator Echipă</li>
              <li><span className="star solid">★</span> Sponsor Reprezentant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;