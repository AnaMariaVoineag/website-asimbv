import { useI18n } from '../../context/I18nContext';

const PreviewRow = ({ label, children }) => (
  <>
    <span className="mock-lbl">{label}</span>
    <span className="mock-val highlighted">{children}</span>
  </>
);

// Visual rendering of the extracted data, laid out like the paper Form 230.
const DocumentPreview = ({ data }) => {
  const { t, locale } = useI18n();

  return (
    <div className="doc-preview-container">
      <div className="form230-mock-sheet">
        <div className="mock-sheet-header">
          <div className="mock-anaf-logo">ANAF</div>
          <div className="mock-title-center">
            <h4>{t('tax.preview.ministry')}</h4>
            <h3>{t('tax.preview.form')}</h3>
            <p>{t('tax.preview.request')}</p>
          </div>
          <div className="mock-year">{new Date().getFullYear()}</div>
        </div>

        <div className="mock-section-box">
          <div className="mock-section-title">{t('tax.preview.sectionOne')}</div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.fullName')}>{data.fullName}</PreviewRow>
          </div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.cnp')}>{data.cnp}</PreviewRow>
          </div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.address')}>
              {data.address}, {data.city}, {t('tax.preview.countyAbbr')} {data.county}
            </PreviewRow>
          </div>
        </div>

        <div className="mock-section-box">
          <div className="mock-section-title">{t('tax.preview.sectionTwo')}</div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.entity')}>{data.beneficiaryName}</PreviewRow>
          </div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.cif')}>{data.beneficiaryCif}</PreviewRow>
            <span className="mock-lbl" style={{ marginLeft: '20px' }}>{t('tax.preview.share')}</span>
            <span className="mock-val highlighted">{data.percentage}</span>
          </div>
          <div className="mock-field-row">
            <PreviewRow label={t('tax.preview.iban')}>{data.beneficiaryIban}</PreviewRow>
          </div>
        </div>

        <div className="mock-footer-row">
          <div className="mock-sig-box">
            <span>{t('tax.preview.signature')}</span>
            <div className="sig-scribble">{data.fullName}</div>
          </div>
          <div className="mock-date-box">
            <span>{t('tax.preview.processedOn')}</span>
            <strong>{new Date().toLocaleDateString(locale)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
