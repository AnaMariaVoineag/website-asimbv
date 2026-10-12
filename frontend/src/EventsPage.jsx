import React, { useState, useEffect, useMemo } from 'react';
import EventCard from './EventCard';
import './palette.css';
import './EventsPage.css';

const CATEGORIES = ['Toate', 'Workshop', 'Social', 'Competition'];
const ITEMS_PER_PAGE = 5;

// Parse the Images JSON string from the backend into an array
const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Enable scroll-snap on html/body while on EventsPage
    document.documentElement.classList.add('events-scroll-snap-enabled');
    return () => {
      document.documentElement.classList.remove('events-scroll-snap-enabled');
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error(`Eroare server: ${response.status}`);
        const data = await response.json();
        // Normalize backend shape → what EventCard expects
        const normalized = data.map((e) => ({
          ...e,
          images: parseImages(e.images),
          formUrl: e.formUrl ?? null,
        }));
        setEvents(normalized);
      } catch (err) {
        setError('Nu s-au putut încărca evenimentele. Verifică conexiunea sau reîncarcă pagina.');
        console.error('[EventsPage] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === 'Toate' ||
        (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        searchTerm.trim() === '' ||
        (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.date && event.date.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="events-page-container">
      <header className="events-header">
        <h1 className="events-page-title">Evenimentele Noastre</h1>
        <p className="events-page-subtitle">
          Explorează toate activitățile, workshop-urile, proiectele sociale și competițiile comunității ASIMBV.
        </p>
      </header>

      <div className="events-controls-wrapper">
        <div className="search-box-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="events-search-input"
            placeholder="Caută după nume sau cuvânt cheie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchTerm('')}
              aria-label="Șterge căutarea"
            >
              ×
            </button>
          )}
        </div>

        <div className="category-filters-container">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? 'active' : ''} pill-${category.toLowerCase()}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category === 'Toate' ? 'Toate Categoriile' : category}
            </button>
          ))}
        </div>

        {!loading && (
          <div className="results-counter">
            {filteredEvents.length === 1 
              ? '1 eveniment găsit' 
              : `${filteredEvents.length} evenimente găsite`}
          </div>
        )}
      </div>

      {loading && (
        <div className="events-status-message">
          <div className="spinner"></div>
          <p>Se încarcă evenimentele din baza de date...</p>
        </div>
      )}

      {error && !loading && (
        <div className="events-status-message error-message">
          <p>⚠️ {error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Reîncearcă
          </button>
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <div className="events-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Nu a fost găsit niciun eveniment</h3>
          <p>Încearcă să ajustezi filtrele sau termenul de căutare.</p>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSelectedCategory('Toate');
              setSearchTerm('');
            }}
          >
            Resetează filtrele
          </button>
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <>
          <div className="events-list">
            {paginatedEvents.map((event, index) => (
              <React.Fragment key={event.id || index}>
                <EventCard event={event} />

                {index < paginatedEvents.length - 1 && (
                  <div className="timeline-divider">
                    <div className="timeline-line"></div>
                    <div className="timeline-dot"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination-container" aria-label="Navigare pagini">
              <button
                className="pagination-btn pagination-nav-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹ Înapoi
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn pagination-nav-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Înainte ›
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;