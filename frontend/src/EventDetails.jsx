// src/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    return <div className="event-not-found">Se încarcă evenimentul...</div>;
  }

  if (error === 'not-found' || !event) {
    return (
      <div className="event-not-found">
        <p>Evenimentul nu a fost găsit!</p>
        <Link to="/events">← Înapoi la evenimente</Link>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="event-not-found">
        <p>Eroare la încărcarea evenimentului.</p>
        <Link to="/events">← Înapoi la evenimente</Link>
      </div>
    );
  }

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
          <p className="lorem-text">{event.description}</p>

          <p className="meta-info">Data: <span>{event.date}</span></p>
          <p className="meta-info">Categoria: <span>{event.category}</span></p>

          {event.formUrl && (
            <div style={{ marginTop: '1rem' }}>
              <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="event-form-link-btn">
                Înscrie-te / Formular Înscriere
              </a>
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/events" className="event-details-link-btn">← Înapoi la evenimente</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;