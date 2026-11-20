// Opened from the link in the newsletter emails: /dezabonare?token=...
// Nothing happens until the reader presses the button, because mail providers open every link in an
// email to scan it, and an automatic unsubscribe would remove people who never asked for it.
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { unsubscribe } from '../../services/newsletterService';
import './UnsubscribePage.css';

const UnsubscribePage = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  // idle | loading | done | invalid | error
  const [status, setStatus] = useState(token ? 'idle' : 'invalid');
  useDocumentTitle(t('unsubscribe.pageTitle'));

  const handleUnsubscribe = async () => {
    setStatus('loading');
    try {
      const response = await unsubscribe(token);
      if (response.ok) setStatus('done');
      else if (response.status === 404 || response.status === 400) setStatus('invalid');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const showButton = status === 'idle' || status === 'loading' || status === 'error';

  return (
    <div className="unsubscribe-page">
      <section className="unsubscribe-card" aria-live="polite">
        <h1 className="unsubscribe-title">
          {status === 'done' ? t('unsubscribe.doneTitle') : t('unsubscribe.title')}
        </h1>

        <p className="unsubscribe-text">
          {status === 'done' && t('unsubscribe.doneText')}
          {status === 'invalid' && t('unsubscribe.invalidText')}
          {showButton && t('unsubscribe.confirmText')}
        </p>

        {status === 'error' && <p className="unsubscribe-error">{t('unsubscribe.errorText')}</p>}

        {showButton ? (
          <button
            type="button"
            className="unsubscribe-btn"
            onClick={handleUnsubscribe}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t('unsubscribe.loading') : t('unsubscribe.button')}
          </button>
        ) : (
          <Link to={ROUTES.home} className="unsubscribe-home-link">{t('unsubscribe.backHome')}</Link>
        )}
      </section>
    </div>
  );
};

export default UnsubscribePage;
