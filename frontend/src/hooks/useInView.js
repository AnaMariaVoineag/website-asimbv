import { useEffect, useRef, useState } from 'react';

/**
 * Tells when an element is scrolled into view. Returns [ref, inView].
 *
 * - once = true: stays true after the first time the element is seen.
 * - once = false: turns false again when the element leaves the screen, so the caller can replay
 *   its animation every time the element comes back.
 *
 * The element counts as "in" once enough of it shows and as "out" only when none of it does, so it
 * does not flicker while it is partly visible. Without IntersectionObserver support it counts as visible.
 */
export const useInView = ({ threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  // In "once" mode the effect stops watching after the first sighting; otherwise it keeps watching.
  const done = once && inView;

  useEffect(() => {
    const node = ref.current;
    if (!node || done) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Very tall elements may never reach `threshold` of their own area, so half a screen also counts.
        const fillsScreen =
          entry.rootBounds && entry.intersectionRect.height >= entry.rootBounds.height * 0.5;

        if (entry.intersectionRatio >= threshold || fillsScreen) {
          setInView(true);
        } else if (!once && !entry.isIntersecting) {
          setInView(false);
        }
      },
      { threshold: [0, threshold], rootMargin }
    );
    observer.observe(node);

    // The observer never fires for an element that is jumped over (anchor link, scroll restoration,
    // fast scroll), so in "once" mode elements that end up above the viewport are shown without waiting.
    const showIfScrolledPast = () => {
      if (once && node.getBoundingClientRect().bottom <= 0) setInView(true);
    };
    showIfScrolledPast();
    window.addEventListener('scroll', showIfScrolledPast, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', showIfScrolledPast);
    };
  }, [done, once, threshold, rootMargin]);

  return [ref, inView];
};
