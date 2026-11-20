import { CheckCircleIcon, DollarIcon, ZapIcon } from '../icons';
import { useI18n } from '../../context/I18nContext';

// Same order as `tax.benefits` in the dictionaries.
const BENEFIT_ICONS = [DollarIcon, ZapIcon, CheckCircleIcon];

const BenefitsStrip = () => {
  const { list } = useI18n();
  const benefits = list('tax.benefits');

  return (
    <div className="tax-benefits-strip">
      {BENEFIT_ICONS.map((Icon, index) => (
        <div key={index} className="benefit-item">
          <div className="benefit-icon">
            <Icon size={20} />
          </div>
          <div>
            <strong>{benefits[index]?.title}</strong>
            <p>{benefits[index]?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsStrip;
