import logoCircle from './assets/logo_asimbv_circle.png';
import { useI18n } from './i18n/I18nProvider';
import './AboutSection.css';

const highlights = [
  {
    id: 1,
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    )
  },
  {
    id: 2,
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    id: 3,
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    id: 4,
    icon: (
      <svg className="about-highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  }
];

const AboutSection = () => {
  const { t, rich, list } = useI18n();
  const texts = list('about.highlights');

  return (
    <section className="about-section" id="despre-noi">
      <div className="about-container">
        <div className="about-grid">
          {/* Left Column: Text & Highlights */}
          <div className="about-content">
            <span className="about-badge">{t('about.badge')}</span>
            <h2 className="about-title">{t('about.title')}</h2>
            <p className="about-paragraph">
              {rich('about.p1')}
            </p>
            <p className="about-paragraph">
              {t('about.p2')}
            </p>

            <div className="about-highlights-grid">
              {highlights.map((item) => (
                <div key={item.id} className="about-highlight-card">
                  <div className="about-highlight-icon-wrapper">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="about-highlight-title">{texts[item.id - 1]?.title}</h4>
                    <p className="about-highlight-desc">{texts[item.id - 1]?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Brand Card */}
          <div className="about-visual">
            <div className="about-visual-card">
              <div className="about-visual-glow"></div>
              <img src={logoCircle} alt={t('common.logoAlt')} className="about-visual-seal" />
              <div className="about-visual-badge">
                <span className="about-visual-tag">{t('about.tag')}</span>
                <h3 className="about-visual-name">{t('about.name')}</h3>
                <p className="about-visual-quote">{t('about.quote')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
