import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoText from './assets/logo_asimbv.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from './i18n/I18nProvider';
import './Navbar.css';

const Navbar = () => {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left: Brand Logo */}
        <Link to="/" className="navbar-logo-link" onClick={closeMenu}>
          <img src={logoText} alt={t('nav.logoAlt')} className="navbar-logo-img" />
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.events')}
          </NavLink>
          <NavLink
            to="/parteneri"
            className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.partners')}
          </NavLink>

          <NavLink
            to="/formular-230"
            className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
            onClick={closeMenu}
          >
            {t('nav.support')}
          </NavLink>
          <LanguageSwitcher />
          <NavLink
            to="/contact"
            className="nav-link nav-cta"
            onClick={closeMenu}
          >
            {t('nav.contact')}
          </NavLink>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`hamburger ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
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
