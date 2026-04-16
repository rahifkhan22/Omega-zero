import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";

export default function DashboardUser() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = [
    { label: "Total Reported", value: "24", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "bg-blue-500" },
    { label: "In Progress", value: "8", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-yellow-500" },
    { label: "Resolved", value: "16", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-500" },
  ];

  const recentIssues = [
    { id: 1, title: "Pothole on Main Street", description: "Large pothole causing traffic hazards near the intersection.", status: "reported", location: "123 Main St", createdAt: "2 hours ago", lat: 34.0522, lng: -118.2437 },
    { id: 2, title: "Broken Street Light", description: "Street light not working for past 3 days, area is dark at night.", status: "in-progress", location: "456 Oak Ave", createdAt: "1 day ago", lat: 34.0532, lng: -118.2447 },
    { id: 3, title: "Graffiti on Public Wall", description: "Vandalism reported on community center exterior wall.", status: "resolved", location: "789 Community Center", createdAt: "3 days ago", lat: 34.0512, lng: -118.2427 },
    { id: 4, title: "Drainage Blockage", description: "Storm drain clogged causing water accumulation.", status: "reported", location: "321 Elm Blvd", createdAt: "5 hours ago", lat: 34.0542, lng: -118.2457 },
  ];

  const filters = [
    { id: "all", label: "Total Issues Reported" },
    { id: "reported", label: "Reported" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
  ];

  const filteredIssues = selectedFilter === "all" 
    ? recentIssues 
    : recentIssues.filter(issue => issue.status === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="mt-1 text-gray-500">Track and manage your reported civic issues</p>
          </div>
          <button
            onClick={() => navigate("/report")}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Report New Issue
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 p-4">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Issue List</h2>
              {filteredIssues.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
                  <p className="mt-1 text-sm text-gray-500">No issues match your current filter.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sticky top-6 self-start">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Issue Map</h2>
              <MapView className="h-[600px] border border-gray-200" issues={filteredIssues.filter((i) => i.lat && i.lng)} interactive={false} />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">Want to make a difference?</h3>
              <p className="text-primary-100">Report an issue in your community and help improve your neighborhood.</p>
            </div>
            <button
              onClick={() => navigate("/report")}
              className="mt-4 md:mt-0 bg-white text-primary-600 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
