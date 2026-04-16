import React from 'react';

/**
 * IssueCard - Displays a single civic issue with its details and status.
 * @param {Object} props
 * @param {Object} props.issue - The issue object containing title, description, status, etc.
 */
const IssueCard = ({ issue }) => {
  const statusColors = {
    reported: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{issue?.title || 'Untitled Issue'}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[issue?.status] || 'bg-gray-100 text-gray-600'}`}>
          {issue?.status || 'unknown'}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{issue?.description || 'No description provided.'}</p>
      {issue?.imageUrl && (
        <img src={issue.imageUrl} alt="Issue" className="w-full h-40 object-cover rounded-lg mb-3" />
      )}
      <div className="flex items-center text-xs text-gray-400 gap-3">
        <span>📍 {issue?.location || 'Unknown location'}</span>
        <span>📅 {issue?.createdAt || 'N/A'}</span>
      </div>
    </div>
  );
};

export default IssueCard;
