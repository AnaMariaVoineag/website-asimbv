import logoCircle from '../../../assets/logo_asimbv_circle.png';
import bgImage from '../../../assets/Corp_P.jpg';
import { useI18n } from '../../../context/I18nContext';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <main className="hero-section" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <img src={logoCircle} alt={t('common.logoAlt')} className="center-seal" />
        <h1 id="text" className="main-title">{t('hero.title')}</h1>
        <h2 className="sub-title">{t('hero.subtitle')}</h2>
      </div>

      <a href="#despre-noi" className="scroll-cue" aria-label={t('hero.scroll')}>
        <span className="scroll-cue-arrow" aria-hidden="true"></span>
      </a>
    </main>
  );
};

export default HeroSection;
