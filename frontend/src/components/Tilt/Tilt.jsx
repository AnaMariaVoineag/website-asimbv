import { useRef } from 'react';
import './Tilt.css';

const canTilt = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Card that leans towards the cursor in 3D and shows a light glare that follows it.
 * Renders the element itself (no extra wrapper); `as` accepts a tag or a component such as Link.
 * Does nothing on touch screens or when the user prefers reduced motion.
 */
const Tilt = ({ as: Tag = 'div', max = 7, className = '', children, ...props }) => {
  const ref = useRef(null);

  const handleMove = (event) => {
    const element = ref.current;
    if (!element || !canTilt()) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    element.style.setProperty('--tilt-x', `${(0.5 - y) * max * 2}deg`);
    element.style.setProperty('--tilt-y', `${(x - 0.5) * max * 2}deg`);
    element.style.setProperty('--glare-x', `${x * 100}%`);
    element.style.setProperty('--glare-y', `${y * 100}%`);
    element.classList.add('is-tilting');
  };

  const handleLeave = () => {
    const element = ref.current;
    if (!element) return;
    element.classList.remove('is-tilting');
    ['--tilt-x', '--tilt-y', '--glare-x', '--glare-y'].forEach((name) => element.style.removeProperty(name));
  };

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Tilt;
