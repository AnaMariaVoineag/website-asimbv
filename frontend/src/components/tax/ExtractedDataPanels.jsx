import { useState } from 'react';
import { CheckIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';
import { PERSONAL_FIELDS } from '../../constants/tax';
import { formatPeriod } from '../../utils/taxFormatters';

const classNames = (...names) => names.filter(Boolean).join(' ');

const FieldBlock = ({ label, fullWidth, children }) => (
  <div className={classNames('field-block', fullWidth && 'full-width')}>
    <label className="field-label">{label}</label>
    {children}
  </div>
);

const PersonalPanel = ({ data, onFieldChange }) => {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="data-panel">
      <div className="panel-header">
        <h3 className="panel-title">{t('tax.success.sectionOne')}</h3>
        <button type="button" className="edit-toggle-btn" onClick={() => setIsEditing((editing) => !editing)}>
          {isEditing ? t('tax.success.save') : t('tax.success.edit')}
        </button>
      </div>

      <div className="fields-grid">
        {PERSONAL_FIELDS.map(({ name, labelKey, valueClass, fullWidth }) => (
          <FieldBlock key={name} label={t(labelKey)} fullWidth={fullWidth}>
            {isEditing ? (
              <input
                type="text"
                className="field-input"
                value={data[name]}
                onChange={(e) => onFieldChange(name, e.target.value)}
              />
            ) : (
              <div className={classNames('field-value', valueClass)}>{data[name]}</div>
            )}
          </FieldBlock>
        ))}
      </div>
    </div>
  );
};

const BeneficiaryPanel = ({ data }) => {
  const { t, lang } = useI18n();

  return (
    <div className="data-panel">
      <div className="panel-header">
        <h3 className="panel-title">{t('tax.success.sectionTwo')}</h3>
        <span className="signature-pill">
          <CheckIcon size={14} strokeWidth={2.5} />
          {t('tax.success.signature')}
        </span>
      </div>

      <div className="fields-grid">
        <FieldBlock label={t('tax.success.association')} fullWidth>
          <div className="field-value highlight">{data.beneficiaryName}</div>
        </FieldBlock>
        <FieldBlock label={t('tax.success.cif')}>
          <div className="field-value code-font">{data.beneficiaryCif}</div>
        </FieldBlock>
        <FieldBlock label={t('tax.success.percentage')}>
          <div className="field-value percent-badge">{data.percentage}</div>
        </FieldBlock>
        <FieldBlock label={t('tax.success.iban')} fullWidth>
          <div className="field-value code-font iban-value">{data.beneficiaryIban}</div>
        </FieldBlock>
        <FieldBlock label={t('tax.success.period')}>
          <div className="field-value">{formatPeriod(data.period, lang)}</div>
        </FieldBlock>
        <FieldBlock label={t('tax.success.format')}>
          <div className="field-value">{t('tax.success.formatValue')}</div>
        </FieldBlock>
      </div>
    </div>
  );
};

const ExtractedDataPanels = ({ data, onFieldChange }) => (
  <div className="extracted-data-grid">
    <PersonalPanel data={data} onFieldChange={onFieldChange} />
    <BeneficiaryPanel data={data} />
  </div>
);

export default ExtractedDataPanels;
