import React, { useEffect, useState } from 'react';
import { fetchIssues } from '../services/api';

const MOCK_ISSUES = [
  { id: 'mock-1', category: 'Electrical', description: 'Streetlight not working near the main gate entrance. Causes safety concerns at night.', status: 'Open', location: { lat: 17.3950, lng: 78.4867, text: 'Main Gate' }, createdAt: '2026-04-10T08:00:00Z' },
  { id: 'mock-2', category: 'Plumbing', description: 'Water leakage in the second floor washroom. Flooding the corridor.', status: 'In Progress', location: { lat: 17.3855, lng: 78.4880, text: 'Science Block - 2nd Floor' }, createdAt: '2026-04-09T10:30:00Z' },
  { id: 'mock-3', category: 'Furniture', description: 'Broken chairs in Room 301. Three chairs have missing backrests.', status: 'Closed', location: { lat: 17.3840, lng: 78.4850, text: 'Arts Building - Room 301' }, createdAt: '2026-04-05T09:00:00Z' },
  { id: 'mock-4', category: 'Cleaning', description: 'Restroom in library basement is not maintained properly.', status: 'Closed', location: { lat: 17.3860, lng: 78.4900, text: 'Central Library - Basement' }, createdAt: '2026-04-01T07:00:00Z' },
  { id: 'mock-5', category: 'Electrical', description: 'Fan not working in Lecture Hall 2. Students complaining about heat.', status: 'Open', location: { lat: 17.3845, lng: 78.4870, text: 'Lecture Hall 2' }, createdAt: '2026-04-14T11:00:00Z' },
  { id: 'mock-6', category: 'Network', description: 'Wi-Fi connectivity issues in the hostel common room.', status: 'In Progress', location: { lat: 17.3835, lng: 78.4840, text: 'Hostel Block A - Common Room' }, createdAt: '2026-04-13T15:30:00Z' },
  { id: 'mock-7', category: 'Electrical', description: 'Power outlet not working in Computer Lab.', status: 'Closed', location: { lat: 17.3842, lng: 78.4860, text: 'Computer Lab' }, createdAt: '2026-04-03T10:00:00Z' },
];

const STATUS_COLORS = {
  Open: 'bg-red-100 text-red-600',
  'In Progress': 'bg-yellow-100 text-yellow-600',
  Closed: 'bg-green-100 text-green-600',
};

const STATUS_DOT = {
  Open: 'bg-red-500',
  'In Progress': 'bg-yellow-500',
  Closed: 'bg-green-500',
};

const FILTER_OPTIONS = ['All', 'Open', 'In Progress', 'Closed'];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-md p-5 transition-all duration-200 hover:shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const IssueCard = ({ issue }) => {
  const statusColor = STATUS_COLORS[issue.status] || 'bg-gray-100 text-gray-600';
  const statusDot = STATUS_DOT[issue.status] || 'bg-gray-500';

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
          {issue.category || 'Uncategorized'}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          {issue.status}
        </span>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">
        {issue.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {issue.location?.text || 'Unknown'}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(issue.createdAt)}
        </span>
      </div>
    </Card>
  );
};

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchIssues('user');
        setIssues(Array.isArray(data) && data.length > 0 ? data : MOCK_ISSUES);
      } catch {
        setIssues(MOCK_ISSUES);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const filteredIssues = filter === 'All'
    ? issues
    : issues.filter(issue => issue.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading issues…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Issues</h1>
          <p className="text-gray-500 mt-1">View all reported campus issues</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredIssues.length === 0 ? (
          <Card className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-semibold text-gray-600">No issues found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'All' ? 'No issues have been reported yet.' : `No issues with status "${filter}".`}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIssues;
