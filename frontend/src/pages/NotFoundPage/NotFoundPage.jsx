import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon } from '../../components/icons';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('notFound.pageTitle'));

  return (
    <div className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-code" aria-hidden="true">
          <span>4</span>
          <span className="not-found-zero">0</span>
          <span>4</span>
        </div>

        <h1 className="not-found-title">{t('notFound.title')}</h1>
        <p className="not-found-text">{t('notFound.text')}</p>

        <div className="not-found-actions">
          <Link to={ROUTES.home} className="not-found-btn not-found-btn-primary">
            <ArrowLeftIcon size={18} />
            <span>{t('notFound.home')}</span>
          </Link>
          <Link to={ROUTES.events} className="not-found-btn not-found-btn-secondary">
            <CalendarIcon size={18} />
            <span>{t('notFound.events')}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
