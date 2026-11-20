import { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useNewsletterSubscribe } from '../../hooks/useNewsletterSubscribe';
import { CheckCircleIcon, SendIcon } from '../icons';

const NewsletterForm = () => {
  const { t } = useI18n();
  const { status, isLoading, submit } = useNewsletterSubscribe();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await submit({ name, email })) {
      setName('');
      setEmail('');
    }
  };

  if (status?.type === 'success') {
    return (
      <div className="newsletter-success">
        <CheckCircleIcon className="success-icon" />
        <span>{status.text}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="newsletter-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength="100"
        placeholder={t('footer.namePlaceholder')}
        className="newsletter-input newsletter-name-input"
        disabled={isLoading}
      />
      <div className="newsletter-input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength="254"
          placeholder={t('footer.emailPlaceholder')}
          required
          className="newsletter-input"
          disabled={isLoading}
        />
        <button type="submit" className="newsletter-submit-btn" aria-label={t('footer.subscribe')} disabled={isLoading}>
          {isLoading ? <span className="newsletter-spinner"></span> : <SendIcon className="newsletter-send-icon" />}
        </button>
      </div>
      {status && (
        <p className={`newsletter-status-msg newsletter-status-${status.type}`}>
          {status.type === 'duplicate' ? '📬 ' : '⚠️ '}
          {status.text}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
