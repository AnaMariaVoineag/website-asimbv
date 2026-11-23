import { Fragment } from 'react';
import { useInView } from '../../hooks/useInView';
import './AnimatedTitle.css';

// Heading whose words slide up one after another each time it scrolls into view (`once` plays it only the first time).
const AnimatedTitle = ({ as: Tag = 'h2', text, className = '', once = false }) => {
  const [ref, inView] = useInView({ threshold: 0.4, once });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`animated-title ${inView ? 'is-visible' : ''} ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="animated-title-word" aria-hidden="true">
            <span className="animated-title-inner" style={{ '--word-index': index }}>
              {word}
            </span>
          </span>
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
};

export default AnimatedTitle;
