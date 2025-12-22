import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../lib/api-config';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showRetry, setShowRetry] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowRetry(false);
    setLoadingMessage('Connecting to server...');

    try {
      // Set a timeout for the connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000); // 15 second timeout

      setLoadingMessage('Authenticating...');
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setLoadingMessage('Processing response...');

      const data = await response.json();

      if (data.success) {
        setLoadingMessage('Login successful! Redirecting...');
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.user.username);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        setError(data.message || 'Invalid username or password');
        setShowRetry(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'AbortError') {
        setError('Connection timeout. The server is taking too long to respond. Please try again.');
        setShowRetry(true);
      } else if (error.message.includes('fetch')) {
        setError('Unable to connect to the server. Please check:\n• Backend server is running\n• Network connection is stable\n• Server URL is correct');
        setShowRetry(true);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setShowRetry(true);
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CAVC Admin</h1>
          <p className="text-gray-600">Content Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Connection Error</p>
                  <p className="text-sm whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loadingMessage && (
            <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-sm font-medium">{loadingMessage}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Please wait...
              </>
            ) : (
              'Login'
            )}
          </button>

          {showRetry && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Retry Connection
            </button>
          )}
        </form>

        {/* Server Status Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-gray-800 font-medium">
              Troubleshooting Connection Issues
            </summary>
            <div className="mt-3 space-y-2 text-xs bg-gray-50 p-3 rounded-lg">
              <p><strong>If you're having connection issues:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ensure the backend server is running</li>
                <li>Check if you're connected to the internet</li>
                <li>Verify the API URL in your environment settings</li>
                <li>Try refreshing the page</li>
                <li>Clear browser cache and cookies</li>
              </ul>
              <p className="mt-2 text-gray-500">
                Default server: <code className="bg-gray-200 px-1 py-0.5 rounded">http://localhost:3001</code>
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
