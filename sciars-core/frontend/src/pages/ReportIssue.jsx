import React, { useState } from 'react';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Furniture',
  'Cleaning',
  'Network',
  'Security',
  'Other'
];

const LOCATIONS = [
  'Main Gate',
  'Science Block - 1st Floor',
  'Science Block - 2nd Floor',
  'Science Block - 3rd Floor',
  'Arts Building - Room 101',
  'Arts Building - Room 201',
  'Arts Building - Room 301',
  'Central Library - Ground Floor',
  'Central Library - 1st Floor',
  'Central Library - Basement',
  'Lecture Hall 1',
  'Lecture Hall 2',
  'Computer Lab',
  'Hostel Block A - Room 101',
  'Hostel Block A - Common Room',
  'Hostel Block B - Room 201',
  'Cafeteria',
  'Administrative Block',
  'Sports Ground',
  'Parking Area'
];

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ category: '', description: '', location: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Report an Issue</h1>
          <p className="text-gray-500 mb-6">Submit a new issue report for the campus</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 font-medium">Issue reported successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a location</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
