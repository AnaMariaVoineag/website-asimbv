import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Navbar from './Navbar';
import Footer from './Footer';
import EventsPage from './EventsPage';
import ContactPage from './ContactPage';
import TaxFormPage from './TaxFormPage';
import EventDetails from './EventDetails';
import PartnersPage from './PartnersPage';
import UnsubscribePage from './UnsubscribePage';
import ScrollToTop from './ScrollToTop';

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