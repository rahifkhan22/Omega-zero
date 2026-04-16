import React, { useState } from 'react';
import { createIssue } from '../services/api';
import MapView from '../components/MapView';

/**
 * ReportIssue - Form for users to report a new civic issue with location and image upload.
 */
const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road',
    lat: '',
    lng: '',
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = ['road', 'water', 'electricity', 'sanitation', 'public-safety', 'other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
        },
        (err) => setError('Failed to get location. Please enter manually.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createIssue({ ...formData, image });
      setSuccess(true);
      setFormData({ title: '', description: '', category: 'road', lat: '', lng: '' });
      setImage(null);
    } catch (err) {
      setError(err.message || 'Failed to submit issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Report an Issue</h1>
      <p className="text-gray-500 mb-8">Help improve your city by reporting civic problems.</p>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          ✅ Issue reported successfully! Thank you for contributing.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g., Pothole on Main Street"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              id="lat"
              name="lat"
              type="number"
              step="any"
              value={formData.lat}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="17.3850"
              required
            />
          </div>
          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              id="lng"
              name="lng"
              type="number"
              step="any"
              value={formData.lng}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="78.4867"
              required
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
        >
          📍 Use my current location
        </button>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
