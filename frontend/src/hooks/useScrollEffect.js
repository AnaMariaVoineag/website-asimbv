import { useEffect, useRef } from 'react';

/**
 * Calls `effect(scrollY)` on mount, on resize and on scroll, at most once per animation frame.
 * Meant for effects that write straight to the DOM (CSS variables, transforms) without re-rendering.
 */
export const useScrollEffect = (effect) => {
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  });

  useEffect(() => {
    let frame = 0;

    const run = () => {
      frame = 0;
      effectRef.current(window.scrollY);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    run();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
};
