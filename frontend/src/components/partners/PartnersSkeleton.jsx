import { useI18n } from '../../context/I18nContext';
import './PartnersSkeleton.css';

const PLACEHOLDER_TILES = 4;

// Same footprint as a partners section, so the page does not jump when the real partners arrive.
const PartnersSkeleton = () => {
  const { t } = useI18n();

  return (
    <section className="partners-section partners-skeleton" role="status" aria-busy="true" aria-label={t('partners.loading')}>
      <div className="partners-skeleton-title"></div>
      <div className="partner-tiles-row">
        {Array.from({ length: PLACEHOLDER_TILES }, (_, index) => (
          <div key={index} className="partner-tile partner-tile-skeleton"></div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSkeleton;
