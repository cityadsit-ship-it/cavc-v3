import { useState, useEffect } from 'react';
import { KeyIcon, EnvelopeIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [adminData, setAdminData] = useState({ username: '', email: '', lastPasswordChange: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin');
      if (response.ok) {
        const data = await response.json();
        console.log('Admin data fetched:', data);
        setAdminData(data);
        setEmail(data.email || '');
      } else {
        console.error('Failed to fetch admin data - Response not OK:', response.status);
        setMessage({ type: 'error', text: 'Failed to load admin data. Please ensure the server is running.' });
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setMessage({ type: 'error', text: 'Cannot connect to server. Please ensure the server is running on port 3001.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchAdminData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email updated successfully' });
        fetchAdminData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update email' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Settings</h1>

      {/* Message Banner */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Account Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-lg text-gray-900">{adminData.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Password Change</label>
              <p className="mt-1 text-sm text-gray-600">{formatDate(adminData.lastPasswordChange)}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <KeyIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Email Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <EnvelopeIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
          </div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Future Feature:</strong> Email notifications and password recovery will be linked to this email address.
            </p>
          </div>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-4 py-2 border"
                required
              />
              <p className="mt-1 text-xs text-gray-500">This email will be used for future notifications and account recovery</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">Security Recommendations</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Use a strong password with a mix of letters, numbers, and symbols</li>
            <li>Change your password regularly (recommended every 3-6 months)</li>
            <li>Never share your admin credentials with anyone</li>
            <li>Log out when finished managing the website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
