import { Link } from 'react-router-dom';
import logoText from '../../assets/logo_asimbv.png';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import FooterSocialLinks from './FooterSocialLinks';
import NewsletterForm from './NewsletterForm';
import './Footer.css';

const QUICK_LINKS = [
  { to: ROUTES.home, labelKey: 'footer.home' },
  { to: ROUTES.events, labelKey: 'footer.events' },
  { to: ROUTES.taxForm, labelKey: 'footer.redirect' },
  { to: ROUTES.contact, labelKey: 'footer.contact' },
];

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-col footer-col-brand">
            <Link to={ROUTES.home} className="footer-logo-link">
              <img src={logoText} alt={t('footer.logoAlt')} className="footer-logo" />
            </Link>
            <p className="footer-description">{t('footer.description')}</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map(({ to, labelKey }) => (
                <li key={to}><Link to={to}>{t(labelKey)}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.followUs')}</h4>
            <p className="footer-social-desc">{t('footer.socialText')}</p>
            <FooterSocialLinks />
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.newsletter')}</h4>
            <p className="footer-newsletter-text">{t('footer.newsletterText')}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="footer-legal">
            <Link to={ROUTES.privacyPolicy} className="footer-legal-link">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
