import { useMemo, useRef, useState } from 'react';
import { CONTACT_FIELDS } from '../constants/contact';
import { useI18n } from '../context/I18nContext';
import { sendContactMessage } from '../services/contactService';
import { validateContact } from '../utils/contactValidation';

const emptyValues = () => Object.fromEntries(CONTACT_FIELDS.map((field) => [field, '']));
const allTouched = (value) => Object.fromEntries(CONTACT_FIELDS.map((field) => [field, value]));

/**
 * State, validation and submission of the contact form.
 * submitStatus: null | { type: 'success' | 'error', text }
 */
export const useContactForm = () => {
  const { t, lang } = useI18n();
  const [values, setValues] = useState(emptyValues);
  const [touched, setTouched] = useState(() => allTouched(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  // A ref updates instantly, unlike the disabled button, so a repeat submit cannot slip through.
  const submitInFlight = useRef(false);

  // Translated at render time so the messages follow the current language.
  const errors = useMemo(() => {
    const raw = validateContact(values);
    return Object.fromEntries(
      Object.entries(raw).map(([field, { key, params }]) => [field, t(key, params)])
    );
  }, [values, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(allTouched(true));

    if (Object.keys(validateContact(values)).length > 0) {
      setSubmitStatus({ type: 'error', text: t('contact.fixErrors') });
      return;
    }

    if (submitInFlight.current) return;
    submitInFlight.current = true;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await sendContactMessage(values);

      if (response.ok) {
        setSubmitStatus({ type: 'success', text: t('contact.success') });
        setValues(emptyValues());
        setTouched(allTouched(false));
      } else {
        const errorData = await response.json().catch(() => ({}));
        // Keep what the user typed so they can fix it or try again.
        setSubmitStatus({
          type: 'error',
          text: (lang === 'ro' && errorData.message) || t('contact.sendFailed'),
        });
      }
    } catch {
      setSubmitStatus({ type: 'error', text: t('contact.networkError') });
    } finally {
      submitInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return { values, errors, touched, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit };
};
