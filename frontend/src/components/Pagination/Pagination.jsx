import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, labels }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination-container" aria-label={labels.nav}>
      <button
        className="pagination-btn pagination-nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {labels.prev}
      </button>

      <div className="pagination-numbers">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`pagination-btn pagination-num-btn ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {labels.next}
      </button>
    </nav>
  );
};

export default Pagination;
