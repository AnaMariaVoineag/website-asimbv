import { DownloadIcon, FileTextIcon, RefreshIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';

const ActionsToolbar = ({ onReset, onDownloadCsv, onDownloadPdf }) => {
  const { t } = useI18n();

  return (
    <div className="preview-actions-toolbar">
      <div className="actions-left">
        <button type="button" className="action-btn secondary-btn" onClick={onReset}>
          <RefreshIcon size={16} />
          <span>{t('tax.success.uploadAnother')}</span>
        </button>
      </div>

      <div className="actions-right">
        <button type="button" className="action-btn outline-btn" onClick={onDownloadCsv}>
          <FileTextIcon size={18} />
          <span>{t('tax.success.csv')}</span>
        </button>

        <button type="button" className="action-btn primary-btn" onClick={onDownloadPdf}>
          <DownloadIcon size={18} />
          <span>{t('tax.success.pdf')}</span>
        </button>
      </div>
    </div>
  );
};

export default ActionsToolbar;
