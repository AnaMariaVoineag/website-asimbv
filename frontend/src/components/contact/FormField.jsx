import { useI18n } from '../../context/I18nContext';

// Label + input wrapper + validation feedback shared by every contact form field.
const FormField = ({ id, label, touched, error, labelAside, showValidIcon = true, children }) => {
  const { t } = useI18n();
  const stateClass = touched ? (error ? 'has-error' : 'is-valid') : '';

  const labelNode = (
    <label htmlFor={id} className="form-label">
      {t(label)} <span className="req">*</span>
    </label>
  );

  return (
    <div className={`form-group ${stateClass}`}>
      {labelAside ? (
        <div className="label-with-counter">
          {labelNode}
          {labelAside}
        </div>
      ) : (
        labelNode
      )}
      <div className="input-wrapper">
        {children}
        {showValidIcon && touched && !error && <span className="valid-icon">✓</span>}
      </div>
      {touched && error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormField;
