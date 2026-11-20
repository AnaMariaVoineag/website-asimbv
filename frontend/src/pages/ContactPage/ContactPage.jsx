import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import ContactForm from '../../components/contact/ContactForm';
import QuickInfoCard from '../../components/contact/QuickInfoCard';
import SocialQrCard from '../../components/contact/SocialQrCard';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('contact.pageTitle'));

  return (
    <div className="contact-page-container">
      <header className="contact-header">
        <span className="contact-badge">{t('contact.badge')}</span>
        <h1 className="contact-title">{t('contact.title')}</h1>
        <p className="contact-subtitle">{t('contact.subtitle')}</p>
      </header>

      <div className="contact-layout-grid">
        <ContactForm />
        <aside className="contact-sidebar">
          <SocialQrCard />
          <QuickInfoCard />
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
