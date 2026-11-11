import React, { useState, useEffect, useMemo } from 'react';
import EventCard from './EventCard';
import { assetUrl } from './assetUrl';
import { useI18n } from './i18n/I18nProvider';
import { localizeEvent } from './i18n/eventTranslations';
import './palette.css';
import './EventsPage.css';

const CATEGORIES = ['Toate', 'Workshop', 'Social', 'Competition'];
const ITEMS_PER_PAGE = 5;

// Parse the Images JSON string from the backend into an array
const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed.map(assetUrl) : [];
  } catch {
    return [];
  }
};

const EventsPage = () => {
  const { t, lang } = useI18n();
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
        setError(true);
        console.error('[EventsPage] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const localizedEvents = useMemo(
    () => events.map((event) => localizeEvent(event, lang)),
    [events, lang]
  );

  const filteredEvents = useMemo(() => {
    return localizedEvents.filter((event) => {
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
  }, [localizedEvents, selectedCategory, searchTerm]);

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
        <h1 className="events-page-title">{t('events.title')}</h1>
        <p className="events-page-subtitle">
          {t('events.subtitle')}
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
            placeholder={t('events.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchTerm('')}
              aria-label={t('events.clearSearch')}
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
              {category === 'Toate' ? t('events.allCategories') : t(`events.category${category}`)}
            </button>
          ))}
        </div>

        {!loading && (
          <div className="results-counter">
            {filteredEvents.length === 1
              ? t('events.resultOne')
              : t('events.resultMany', { count: filteredEvents.length })}
          </div>
        )}
      </div>

      {loading && (
        <div className="events-status-message">
          <div className="spinner"></div>
          <p>{t('events.loading')}</p>
        </div>
      )}

      {error && !loading && (
        <div className="events-status-message error-message">
          <p>⚠️ {t('events.loadError')}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            {t('events.retry')}
          </button>
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <div className="events-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>{t('events.emptyTitle')}</h3>
          <p>{t('events.emptyText')}</p>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSelectedCategory('Toate');
              setSearchTerm('');
            }}
          >
            {t('events.resetFilters')}
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
            <nav className="pagination-container" aria-label={t('events.pagination')}>
              <button
                className="pagination-btn pagination-nav-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t('events.prev')}
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
                {t('events.next')}
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;