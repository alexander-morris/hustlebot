import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './screens/Landing';
import AboutScreen from './screens/About';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/chat" element={<LandingPage showChat={true} />} />
      </Routes>
    </Router>
  );
} 