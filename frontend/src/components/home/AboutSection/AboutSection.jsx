import logoCircle from '../../../assets/logo_asimbv_circle.png';
import { useI18n } from '../../../context/I18nContext';
import { BriefcaseIcon, CodeIcon, GraduationCapIcon, UsersIcon } from '../../icons';
import './AboutSection.css';

// Same order as `about.highlights` in the dictionaries.
const HIGHLIGHT_ICONS = [GraduationCapIcon, CodeIcon, BriefcaseIcon, UsersIcon];

const AboutSection = () => {
  const { t, rich, list } = useI18n();
  const highlights = list('about.highlights');

  return (
    <section className="about-section" id="despre-noi">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-content">
            <span className="about-badge">{t('about.badge')}</span>
            <h2 className="about-title">{t('about.title')}</h2>
            <p className="about-paragraph">{rich('about.p1')}</p>
            <p className="about-paragraph">{t('about.p2')}</p>

            <div className="about-highlights-grid">
              {HIGHLIGHT_ICONS.map((Icon, index) => (
                <div key={index} className="about-highlight-card">
                  <div className="about-highlight-icon-wrapper">
                    <Icon className="about-highlight-icon" />
                  </div>
                  <div>
                    <h4 className="about-highlight-title">{highlights[index]?.title}</h4>
                    <p className="about-highlight-desc">{highlights[index]?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
