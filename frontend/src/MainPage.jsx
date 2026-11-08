import { useEffect } from 'react';
import './MainPage.css';
import AboutSection from './AboutSection';
import LatestEvents from './LatestEvents';
import FeatureCards from './FeatureCards';
import logoCircle from './assets/logo_asimbv_circle.png';
import bgImage from './assets/Corp_P.jpg';
import { useI18n } from './i18n/I18nProvider';

const MainPage = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = "ASIMBV | Main Page";
  }, []);
  
  return (
    <div className="main-page">
      <main 
        className="hero-section" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <img src={logoCircle} alt={t('common.logoAlt')} className="center-seal" />
          <h1 id="text" className="main-title">{t('hero.title')}</h1>
          <h2 className="sub-title">{t('hero.subtitle')}</h2>
        </div>
      </main>

      <AboutSection />
      <LatestEvents />
      <FeatureCards />
    </div>
  );
};

export default MainPage;