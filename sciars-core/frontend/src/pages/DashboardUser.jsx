import React, { useEffect, useState } from 'react';
import { fetchIssues } from '../services/api';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';

/**
 * DashboardUser - User dashboard showing their reported issues and a map view.
 */
const DashboardUser = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredIssues = filter === 'all'
    ? issues
    : issues.filter((issue) => issue.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
      <p className="text-gray-500 mb-8">Track the status of your reported issues.</p>

      {/* Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Issue Locations</h2>
        <MapView issues={issues.filter((i) => i.lat && i.lng)} />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {['all', 'reported', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading issues...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No issues found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
