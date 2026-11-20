import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';

// Full-page message with a way back, used for the "not found" and "error" states.
const EventMessageCard = ({ titleKey, textKey }) => {
  const { t } = useI18n();

  return (
    <div className="event-details-card event-message-card">
      <h2>{t(titleKey)}</h2>
      <p>{t(textKey)}</p>
      <Link to={ROUTES.events} className="event-back-btn">
        {t('eventDetails.backToAll')}
      </Link>
    </div>
  );
};

export default EventMessageCard;
