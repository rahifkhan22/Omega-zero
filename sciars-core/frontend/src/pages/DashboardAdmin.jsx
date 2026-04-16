import React, { useEffect, useState } from 'react';
import { fetchIssues } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MapView from '../components/MapView';

/**
 * DashboardAdmin - Admin dashboard with Recharts analytics, category breakdowns, and overview stats.
 */
const DashboardAdmin = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        console.error('Failed to load issues:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  // Prepare analytics data
  const statusData = [
    { name: 'Reported', count: issues.filter((i) => i.status === 'reported').length },
    { name: 'In Progress', count: issues.filter((i) => i.status === 'in-progress').length },
    { name: 'Resolved', count: issues.filter((i) => i.status === 'resolved').length },
  ];

  const categoryData = issues.reduce((acc, issue) => {
    const existing = acc.find((item) => item.name === issue.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: issue.category || 'Other', count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Analytics overview and system-wide issue management.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading analytics...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-5">
              <p className="text-gray-500 text-sm">Total Issues</p>
              <p className="text-3xl font-bold text-gray-800">{issues.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow-md p-5 border border-yellow-200">
              <p className="text-yellow-700 text-sm">Reported</p>
              <p className="text-3xl font-bold text-yellow-900">{statusData[0].count}</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-md p-5 border border-blue-200">
              <p className="text-blue-700 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-900">{statusData[1].count}</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow-md p-5 border border-green-200">
              <p className="text-green-700 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-900">{statusData[2].count}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart - Status Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Issues by Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Category Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Issues by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Map */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">City-Wide Issue Map</h2>
            <MapView issues={issues.filter((i) => i.lat && i.lng)} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAdmin;
