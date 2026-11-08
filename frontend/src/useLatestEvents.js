import { useEffect, useRef, useState } from 'react';
import { assetUrl } from './assetUrl';

// How often an open page re-checks the database for new events.
const REFRESH_INTERVAL_MS = 60_000;

const MONTHS = {
  ianuarie: 0, februarie: 1, martie: 2, aprilie: 3, mai: 4, iunie: 5,
  iulie: 6, august: 7, septembrie: 8, octombrie: 9, noiembrie: 10, decembrie: 11,
};

// Turns "31 octombrie 2026", "21-24 mai 2026" or "Septembrie 2026" into a sortable timestamp.
// Returns null when the text has no recognizable month + year.
export const parseRoDate = (text) => {
  if (!text) return null;
  const match = text
    .toLowerCase()
    .match(/(?:(\d{1,2})(?:\s*-\s*\d{1,2})?\s+)?([a-zăâîșț]+)\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS[match[2]];
  if (month === undefined) return null;
  return new Date(Number(match[3]), month, match[1] ? Number(match[1]) : 1).getTime();
};

// First image of the backend's Images JSON string, resolved for the current base path.
export const firstEventImage = (imagesJson) => {
  if (!imagesJson) return null;
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) && parsed.length > 0 ? assetUrl(parsed[0]) : null;
  } catch {
    return null;
  }
};

// Newest first by event date; events whose date can't be read fall back to id order (newest id first).
export const sortNewestFirst = (events) =>
  [...events].sort((a, b) => {
    const da = parseRoDate(a.date);
    const db = parseRoDate(b.date);
    if (da !== null && db !== null && da !== db) return db - da;
    return b.id - a.id;
  });

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
      fetch('/api/events', { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
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
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);

    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [count]);

  return { events, status };
};
