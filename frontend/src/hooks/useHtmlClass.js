import { useEffect } from 'react';

// Adds a class to <html> while the calling component is mounted (and `enabled` is true).
export const useHtmlClass = (className, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add(className);
    return () => document.documentElement.classList.remove(className);
  }, [className, enabled]);
};
