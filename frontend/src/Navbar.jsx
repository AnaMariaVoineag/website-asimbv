import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
import logoText from './assets/logo_asimbv.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoText} alt="ASIMBV Logo Text" className="header-logo" />
        </Link>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <NavLink 
          to="/" 
          // NavLink știe automat dacă ruta este activă și aplică o clasă
          className={({ isActive }) => isActive ? "active-link" : ""}
          onClick={() => setIsMenuOpen(false)}
        >
          Acasă
        </NavLink>
        <NavLink 
          to="/events" 
          className={({ isActive }) => isActive ? "active-link" : ""}
          onClick={() => setIsMenuOpen(false)}
        >
          Evenimente
        </NavLink>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;