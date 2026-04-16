import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard/admin" className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-colors">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            SCIARS Admin
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
              Dashboard
            </Link>
            <Link to="/issues" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
              All Issues
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors" aria-label="Notifications">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
