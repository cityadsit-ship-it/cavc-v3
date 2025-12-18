import { useState, useEffect } from 'react';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../lib/api-config';

const Dashboard = () => {
  const [locationCount, setLocationCount] = useState(0);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
    fetchActivityLogs();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LOCATIONS);
      if (response.ok) {
        const data = await response.json();
        const total = data.metroManila.length + data.provincial.length;
        setLocationCount(total);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ACTIVITY_LOGS);
      if (response.ok) {
        const data = await response.json();
        setActivityLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'text-green-600 bg-green-50';
      case 'updated': return 'text-blue-600 bg-blue-50';
      case 'deleted': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Services
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">6</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Locations
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">{locationCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Items
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">6</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Last Modified
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">Today</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/services"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Services</h3>
              <p className="text-sm text-gray-500">Add, edit, or delete services</p>
            </div>
          </a>

          <a
            href="/admin/locations"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">
              <MapPinIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Locations</h3>
              <p className="text-sm text-gray-500">Add, edit, or delete locations</p>
            </div>
          </a>

          <a
            href="/admin/pdfs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage PDFs</h3>
              <p className="text-sm text-gray-500">Update company and service PDFs</p>
            </div>
          </a>

          <a
            href="/admin/services"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Images</h3>
              <p className="text-sm text-gray-500">Add new images to gallery</p>
            </div>
          </a>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClockIcon className="h-6 w-6 text-gray-600" />
            Activity Logs
          </h2>
          <span className="text-sm text-gray-500">Read-only</span>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No activity logs yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activityLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                  {log.action.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{log.entity}</p>
                  <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
