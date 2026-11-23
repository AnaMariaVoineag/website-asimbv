import { useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { localizeEvent } from '../dictionaries/eventTranslations';
import { getEvent, getEventPartners } from '../services/eventsService';
import { useAsyncData } from './useAsyncData';

/**
 * A single event, translated to the current language.
 * status: 'loading' | 'ready' | 'not-found' | 'error'
 */
export const useEvent = (id) => {
  const { lang } = useI18n();
  const { data, error, status } = useAsyncData(`event-${id}`, (signal) => getEvent(id, { signal }));
  const event = useMemo(() => (data ? localizeEvent(data, lang) : null), [data, lang]);

  if (status === 'error') {
    if (error.status === 404) return { event: null, status: 'not-found' };
    console.error('[useEvent] fetch error:', error);
    return { event: null, status: 'error' };
  }
  return { event, status };
};

// Partners of an event. Separate from the event request: if it fails the page just has no partners strip.
export const useEventPartners = (id) => {
  const { data } = useAsyncData(`event-partners-${id}`, (signal) => getEventPartners(id, { signal }));
  return data ?? [];
};
