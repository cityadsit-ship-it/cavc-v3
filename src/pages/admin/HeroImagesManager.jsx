import { useState, useEffect } from 'react';
import { PhotoIcon, TrashIcon, ArrowUpTrayIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../lib/api-config';
import Notification from '../../components/Notification';

const HeroImagesManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Handle ESC key to close fullscreen modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setFullscreenImage(null);
      }
    };
    
    if (fullscreenImage) {
      window.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [fullscreenImage]);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HERO_IMAGES);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        showNotification('Failed to fetch hero images', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch hero images:', error);
      showNotification('Failed to fetch hero images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('webp') && !file.type.includes('image')) {
        showNotification('Please select a WebP image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification('Please select an image file', 'error');
      return;
    }

    setShowUploadConfirm(true);
  };

  const confirmUpload = async () => {
    setShowUploadConfirm(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(API_ENDPOINTS.HERO_IMAGES, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('Hero image uploaded successfully', 'success');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchHeroImages();
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!deletePassword) {
      showNotification('Please enter your password', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.HERO_IMAGES}/${filename}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (response.ok) {
        showNotification('Hero image deleted successfully', 'success');
        fetchHeroImages();
        setDeletePassword('');
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to delete image', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete image', 'error');
    } finally {
      setDeleteConfirm(null);
      setDeletePassword('');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleReorder = async () => {
    setShowSaveConfirm(true);
  };

  const confirmSaveChanges = async () => {
    setShowSaveConfirm(false);
    setReordering(true);
    try {
      const newOrder = images.map((img, index) => ({
        oldFilename: img.filename,
        newNumber: index + 1
      }));

      const response = await fetch(`${API_ENDPOINTS.HERO_IMAGES}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (response.ok) {
        showNotification('Images reordered successfully', 'success');
        fetchHeroImages();
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to reorder images', 'error');
      }
    } catch (error) {
      console.error('Reorder error:', error);
      showNotification('Failed to reorder images', 'error');
    } finally {
      setReordering(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setImages(shuffled);
    showNotification('Images shuffled! Click "Save Changes" to apply the new order.', 'info');
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hero Images Manager</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage hero background images. Images should be in WebP format for optimal performance.
        </p>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Hero Image</h2>
        
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select WebP Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to select WebP image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".webp,image/webp"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="relative">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio like hero */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-accent-green to-lime-green opacity-30"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    Preview (Hero Display Simulation)
                  </div>
                </div>
              </div>
              <button
                onClick={cancelUpload}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg z-10"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <button
                onClick={cancelUpload}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Current Hero Images ({images.length})
          </h2>
        </div>
        
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Drag and drop images to reorder, or use the shuffle button for random order. Click "Save Changes" to apply.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleShuffle}
            disabled={images.length < 2}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            Shuffle
          </button>
          <button
            onClick={handleReorder}
            disabled={reordering || images.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reordering ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PhotoIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>No hero images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.filename}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'
                } hover:shadow-lg`}
              >
                <div 
                  className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => setFullscreenImage(image)}
                  title="Click to view full size"
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    #{index + 1}
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {image.size}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(image.filename)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete image"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === image.filename && (
                  <div className="absolute inset-0 bg-black bg-opacity-90 rounded-lg flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 max-w-xs w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Image?
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        This will permanently delete {image.filename}
                      </p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter your admin password to confirm:
                        </label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Password"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleDelete(image.filename);
                            } else if (e.key === 'Escape') {
                              setDeleteConfirm(null);
                              setDeletePassword('');
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(image.filename)}
                          disabled={!deletePassword}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm(null);
                            setDeletePassword('');
                          }}
                          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition backdrop-blur-sm z-10"
            title="Close (ESC)"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="relative max-w-7xl max-h-full w-full">
            <img
              src={fullscreenImage.url}
              alt={fullscreenImage.filename}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">{fullscreenImage.filename}</p>
              <p className="text-xs text-gray-300">{fullscreenImage.size}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {showUploadConfirm && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Confirm Upload
            </h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to upload this hero image?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>File:</strong> {selectedFile?.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
              <button
                onClick={() => setShowUploadConfirm(false)}
                disabled={uploading}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Changes Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Save Changes?
            </h3>
            <p className="text-gray-600 mb-4">
              This will permanently change the order of your hero images. The new sequence will be reflected on your website immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmSaveChanges}
                disabled={reordering}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {reordering ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowSaveConfirm(false)}
                disabled={reordering}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <PhotoIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Image Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Use WebP format for better performance and smaller file sizes</li>
                <li>Recommended dimensions: 1920x1080 or higher (16:9 aspect ratio)</li>
                <li>Maximum file size: 5MB</li>
                <li>Click any image to view it in full-screen mode</li>
                <li>Preview shows how image will appear in the hero section</li>
                <li>Images are automatically numbered and loaded in sequence</li>
                <li>Drag and drop to reorder images, then click "Save Changes"</li>
                <li>Use "Shuffle" for random order preview before saving</li>
                <li>Password required to delete any hero image</li>
                <li>All actions require confirmation and are logged for audit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImagesManager;
