import AboutSection from '../../components/home/AboutSection/AboutSection';
import FeatureCards from '../../components/home/FeatureCards/FeatureCards';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import LatestEvents from '../../components/home/LatestEvents/LatestEvents';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './MainPage.css';

const MainPage = () => {
  useDocumentTitle('ASIMBV | Main Page');

  return (
    <div className="main-page">
      <HeroSection />
      <AboutSection />
      <LatestEvents />
      <FeatureCards />
    </div>
  );
};

export default MainPage;
