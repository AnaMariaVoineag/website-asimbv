import { AlertCircleIcon, RefreshIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';

const ErrorView = ({ message, onRetry }) => {
  const { t, rich, list } = useI18n();
  const hints = list('tax.error.hints');

  return (
    <div className="error-view">
      <div className="error-icon-box">
        <AlertCircleIcon size={48} />
      </div>

      <h2 className="error-title">{t('tax.error.title')}</h2>
      <p className="error-desc">{message}</p>

      <div className="error-hints-card">
        <h4>{t('tax.error.hintsTitle')}</h4>
        <ul>
          {hints.map((_, index) => (
            <li key={index}>{rich(`tax.error.hints.${index}`)}</li>
          ))}
        </ul>
      </div>

      <div className="error-actions">
        <button type="button" className="action-btn primary-btn" onClick={onRetry}>
          <RefreshIcon size={18} />
          <span>{t('tax.error.retry')}</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorView;
