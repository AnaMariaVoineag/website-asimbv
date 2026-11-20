import { useEffect } from 'react';

// Adds a class to <html> while the calling component is mounted.
export const useHtmlClass = (className) => {
  useEffect(() => {
    document.documentElement.classList.add(className);
    return () => document.documentElement.classList.remove(className);
  }, [className]);
};
