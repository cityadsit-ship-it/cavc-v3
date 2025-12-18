import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ServiceForm from './ServiceForm';
import GalleryManager from './GalleryManager';
import { useNotification, NotificationContainer } from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';
import { API_ENDPOINTS } from '../../lib/api-config';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, service: null });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SERVICES);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      showError('Failed to load services. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteConfirm({ show: true, service });
  };

  const handleDeleteConfirm = async (password) => {
    const { service } = deleteConfirm;

    // Verify password first
    try {
      const verifyResponse = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem('adminUser'),
          password: password
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        showError('Invalid password. Service was not deleted.');
        return;
      }

      // Password is correct, proceed with deletion
      setDeleteConfirm({ show: false, service: null });

      const response = await fetch(API_ENDPOINTS.SERVICE(service.id), {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess(`Service "${service.title}" deleted successfully`);
        fetchServices();
      } else {
        showError('Failed to delete service');
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
      showError('Failed to delete service. Please check your connection.');
      setDeleteConfirm({ show: false, service: null });
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleManageGallery = (service) => {
    setSelectedService(service);
    setShowGallery(true);
  };

  const handleFormClose = (saved = false) => {
    setShowForm(false);
    setSelectedService(null);
    if (saved) {
      showSuccess(selectedService ? 'Service updated successfully' : 'Service created successfully');
      fetchServices();
    }
  };

  const handleGalleryClose = (updated = false) => {
    setShowGallery(false);
    setSelectedService(null);
    if (updated) {
      fetchServices();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Services Manager</h1>
        <button
          onClick={() => {
            setSelectedService(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="aspect-video bg-gray-200 relative">
              {service.galleryItems && service.galleryItems.length > 0 ? (
                <img
                  src={service.galleryItems[0].imagePath}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {service.galleryItems?.length || 0} images
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleManageGallery(service)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  Gallery ({service.galleryItems?.length || 0})
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(service)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No services found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first service
          </button>
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={selectedService}
          onClose={handleFormClose}
        />
      )}

      {showGallery && selectedService && (
        <GalleryManager
          service={selectedService}
          onClose={handleGalleryClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, service: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteConfirm.service?.title}"? This action cannot be undone and requires password confirmation.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        requirePassword={true}
        passwordPlaceholder="Enter your admin password"
      />
    </div>
  );
};

export default ServicesManager;
