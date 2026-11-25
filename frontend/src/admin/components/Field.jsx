// Label + control + optional hint/counter.
const Field = ({ label, hint, count, max, required, children, className = '' }) => (
  <label className={`adm-field ${className}`}>
    <span className="adm-field-label">
      {label}
      {required && <span className="adm-required"> *</span>}
      {max != null && (
        <span className={`adm-counter ${count > max ? 'adm-counter-over' : ''}`}>
          {count}/{max}
        </span>
      )}
    </span>
    {children}
    {hint && <span className="adm-field-hint">{hint}</span>}
  </label>
);

export default Field;
