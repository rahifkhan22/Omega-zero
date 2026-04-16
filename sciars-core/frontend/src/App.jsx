<<<<<<< Updated upstream
function App() {
  return (
    <div>
      <h1>Hello SCIARS</h1>
      <p>App is working</p>
    </div>
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import UserNavbar from './components/UserNavbar';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import AllIssues from './pages/AllIssues';
import DashboardUser from './pages/DashboardUser';
import DashboardSupervisor from './pages/DashboardSupervisor';
import DashboardAdmin from './pages/DashboardAdmin';
import DemoModules from './pages/DemoModules';

const NavbarWrapper = () => {
  const location = useLocation();
  
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }
  
  if (location.pathname.startsWith('/dashboard/admin') || location.pathname === '/issues') {
    return <AdminNavbar />;
  }
  
  return <UserNavbar />;
};

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/issues" element={<AllIssues />} />
          <Route path="/dashboard/user" element={<DashboardUser />} />
          <Route path="/dashboard/supervisor" element={<DashboardSupervisor />} />
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route path="/demo" element={<DemoModules />} />
        </Routes>
      </main>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
