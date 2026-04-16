import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import DashboardUser from './pages/DashboardUser';
import DashboardSupervisor from './pages/DashboardSupervisor';
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/dashboard/user" element={<DashboardUser />} />
          <Route path="/dashboard/supervisor" element={<DashboardSupervisor />} />
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
