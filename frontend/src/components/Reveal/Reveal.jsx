import { useInView } from '../../hooks/useInView';
import './Reveal.css';

/**
 * Animates its element in when it scrolls into view. Renders the element itself (no extra wrapper).
 *
 * - default: the element fades in, sharpens and slides in; `delay` (ms) postpones it and
 *   `from` picks the direction: 'up' (default), 'left', 'right' or 'zoom'.
 * - `stagger`: the element stays put and its direct children appear one after another.
 * - `once`: play only the first time the element is seen; by default it replays every time it scrolls back in.
 */
const Reveal = ({
  as: Tag = 'div',
  from = 'up',
  stagger = false,
  delay = 0,
  once = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const [ref, inView] = useInView({ once });
  const classes = [stagger ? 'reveal-stagger' : 'reveal', inView && 'is-visible', className].filter(Boolean).join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      data-from={stagger ? undefined : from}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
