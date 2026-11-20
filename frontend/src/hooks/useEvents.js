import { useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { localizeEvent } from '../dictionaries/eventTranslations';
import { getEvents } from '../services/eventsService';
import { useAsyncData } from './useAsyncData';

// All events from the API, translated to the current language.
export const useEvents = () => {
  const { lang } = useI18n();
  const { data, status } = useAsyncData('events', (signal) => getEvents({ signal }));
  const events = useMemo(() => (data ?? []).map((event) => localizeEvent(event, lang)), [data, lang]);

  return { events, status };
};
