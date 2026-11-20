import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import EventsPage from './pages/EventsPage/EventsPage';
import ContactPage from './pages/ContactPage/ContactPage';
import TaxFormPage from './pages/TaxFormPage/TaxFormPage';
import EventDetails from './pages/EventDetails/EventDetails';
import PartnersPage from './pages/PartnersPage/PartnersPage';
import UnsubscribePage from './pages/UnsubscribePage/UnsubscribePage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/formular-230" element={<TaxFormPage />} />
        <Route path="/redirectioneaza-3.5" element={<TaxFormPage />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/parteneri" element={<PartnersPage />} />
        {/* Linked from the newsletter emails; the backend builds the link (App:PublicSiteUrl). */}
        <Route path="/dezabonare" element={<UnsubscribePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;