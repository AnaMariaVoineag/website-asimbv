import { LANGUAGES, useI18n } from './i18n/I18nProvider';
import './LanguageSwitcher.css';

// Small RO | EN toggle. Lives in the navbar; the choice is remembered between visits.
const LanguageSwitcher = ({ onChange }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="lang-switcher" role="group" aria-label={t('nav.language')}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          aria-pressed={lang === code}
          lang={code}
          onClick={() => {
            setLang(code);
            onChange?.();
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
