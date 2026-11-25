import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoText from '../../assets/logo_asimbv.png';
import { ROUTES } from '../../constants/routes';
import { useI18n } from '../../context/I18nContext';
import { useScrolled } from '../../hooks/useScrolled';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Navbar.css';

const SCROLL_THRESHOLD = 30;

const NAV_LINKS = [
  { to: ROUTES.home, labelKey: 'nav.home' },
  { to: ROUTES.events, labelKey: 'nav.events' },
  { to: ROUTES.taxForm, labelKey: 'nav.support' },
];

const Navbar = () => {
  const { t } = useI18n();
  const scrolled = useScrolled(SCROLL_THRESHOLD);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to={ROUTES.home} className="navbar-logo-link" onClick={closeMenu}>
          <img src={logoText} alt={t('nav.logoAlt')} className="navbar-logo-img" />
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {NAV_LINKS.map(({ to, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
              onClick={closeMenu}
            >
              {t(labelKey)}
            </NavLink>
          ))}
          <LanguageSwitcher />
          <NavLink to={ROUTES.contact} className="nav-link nav-cta" onClick={closeMenu}>
            {t('nav.contact')}
          </NavLink>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'is-active' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t('nav.toggleMenu')}
          aria-expanded={menuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
