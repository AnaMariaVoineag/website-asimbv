import { SearchIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';
import { ALL_CATEGORIES } from '../../hooks/useEventFilters';

const CATEGORIES = [ALL_CATEGORIES, 'Workshop', 'Social', 'Competition'];

const EventsFilters = ({ search, onSearchChange, category, onCategoryChange, resultCount }) => {
  const { t } = useI18n();

  return (
    <div className="events-controls-wrapper">
      <div className="search-box-container">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="events-search-input"
          placeholder={t('events.searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label={t('events.clearSearch')}
          >
            ×
          </button>
        )}
      </div>

      <div className="category-filters-container">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            className={`category-pill ${category === item ? 'active' : ''} pill-${item.toLowerCase()}`}
            onClick={() => onCategoryChange(item)}
          >
            {item === ALL_CATEGORIES ? t('events.allCategories') : t(`events.category${item}`)}
          </button>
        ))}
      </div>

      {resultCount !== null && (
        <div className="results-counter">
          {resultCount === 1 ? t('events.resultOne') : t('events.resultMany', { count: resultCount })}
        </div>
      )}
    </div>
  );
};

export default EventsFilters;
