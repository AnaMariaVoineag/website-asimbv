import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Navbar from './Navbar';
import EventsPage from './EventsPage';
import ContactPage from './ContactPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;