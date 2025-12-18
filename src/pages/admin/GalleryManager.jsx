import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import GalleryItemForm from './GalleryItemForm';
import { useNotification, NotificationContainer } from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const GalleryManager = ({ service, onClose }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, index: null });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    if (service) {
      setGalleryItems(service.galleryItems || []);
    }
  }, [service]);

  const handleAddItem = () => {
    setSelectedItem(null);
    setSelectedIndex(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setShowItemForm(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteConfirm({ show: true, index });
  };

  const handleDeleteConfirm = async () => {
    const { index } = deleteConfirm;
    setDeleteConfirm({ show: false, index: null });

    try {
      const response = await fetch(API_ENDPOINTS.SERVICE_GALLERY_ITEM(service.id, index), {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const updated = galleryItems.filter((_, i) => i !== index);
        setGalleryItems(updated);
        showSuccess('Gallery item deleted successfully');
      } else {
        showError('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      showError('Failed to delete gallery item. Please check your connection.');
    }
  };

  const handleItemSaved = (savedItem) => {
    if (selectedIndex !== null) {
      // Update existing
      const updated = [...galleryItems];
      updated[selectedIndex] = savedItem;
      setGalleryItems(updated);
      showSuccess('Gallery item updated successfully');
    } else {
      // Add new
      setGalleryItems([...galleryItems, savedItem]);
      showSuccess('Gallery item added successfully');
    }
    setShowItemForm(false);
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', service.folder);

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Auto-create a gallery item with the uploaded image
        const newItem = {
          imagePath: data.imagePath,
          jpgPath: data.imagePath,
          modalDescription: file.name.replace(/\.[^/.]+$/, ''),
          modalDetails: {},
        };

        const saveResponse = await fetch(API_ENDPOINTS.SERVICE_GALLERY(service.id), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });

        if (saveResponse.ok) {
          setGalleryItems([...galleryItems, newItem]);
          showSuccess('Image uploaded and added to gallery');
        } else {
          showError('Image uploaded but failed to add to gallery');
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onClose(true)} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Gallery Management</p>
              </div>
              <button
                onClick={() => onClose(true)}
                className="text-gray-400 hover:text-gray-500 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Gallery Item
              </button>
              
              <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {galleryItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={item.imagePath}
                      alt={item.modalDescription}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-2">
                      {item.modalDescription || 'Untitled'}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item, index)}
                        className="flex-1 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        <PencilIcon className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {galleryItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="mb-2">No gallery items yet</p>
                  <button
                    onClick={handleAddItem}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showItemForm && (
        <GalleryItemForm
          serviceId={service.id}
          item={selectedItem}
          itemIndex={selectedIndex}
          folder={service.folder}
          onSave={handleItemSaved}
          onClose={() => {
            setShowItemForm(false);
            setSelectedItem(null);
            setSelectedIndex(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, index: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default GalleryManager;
