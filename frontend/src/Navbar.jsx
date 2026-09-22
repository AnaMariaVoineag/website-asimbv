import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoText from './assets/logo_asimbv.png';
import './Navbar.css';

const Navbar = () => {
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
          <img src={logoText} alt="ASIMBV Logo" className="navbar-logo" />
        </Link>

        {/* Center: Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/events" className="nav-link" onClick={closeMenu}>
              Evenimente
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/get-involved" className="nav-link nav-cta" onClick={closeMenu}>
              Înscrie-te
            </Link>
          </li>
        </ul>

        {/* Right: Hamburger Toggle (Mobile) */}
        <button 
          className={`hamburger ${menuOpen ? 'is-active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
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
