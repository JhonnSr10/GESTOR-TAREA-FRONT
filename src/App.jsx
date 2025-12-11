
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import TeamProgressPage from '@/pages/TeamProgressPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/team-progress" element={<TeamProgressPage />} />
    </Routes>
  );
}

export default App;
