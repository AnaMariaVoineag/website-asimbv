import { useEffect, useRef, useState } from 'react';
import { EVENTS_REFRESH_INTERVAL_MS } from '../config';
import { getEvents } from '../services/eventsService';
import { sortNewestFirst } from '../utils/events';

/**
 * The `count` most recent events from the database.
 * Fetches on mount, then again every minute and whenever the tab becomes visible,
 * so an event added to the database shows up without a code change or a manual reload.
 *
 * status: 'loading' (first fetch only) | 'ready' | 'error' (first fetch failed).
 * A failed background refresh keeps the events already on screen.
 */
export const useLatestEvents = (count = 3) => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const hasData = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = () =>
      getEvents({ signal: controller.signal })
        .then((data) => {
          setEvents(sortNewestFirst(data).slice(0, count));
          setStatus('ready');
          hasData.current = true;
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error('[useLatestEvents] fetch error:', err);
          if (!hasData.current) setStatus('error');
        });

    load();

    const refresh = () => {
      if (document.visibilityState === 'visible') load();
    };
    const timer = setInterval(refresh, EVENTS_REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);

    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [count]);

  return { events, status };
};
