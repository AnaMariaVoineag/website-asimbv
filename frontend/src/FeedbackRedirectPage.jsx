// src/FeedbackRedirectPage.jsx
// Short link (/feedback) to the university's teacher-evaluation page on the intranet.
// It only forwards the visitor; each student signs in there with their own UniTBv account.
import { useEffect } from 'react';
import { useI18n } from './i18n/I18nProvider';
import './palette.css';
import './UnsubscribePage.css';

export const FEEDBACK_URL =
  'https://intranet.unitbv.ro/Didactic/Evaluarea-activit%C4%83%C8%9Bii-didactice';

const FeedbackRedirectPage = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t('feedback.pageTitle');
    // replace() keeps this page out of the history, so Back returns to where the visitor came from.
    window.location.replace(FEEDBACK_URL);
  }, [t]);

  // Shown only for the moment before the browser leaves, or if the redirect is blocked.
  return (
    <div className="unsubscribe-page">
      <section className="unsubscribe-card" aria-live="polite">
        <h1 className="unsubscribe-title">{t('feedback.title')}</h1>
        <p className="unsubscribe-text">{t('feedback.text')}</p>
        <a href={FEEDBACK_URL} className="unsubscribe-home-link" rel="noopener noreferrer">
          {t('feedback.button')}
        </a>
      </section>
    </div>
  );
};

export default FeedbackRedirectPage;
