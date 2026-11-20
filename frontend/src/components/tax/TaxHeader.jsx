import { useI18n } from '../../context/I18nContext';

const TaxHeader = () => {
  const { t } = useI18n();

  return (
    <header className="tax-header">
      <span className="tax-badge">{t('tax.badge')}</span>
      <h1 className="tax-title">{t('tax.title')}</h1>
      <p className="tax-subtitle">{t('tax.subtitle')}</p>
    </header>
  );
};

export default TaxHeader;
