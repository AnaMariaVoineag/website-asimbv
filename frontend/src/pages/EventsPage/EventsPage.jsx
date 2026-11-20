import Pagination from '../../components/Pagination/Pagination';
import { useI18n } from '../../context/I18nContext';
import { useEventFilters } from '../../hooks/useEventFilters';
import { useEvents } from '../../hooks/useEvents';
import { useHtmlClass } from '../../hooks/useHtmlClass';
import EventsFilters from '../../components/events/EventsFilters';
import EventsList from '../../components/events/EventsList';
import { EventsEmpty, EventsError, EventsLoading } from '../../components/events/EventsStatus';
import './EventsPage.css';

const ITEMS_PER_PAGE = 5;

const EventsPage = () => {
  const { t } = useI18n();
  const { events, status } = useEvents();
  const filters = useEventFilters(events, ITEMS_PER_PAGE);
  const isReady = status === 'ready';
  const hasCards = isReady && filters.filtered.length > 0;
  // Scroll snapping needs cards to snap to: without them the footer is the only snap point
  // and mandatory snapping would throw the page straight down to it.
  useHtmlClass('events-scroll-snap-enabled', hasCards);

  const handlePageChange = (page) => {
    filters.goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="events-page-container">
      <header className="events-header">
        <h1 className="events-page-title">{t('events.title')}</h1>
        <p className="events-page-subtitle">{t('events.subtitle')}</p>
      </header>

      <EventsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        category={filters.category}
        onCategoryChange={filters.setCategory}
        resultCount={status === 'loading' ? null : filters.filtered.length}
      />

      {status === 'loading' && <EventsLoading />}
      {status === 'error' && <EventsError />}
      {isReady && !hasCards && <EventsEmpty onReset={filters.reset} />}

      {hasCards && (
        <>
          <EventsList events={filters.pageItems} />
          <Pagination
            currentPage={filters.page}
            totalPages={filters.totalPages}
            onPageChange={handlePageChange}
            labels={{ nav: t('events.pagination'), prev: t('events.prev'), next: t('events.next') }}
          />
        </>
      )}
    </div>
  );
};

export default EventsPage;
