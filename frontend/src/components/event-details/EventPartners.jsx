import PartnerTile from '../PartnerTile/PartnerTile';
import { useI18n } from '../../context/I18nContext';
import { translateRole } from '../../dictionaries/eventTranslations';
import { groupByRole } from '../../utils/events';

const EventPartners = ({ partners }) => {
  const { lang } = useI18n();

  if (partners.length === 0) return null;

  return (
    <section className="event-partners-card">
      {groupByRole(partners).map(([role, members]) => (
        <div key={role}>
          <h2 className="section-label event-partners-label">{translateRole(role, lang)}</h2>
          <div className="partner-tiles-row">
            {members.map((partner) => (
              <PartnerTile key={partner.name} partner={partner} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default EventPartners;
