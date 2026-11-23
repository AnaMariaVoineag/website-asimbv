import { useRef, useState } from 'react';
import { subscribe } from '../services/newsletterService';
import { useI18n } from '../context/I18nContext';

/**
 * Newsletter subscription state.
 * status: null | { type: 'success' | 'duplicate' | 'error', text }
 * `submit` resolves to true when the subscription went through.
 */
export const useNewsletterSubscribe = () => {
  const { t, lang } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  // A ref updates instantly, unlike the disabled button, so a repeat submit cannot slip through.
  const submitInFlight = useRef(false);

  const submit = async ({ name, email }) => {
    if (!email.trim() || submitInFlight.current) return false;
    submitInFlight.current = true;
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await subscribe({ email: email.trim(), name: name.trim() });
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: lang === 'ro' ? data.message : t('footer.subscribed') });
        return true;
      }
      if (response.status === 409) {
        setStatus({ type: 'duplicate', text: lang === 'ro' ? data.message : t('footer.duplicate') });
      } else {
        setStatus({ type: 'error', text: (lang === 'ro' && data.message) || t('footer.subscribeError') });
      }
    } catch {
      setStatus({ type: 'error', text: t('footer.networkError') });
    } finally {
      submitInFlight.current = false;
      setIsLoading(false);
    }
    return false;
  };

  return { status, isLoading, submit };
};
