import { useEffect, useState } from 'react';

/**
 * Runs `load(signal)` whenever `key` changes and aborts the previous request.
 *
 * Returns { data, error, status } where status is 'loading' | 'ready' | 'error'.
 * `status` is derived from the key, so a key change shows 'loading' immediately
 * without resetting state inside an effect.
 */
export const useAsyncData = (key, load) => {
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setResult({ key, data: null, error });
      });

    return () => controller.abort();
    // `load` is omitted on purpose: callers pass an inline function and `key` identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (result.key !== key) return { data: null, error: null, status: 'loading' };
  if (result.error) return { data: null, error: result.error, status: 'error' };
  return { data: result.data, error: null, status: 'ready' };
};
