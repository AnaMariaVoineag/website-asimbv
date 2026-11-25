import { useCallback, useEffect, useState } from 'react';

/**
 * Loads `load()` whenever `key` changes or `reload()` is called.
 * Keeps the previous data while reloading so lists don't flash empty.
 * Returns { data, error, status: 'loading' | 'ready' | 'error', reload, setData }.
 */
export const useAdminResource = (key, load) => {
  const [state, setState] = useState({ key: null, data: null, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState((previous) => ({ key, data: previous.data, error }));
      });
    return () => {
      cancelled = true;
    };
    // `load` is omitted on purpose: callers pass an inline function and `key` identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (update) => setState((s) => ({ ...s, data: typeof update === 'function' ? update(s.data) : update })),
    [],
  );

  let status = 'ready';
  if (state.error) status = 'error';
  else if (state.key !== key) status = 'loading';

  return { data: state.key === key || state.error ? state.data : null, error: state.error, status, reload, setData };
};
