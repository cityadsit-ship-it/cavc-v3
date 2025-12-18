import { useState, useEffect } from 'react';
import { DocumentIcon, ArrowUpTrayIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNotification, NotificationContainer } from '../../components/Notification';
import { API_ENDPOINTS } from '../../lib/api-config';

const PDFManager = () => {
  const [pdfs, setPdfs] = useState({ companyProfile: {}, services: {} });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PDFS);
      if (response.ok) {
        const data = await response.json();
        setPdfs(data);
      }
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
      showError('Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showError('Only PDF files are allowed');
      return;
    }

    setUploading({ ...uploading, companyProfile: true });

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(API_ENDPOINTS.PDF_COMPANY_PROFILE, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccess('Company Profile PDF updated successfully');
        fetchPDFs();
      } else {
        showError('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      showError('Failed to upload PDF');
    } finally {
      setUploading({ ...uploading, companyProfile: false });
      e.target.value = '';
    }
  };

  const handleServicePDFUpload = async (e, serviceId, serviceName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showError('Only PDF files are allowed');
      return;
    }

    setUploading({ ...uploading, [`service-${serviceId}`]: true });

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(API_ENDPOINTS.PDF_SERVICE(serviceId), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccess(`${serviceName} PDF updated successfully`);
        fetchPDFs();
      } else {
        showError('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      showError('Failed to upload PDF');
    } finally {
      setUploading({ ...uploading, [`service-${serviceId}`]: false });
      e.target.value = '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const PDFCard = ({ title, pdfData, onUpload, uploadKey, isCompanyProfile = false }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <DocumentIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{pdfData?.fileName || 'Not uploaded'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pdfData?.lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>Last updated: {formatDate(pdfData.lastUpdated)}</span>
          </div>
        )}

        <div className="flex gap-2">
          {pdfData?.filePath && (
            <a
              href={pdfData.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center font-medium"
            >
              View Current
            </a>
          )}

          <label className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer text-center font-medium flex items-center justify-center gap-2">
            {uploading[uploadKey] ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="h-5 w-5" />
                Update PDF
              </>
            )}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={onUpload}
              className="hidden"
              disabled={uploading[uploadKey]}
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Manager</h1>
        <p className="text-gray-600">
          Update PDF files for company profile and services. Files will be replaced, not deleted.
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Profile */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Company Profile</h2>
          <div className="grid grid-cols-1 gap-4">
            <PDFCard
              title="Company Profile"
              pdfData={pdfs.companyProfile}
              onUpload={handleCompanyProfileUpload}
              uploadKey="companyProfile"
              isCompanyProfile={true}
            />
          </div>
        </div>

        {/* Service PDFs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service PDFs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(pdfs.services || {}).map(([serviceId, pdfData]) => (
              <PDFCard
                key={serviceId}
                title={pdfData.name}
                pdfData={pdfData}
                onUpload={(e) => handleServicePDFUpload(e, serviceId, pdfData.name)}
                uploadKey={`service-${serviceId}`}
              />
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notes:</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Only PDF files are accepted</li>
                  <li>Maximum file size: 20MB</li>
                  <li>Uploading a new file will replace the existing one</li>
                  <li>Changes will reflect immediately on the main website</li>
                  <li>PDFs cannot be deleted, only replaced</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFManager;
