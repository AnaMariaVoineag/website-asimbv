import { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { downloadCsvReport, openPrintableReport } from '../../utils/taxExport';
import ActionsToolbar from './ActionsToolbar';
import DocumentPreview from './DocumentPreview';
import ExtractedDataPanels from './ExtractedDataPanels';

const TABS = [
  { id: 'data', labelKey: 'tax.success.tabData' },
  { id: 'preview', labelKey: 'tax.success.tabPreview' },
];

const SuccessView = ({ data, onFieldChange, onReset }) => {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState('data');

  return (
    <div className="success-preview-view">
      <div className="success-header-bar">
        <div className="success-title-group">
          <div className="success-check-badge">✓</div>
          <div>
            <h2 className="success-heading">{t('tax.success.title')}</h2>
            <p className="success-subheading">
              {t('tax.success.document')}
              <strong>{data.fileName}</strong>
              {t('tax.success.confidence')}
              <strong className="confidence-tag">{data.ocrConfidence}%</strong>
            </p>
          </div>
        </div>

        <div className="view-switch-tabs">
          {TABS.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              className={`switch-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'data' ? (
        <ExtractedDataPanels data={data} onFieldChange={onFieldChange} />
      ) : (
        <DocumentPreview data={data} />
      )}

      <ActionsToolbar
        onReset={onReset}
        onDownloadCsv={() => downloadCsvReport(data, t)}
        onDownloadPdf={() => openPrintableReport(data, t, lang)}
      />
    </div>
  );
};

export default SuccessView;
