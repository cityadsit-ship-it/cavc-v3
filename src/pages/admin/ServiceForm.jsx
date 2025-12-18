import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../lib/api-config';

const ServiceForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    folder: '',
    pdfFileName: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        folder: service.folder || '',
        pdfFileName: service.pdfFileName || '',
      });
    }
  }, [service]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('type', 'service');

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPdfFile(file);
        setFormData(prev => ({ ...prev, pdfFileName: data.filename }));
      } else {
        setError('Failed to upload PDF');
      }
    } catch (err) {
      setError('Failed to upload PDF. Please ensure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if PDF is required for new services
    if (!service && !formData.pdfFileName) {
      setError('Please upload a PDF file before creating the service');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = service
        ? API_ENDPOINTS.SERVICE(service.id)
        : API_ENDPOINTS.SERVICES;

      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose(true); // Pass true to indicate successful save
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save service');
      }
    } catch (err) {
      setError('Failed to connect to server. Please ensure the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {service ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Billboards"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Brief description of the service"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name *
                </label>
                <input
                  type="text"
                  value={formData.folder}
                  onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., billboards"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Images will be stored in /images/services/[folder-name]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service PDF {!service && '*'}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition text-center">
                      {uploading ? (
                        <span className="text-gray-600">Uploading...</span>
                      ) : formData.pdfFileName ? (
                        <span className="text-green-600">✓ {formData.pdfFileName}</span>
                      ) : (
                        <span className="text-gray-600">Click to upload PDF</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                {!service && (
                  <p className="mt-1 text-sm text-red-600">
                    * PDF file must be uploaded before creating the service
                  </p>
                )}
                {formData.pdfFileName && (
                  <p className="mt-1 text-sm text-gray-500">
                    Current file: {formData.pdfFileName}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
