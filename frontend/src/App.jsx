import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Navbar from './Navbar';
import EventsPage from './EventsPage';
import ContactPage from './ContactPage';
import TaxFormPage from './TaxFormPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/formular-230" element={<TaxFormPage />} />
        <Route path="/redirectioneaza-3.5" element={<TaxFormPage />} />
      </Routes>
    </>
  );
}

export default App;