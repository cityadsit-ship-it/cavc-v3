import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const GalleryItemForm = ({ serviceId, item, itemIndex, folder, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    imagePath: '',
    jpgPath: '',
    modalDescription: '',
    modalDetails: {},
  });
  const [detailFields, setDetailFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ imagePath: false, jpgPath: false });
  const [uploadStatus, setUploadStatus] = useState({ imagePath: '', jpgPath: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        imagePath: item.imagePath || '',
        jpgPath: item.jpgPath || '',
        modalDescription: item.modalDescription || '',
        modalDetails: item.modalDetails || {},
      });

      // Convert modalDetails object to array for editing
      const fields = Object.entries(item.modalDetails || {}).map(([key, value]) => ({
        key,
        value,
      }));
      setDetailFields(fields.length > 0 ? fields : [{ key: '', value: '' }]);
    } else {
      setDetailFields([{ key: '', value: '' }]);
    }
  }, [item]);

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const isWebP = fieldName === 'imagePath';
    const isJPG = fieldName === 'jpgPath';
    
    if (isWebP && !file.name.toLowerCase().endsWith('.webp')) {
      setUploadStatus(prev => ({ ...prev, [fieldName]: 'Error: Only .webp files are allowed' }));
      return;
    }
    
    if (isJPG && !file.name.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      setUploadStatus(prev => ({ ...prev, [fieldName]: 'Error: Only .jpg or .jpeg files are allowed' }));
      return;
    }

    setUploading(prev => ({ ...prev, [fieldName]: true }));
    setUploadStatus(prev => ({ ...prev, [fieldName]: 'Uploading...' }));

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('folder', folder);

      console.log('Uploading file:', file.name, 'to folder:', folder);

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: uploadFormData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        setUploadStatus(prev => ({ ...prev, [fieldName]: '✗ Upload failed. Please try again.' }));
        return;
      }

      const data = await response.json();
      console.log('Upload response data:', data);

      if (data.success && data.imagePath) {
        setFormData(prev => ({ ...prev, [fieldName]: data.imagePath }));
        setUploadStatus(prev => ({ ...prev, [fieldName]: '✓ Upload successful!' }));
      } else {
        setUploadStatus(prev => ({ ...prev, [fieldName]: '✗ Upload failed. Please try again.' }));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setUploadStatus(prev => ({ ...prev, [fieldName]: `✗ Upload failed: ${error.message}` }));
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const addDetailField = () => {
    setDetailFields([...detailFields, { key: '', value: '' }]);
  };

  const removeDetailField = (index) => {
    setDetailFields(detailFields.filter((_, i) => i !== index));
  };

  const updateDetailField = (index, field, value) => {
    const updated = [...detailFields];
    updated[index][field] = value;
    setDetailFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Convert detail fields array back to object
      const modalDetails = {};
      detailFields.forEach((field) => {
        if (field.key) {
          modalDetails[field.key] = field.value;
        }
      });

      const payload = {
        ...formData,
        modalDetails,
      };

      const url = itemIndex !== null
        ? `http://localhost:3001/api/services/${serviceId}/gallery/${itemIndex}`
        : `http://localhost:3001/api/services/${serviceId}/gallery`;

      const method = itemIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedItem = await response.json();
        onSave(savedItem);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save gallery item');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {item ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Path - WebP Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (WebP) - Without Details *
                </label>
                <label className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50">
                  <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {uploading.imagePath ? 'Uploading...' : 'Upload WebP Image'}
                  </span>
                  <input
                    type="file"
                    accept=".webp,image/webp"
                    onChange={(e) => handleFileUpload(e, 'imagePath')}
                    className="hidden"
                    disabled={uploading.imagePath}
                  />
                </label>
                
                {/* Upload Status */}
                {uploadStatus.imagePath && (
                  <p className={`text-sm mt-2 ${uploadStatus.imagePath.includes('Error') || uploadStatus.imagePath.includes('✗') ? 'text-red-600' : uploadStatus.imagePath.includes('✓') ? 'text-green-600' : 'text-blue-600'}`}>
                    {uploadStatus.imagePath}
                  </p>
                )}
                
                {/* Image Preview */}
                {formData.imagePath && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={formData.imagePath}
                      alt="WebP Preview"
                      className="h-40 rounded-lg border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none' }} className="h-40 rounded-lg border-2 border-gray-200 bg-gray-100 items-center justify-center text-gray-400 text-sm">
                      Preview not available
                    </div>
                  </div>
                )}
              </div>

              {/* JPG Path - JPG/JPEG Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (JPG/JPEG) - With Details (Optional)
                </label>
                <label className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50">
                  <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {uploading.jpgPath ? 'Uploading...' : 'Upload JPG/JPEG Image'}
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,image/jpeg"
                    onChange={(e) => handleFileUpload(e, 'jpgPath')}
                    className="hidden"
                    disabled={uploading.jpgPath}
                  />
                </label>
                
                {/* Upload Status */}
                {uploadStatus.jpgPath && (
                  <p className={`text-sm mt-2 ${uploadStatus.jpgPath.includes('Error') || uploadStatus.jpgPath.includes('✗') ? 'text-red-600' : uploadStatus.jpgPath.includes('✓') ? 'text-green-600' : 'text-blue-600'}`}>
                    {uploadStatus.jpgPath}
                  </p>
                )}
                
                {/* Image Preview */}
                {formData.jpgPath && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={formData.jpgPath}
                      alt="JPG Preview"
                      className="h-40 rounded-lg border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none' }} className="h-40 rounded-lg border-2 border-gray-200 bg-gray-100 items-center justify-center text-gray-400 text-sm">
                      Preview not available
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title/Description *
                </label>
                <input
                  type="text"
                  value={formData.modalDescription}
                  onChange={(e) => setFormData({ ...formData, modalDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HIGHWAY 54 BILLBOARD"
                  required
                />
              </div>

              {/* Modal Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Details (Key-Value Pairs)
                  </label>
                  <button
                    type="button"
                    onClick={addDetailField}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Field
                  </button>
                </div>

                <div className="space-y-2">
                  {detailFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) => updateDetailField(index, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Key (e.g., Ad Size)"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateDetailField(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Value (e.g., 30ft x 50ft)"
                      />
                      <button
                        type="button"
                        onClick={() => removeDetailField(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading.imagePath || uploading.jpgPath}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (uploading.imagePath || uploading.jpgPath) ? 'Uploading...' : item ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItemForm;
