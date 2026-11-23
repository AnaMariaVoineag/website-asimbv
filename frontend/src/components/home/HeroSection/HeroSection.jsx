import { useRef } from 'react';
import logoCircle from '../../../assets/logo_asimbv_circle.png';
import bgImage from '../../../assets/Corp_P.jpg';
import { useI18n } from '../../../context/I18nContext';
import { useScrollEffect } from '../../../hooks/useScrollEffect';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useI18n();
  const heroRef = useRef(null);

  // 0 at the top of the page, 1 once the hero has scrolled out of view; drives the parallax in the CSS.
  useScrollEffect((scrollY) => {
    const hero = heroRef.current;
    if (!hero) return;
    const progress = Math.min(scrollY / hero.offsetHeight, 1);
    hero.style.setProperty('--hero-progress', progress.toFixed(3));
  });

  return (
    <main ref={heroRef} className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className="hero-overlay"></div>

      <div className="hero-parallax">
        <div className="hero-content">
          <img src={logoCircle} alt={t('common.logoAlt')} className="center-seal" />
          <h1 id="text" className="main-title">{t('hero.title')}</h1>
          <h2 className="sub-title">{t('hero.subtitle')}</h2>
        </div>
      </div>

      <a href="#despre-noi" className="scroll-cue" aria-label={t('hero.scroll')}>
        <span className="scroll-cue-arrow" aria-hidden="true"></span>
      </a>
    </main>
  );
};

export default HeroSection;
