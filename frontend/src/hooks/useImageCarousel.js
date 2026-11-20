import { useEffect, useState } from 'react';

/**
 * Index of the visible image, advancing automatically when there is more than one.
 * Returns [index, setIndex] so dots can jump to a specific image.
 */
export const useImageCarousel = (length, intervalMs = 6000) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current === length - 1 ? 0 : current + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [length, intervalMs]);

  return [index, setIndex];
};
