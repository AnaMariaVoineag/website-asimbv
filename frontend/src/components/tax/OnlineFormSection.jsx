import { Fragment } from 'react';
import { ArrowRightIcon, FileIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';

// Option A: fill in the form online through the formular230.ro widget.
const OnlineFormSection = () => {
  const { t, list } = useI18n();
  const steps = list('tax.online.steps');

  return (
    <div className="f230-online-section">
      <div className="f230-online-header">
        <div className="f230-online-badge">{t('tax.online.recommended')}</div>
        <h2 className="f230-online-title">{t('tax.online.title')}</h2>
        <p className="f230-online-desc">{t('tax.online.description')}</p>
      </div>

      <div className="f230-button-wrapper">
        <button type="button" className="f230ro-lansare f230-primary-cta">
          <FileIcon size={20} />
          <span>{t('tax.online.button')}</span>
          <ArrowRightIcon size={16} className="cta-arrow" />
        </button>
        {/* Embed container used by the formular230.ro script. */}
        <div id="f230ro-formular"></div>
      </div>

      <div className="f230-steps-inline">
        {steps.slice(0, 3).map((step, index) => (
          <Fragment key={index}>
            {index > 0 && <div className="f230-step-sep">→</div>}
            <div className="f230-step-inline">
              <span className="f230-step-num">{index + 1}</span>
              <span>{step}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default OnlineFormSection;
