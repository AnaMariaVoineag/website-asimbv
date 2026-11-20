const LatestEventsSkeleton = ({ count }) => (
  <div className="latest-events-grid" aria-busy="true">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="latest-event-card latest-event-skeleton">
        <div className="latest-event-image-wrapper" />
        <div className="latest-event-body">
          <div className="skeleton-line skeleton-short" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    ))}
  </div>
);

export default LatestEventsSkeleton;
