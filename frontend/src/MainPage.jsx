import React, { useEffect } from 'react';
import './MainPage.css';
import AboutSection from './AboutSection';
import PastEventsSection from './PastEventsSection';
import FeatureCards from './FeatureCards';
import Footer from './Footer';
import logoCircle from './assets/logo_asimbv_circle.png';
import bgImage from './assets/Corp_P.jpg';

const MainPage = () => {
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
          <img src={logoCircle} alt="Sigla ASIMBV" className="center-seal" />
          <h1 id="text" className="main-title">ASIM BRAȘOV</h1>
          <h2 className="sub-title">ASOCIAȚIA STUDENȚILOR LA INFORMATICĂ ȘI MATEMATICĂ BRAȘOV</h2>
        </div>
      </main>

      <AboutSection />
      <PastEventsSection />
      <FeatureCards />
      <Footer />
    </div>
  );
};

export default MainPage;