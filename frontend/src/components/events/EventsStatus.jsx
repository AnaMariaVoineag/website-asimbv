import { useI18n } from '../../context/I18nContext';

export const EventsLoading = () => {
  const { t } = useI18n();

  return (
    <div className="events-status-message">
      <div className="spinner"></div>
      <p>{t('events.loading')}</p>
    </div>
  );
};

export const EventsError = () => {
  const { t } = useI18n();

  return (
    <div className="events-status-message error-message">
      <p>⚠️ {t('events.loadError')}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        {t('events.retry')}
      </button>
    </div>
  );
};

export const EventsEmpty = ({ onReset }) => {
  const { t } = useI18n();

  return (
    <div className="events-empty-state">
      <div className="empty-icon">🔍</div>
      <h3>{t('events.emptyTitle')}</h3>
      <p>{t('events.emptyText')}</p>
      <button className="reset-filters-btn" onClick={onReset}>
        {t('events.resetFilters')}
      </button>
    </div>
  );
};
