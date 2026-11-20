import AboutSection from '../../components/home/AboutSection/AboutSection';
import FeatureCards from '../../components/home/FeatureCards/FeatureCards';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import LatestEvents from '../../components/home/LatestEvents/LatestEvents';
import { useI18n } from '../../context/I18nContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './MainPage.css';

const MainPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('home.pageTitle'));

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
