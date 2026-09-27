import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Navbar from './Navbar';
import EventsPage from './EventsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </>
  );
}

export default App;