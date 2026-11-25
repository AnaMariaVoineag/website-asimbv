// Loading / error / empty placeholder used by every list.
const StateBlock = ({ status, error, onRetry, empty, emptyText = 'Nimic de afișat încă.' }) => {
  if (status === 'loading') return <div className="adm-state">Se încarcă…</div>;
  if (status === 'error') {
    return (
      <div className="adm-state adm-state-error">
        <p>{error?.message ?? 'A apărut o eroare.'}</p>
        {onRetry && (
          <button type="button" className="adm-btn" onClick={onRetry}>
            Reîncearcă
          </button>
        )}
      </div>
    );
  }
  if (empty) return <div className="adm-state">{emptyText}</div>;
  return null;
};

export default StateBlock;
