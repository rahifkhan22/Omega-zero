import React, { useEffect, useState } from 'react';
import { fetchIssues, updateIssueStatus } from '../services/api';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';

/**
 * DashboardSupervisor - Supervisor dashboard for managing and updating issue statuses.
 */
const DashboardSupervisor = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssueStatus(issueId, newStatus);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const pendingIssues = issues.filter((i) => i.status === 'reported');
  const inProgressIssues = issues.filter((i) => i.status === 'in-progress');
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Supervisor Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage and update the status of reported issues.</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
          <p className="text-yellow-800 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-900">{pendingIssues.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <p className="text-blue-800 text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold text-blue-900">{inProgressIssues.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <p className="text-green-800 text-sm font-medium">Resolved</p>
          <p className="text-3xl font-bold text-green-900">{resolvedIssues.length}</p>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Issue Locations</h2>
        <MapView issues={issues.filter((i) => i.lat && i.lng)} />
      </div>

      {/* Issue Management Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading issues...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{issue.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{issue.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      issue.status === 'reported' ? 'bg-yellow-100 text-yellow-800' :
                      issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="reported">Reported</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardSupervisor;
