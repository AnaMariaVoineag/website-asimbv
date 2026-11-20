import { CheckIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';
import { OCR_STEPS } from '../../constants/tax';

const ProcessingView = ({ fileName, currentStepIndex, progressPercent }) => {
  const { t, list } = useI18n();
  const stepLabels = list('tax.processing.steps');

  return (
    <div className="processing-view">
      <div className="ocr-scanner-visual">
        <div className="doc-sheet">
          <div className="doc-line line-1"></div>
          <div className="doc-line line-2"></div>
          <div className="doc-line line-3"></div>
          <div className="doc-line line-4"></div>
          <div className="doc-stamp">ANAF 230</div>
          <div className="scanning-laser"></div>
        </div>
      </div>

      <h2 className="processing-title">{t('tax.processing.title')}</h2>
      <p className="processing-filename">
        {t('tax.processing.document')}
        <strong>{fileName || 'Formular_230.pdf'}</strong>
      </p>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <div className="progress-percentage-label">{t('tax.processing.done', { percent: progressPercent })}</div>

      <div className="ocr-steps-list">
        {OCR_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          return (
            <div
              key={step.id}
              className={`ocr-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
            >
              <div className="step-circle">
                {isCompleted ? (
                  <CheckIcon size={14} strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="step-spinner"></span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="step-label">{stepLabels[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingView;
