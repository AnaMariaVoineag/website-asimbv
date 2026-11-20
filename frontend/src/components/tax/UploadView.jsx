import { useI18n } from '../../context/I18nContext';
import Dropzone from './Dropzone';
import OnlineFormSection from './OnlineFormSection';

const UploadView = ({ onFile }) => {
  const { t } = useI18n();

  return (
    <div className="upload-view">
      <OnlineFormSection />

      <div className="upload-divider">
        <div className="divider-line"></div>
        <span className="divider-label">{t('tax.or')}</span>
        <div className="divider-line"></div>
      </div>

      <Dropzone onFile={onFile} />
    </div>
  );
};

export default UploadView;
