import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { EVENT_DETAILS_PATTERN, ROUTES } from './constants/routes';
import MainPage from './pages/MainPage/MainPage';
import EventsPage from './pages/EventsPage/EventsPage';
import EventDetails from './pages/EventDetails/EventDetails';
import ContactPage from './pages/ContactPage/ContactPage';
import TaxFormPage from './pages/TaxFormPage/TaxFormPage';
import PartnersPage from './pages/PartnersPage/PartnersPage';
import UnsubscribePage from './pages/UnsubscribePage/UnsubscribePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const App = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path={ROUTES.home} element={<MainPage />} />
      <Route path={ROUTES.events} element={<EventsPage />} />
      <Route path={EVENT_DETAILS_PATTERN} element={<EventDetails />} />
      <Route path={ROUTES.contact} element={<ContactPage />} />
      <Route path={ROUTES.taxForm} element={<TaxFormPage />} />
      <Route path={ROUTES.taxFormAlias} element={<TaxFormPage />} />
      <Route path={ROUTES.partners} element={<PartnersPage />} />
      {/* Linked from the newsletter emails; the backend builds the link (App:PublicSiteUrl). */}
      <Route path={ROUTES.unsubscribe} element={<UnsubscribePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </>
);

export default App;
