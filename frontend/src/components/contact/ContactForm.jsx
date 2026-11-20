import { SendIcon } from '../icons';
import { MESSAGE_MAX_LENGTH, SUBJECT_OPTIONS } from '../../constants/contact';
import { useI18n } from '../../context/I18nContext';
import { useContactForm } from '../../hooks/useContactForm';
import FormField from './FormField';
import StatusBanner from './StatusBanner';

const ContactForm = () => {
  const { t } = useI18n();
  const { values, errors, touched, isSubmitting, submitStatus, handleChange, handleBlur, handleSubmit } =
    useContactForm();

  // Props shared by every field wrapper and control.
  const fieldProps = (name) => ({ touched: touched[name], error: errors[name] });
  const controlProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: () => handleBlur(name),
  });

  return (
    <section className="contact-form-card">
      <div className="card-header-block">
        <h2 className="form-heading">{t('contact.formHeading')}</h2>
        <p className="form-subheading">{t('contact.formSubheading')}</p>
      </div>

      <StatusBanner status={submitStatus} />

      <form onSubmit={handleSubmit} noValidate className="contact-form">
        <FormField id="name" label="contact.nameLabel" {...fieldProps('name')}>
          <input
            type="text"
            className="form-input"
            maxLength="100"
            placeholder={t('contact.namePlaceholder')}
            {...controlProps('name')}
          />
        </FormField>

        <FormField id="email" label="contact.emailLabel" {...fieldProps('email')}>
          <input
            type="email"
            className="form-input"
            maxLength="254"
            placeholder={t('contact.emailPlaceholder')}
            {...controlProps('email')}
          />
        </FormField>

        <FormField id="subject" label="contact.subjectLabel" {...fieldProps('subject')}>
          <select className="form-select" {...controlProps('subject')}>
            <option value="">{t('contact.subjectPlaceholder')}</option>
            {SUBJECT_OPTIONS.map((subject) => (
              <option key={subject} value={subject}>
                {t(`contact.subjects.${subject}`)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="message"
          label="contact.messageLabel"
          showValidIcon={false}
          labelAside={
            <span className="char-counter">
              {values.message.length} / {MESSAGE_MAX_LENGTH}
            </span>
          }
          {...fieldProps('message')}
        >
          <textarea
            rows="5"
            maxLength={MESSAGE_MAX_LENGTH}
            className="form-textarea"
            placeholder={t('contact.messagePlaceholder')}
            {...controlProps('message')}
          ></textarea>
        </FormField>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="btn-spinner"></span>
              <span>{t('contact.sending')}</span>
            </>
          ) : (
            <>
              <span>{t('contact.send')}</span>
              <SendIcon className="btn-send-icon" size={18} />
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
