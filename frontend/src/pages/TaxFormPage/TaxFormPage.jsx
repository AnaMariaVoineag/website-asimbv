import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFormular230Script } from '../../hooks/useFormular230Script';
import { useTaxFormUpload } from '../../hooks/useTaxFormUpload';
import BenefitsStrip from '../../components/tax/BenefitsStrip';
import ErrorView from '../../components/tax/ErrorView';
import ProcessingView from '../../components/tax/ProcessingView';
import SuccessView from '../../components/tax/SuccessView';
import TaxHeader from '../../components/tax/TaxHeader';
import UploadView from '../../components/tax/UploadView';
import './TaxFormPage.css';

const TaxFormPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('tax.pageTitle'));
  useFormular230Script();
  const upload = useTaxFormUpload();

  return (
    <div className="tax-page-container">
      <TaxHeader />
      <BenefitsStrip />

      <main className="tax-main-card">
        {upload.state === 'idle' && <UploadView onFile={upload.processFile} />}

        {upload.state === 'processing' && (
          <ProcessingView
            fileName={upload.file?.name}
            currentStepIndex={upload.currentStepIndex}
            progressPercent={upload.progressPercent}
          />
        )}

        {upload.state === 'error' && <ErrorView message={upload.errorMessage} onRetry={upload.reset} />}

        {upload.state === 'success' && (
          <SuccessView data={upload.extractedData} onFieldChange={upload.updateField} onReset={upload.reset} />
        )}
      </main>
    </div>
  );
};

export default TaxFormPage;
