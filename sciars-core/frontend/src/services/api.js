import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new issue report.
 * @param {Object} issueData - Issue details including title, description, category, lat, lng, image.
 */
export const createIssue = async (issueData) => {
  const formData = new FormData();
  Object.keys(issueData).forEach((key) => {
    if (issueData[key] !== null && issueData[key] !== undefined) {
      formData.append(key, issueData[key]);
    }
  });

  const response = await api.post('/issues', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Fetch all issues.
 * @param {string} role - User role (e.g., 'admin')
 * @returns {Array} List of issue objects.
 */
export const fetchIssues = async (role = 'admin') => {
  const response = await api.get(`/issues?role=${role}`);
  return response.data;
};

/**
 * Update the status of an issue.
 * @param {string} issueId - The issue ID.
 * @param {string} status - New status ('reported', 'in-progress', 'resolved').
 */
export const updateIssueStatus = async (issueId, status) => {
  const response = await api.put(`/issues/${issueId}/status`, { status });
  return response.data;
};

/**
 * Fetch notifications for the current user.
 * @returns {Array} List of notification objects.
 */
export const fetchNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export default api;
