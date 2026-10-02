import React, { useState, useEffect, useMemo } from 'react';
import EventCard from './EventCard';
import './palette.css';
import './EventsPage.css';

const CATEGORIES = ['Toate', 'Workshop', 'Social', 'Competition'];
const ITEMS_PER_PAGE = 5;

const normalizeText = (text) =>
  (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Nu s-au putut încărca evenimentele`);
        }
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Eroare la preluarea evenimentelor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on Category and Search Term (Title + Description)
  const filteredEvents = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === 'Toate' ||
        (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        normalizedSearch === '' ||
        normalizeText(event.title).includes(normalizedSearch) ||
        normalizeText(event.description).includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchTerm]);

  // Reset to page 1 whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Pagination calculation
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

      {/* Search and Category Filter Controls */}
      <div className="events-controls-wrapper">
        {/* Search Bar */}
        <div className="search-box-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="events-search-input"
            placeholder="Caută după titlu sau cuvinte cheie..."
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

        {/* Category Filters */}
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

        {/* Results summary */}
        {!loading && (
          <div className="results-counter">
            {filteredEvents.length === 1 
              ? '1 eveniment găsit' 
              : `${filteredEvents.length} evenimente găsite`}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="events-status-message">
          <div className="spinner"></div>
          <p>Se încarcă evenimentele din baza de date...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="events-status-message error-message">
          <div className="error-icon-wrapper">
            <svg className="error-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Reîncearcă
          </button>
        </div>
      )}

      {/* Empty Search Results */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="events-empty-state">
          <div className="empty-icon-wrapper">
            <svg className="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
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

      {/* Events List */}
      {!loading && !error && filteredEvents.length > 0 && (
        <>
          <div className="events-list">
            {paginatedEvents.map((event, index) => (
              <React.Fragment key={event.id || index}>
                <EventCard event={event} searchTerm={searchTerm} />

                {index < paginatedEvents.length - 1 && (
                  <div className="timeline-divider">
                    <div className="timeline-line"></div>
                    <div className="timeline-dot"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination Controls */}
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