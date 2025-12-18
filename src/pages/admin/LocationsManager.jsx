import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LocationForm from './LocationForm';
import { useNotification, NotificationContainer } from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';
import { API_ENDPOINTS } from '../../lib/api-config';

const LocationsManager = () => {
  const [locations, setLocations] = useState({ metroManila: [], provincial: [] });
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, location: null, type: null });
  const [searchTerm, setSearchTerm] = useState('');
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LOCATIONS);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      showError('Failed to load locations. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (location, type) => {
    setDeleteConfirm({ show: true, location, type });
  };

  const handleDeleteConfirm = async () => {
    const { location, type } = deleteConfirm;
    setDeleteConfirm({ show: false, location: null, type: null });

    try {
      const response = await fetch(API_ENDPOINTS.LOCATION(type, location.id), {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess(`Location "${location.name}" deleted successfully`);
        fetchLocations();
      } else {
        showError('Failed to delete location');
      }
    } catch (error) {
      console.error('Failed to delete location:', error);
      showError('Failed to delete location. Please check your connection.');
    }
  };

  const handleEdit = (location, type) => {
    setSelectedLocation(location);
    setSelectedType(type);
    setShowForm(true);
  };

  const handleAdd = (type) => {
    setSelectedLocation(null);
    setSelectedType(type);
    setShowForm(true);
  };

  const handleFormClose = (saved = false) => {
    setShowForm(false);
    setSelectedLocation(null);
    setSelectedType(null);
    if (saved) {
      showSuccess(selectedLocation ? 'Location updated successfully' : 'Location added successfully');
      fetchLocations();
    }
  };

  // Filter and sort locations alphabetically
  const filteredLocations = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    const filterAndSort = (locationArray) => {
      return locationArray
        .filter(loc => loc.name.toLowerCase().includes(searchLower))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    return {
      metroManila: filterAndSort(locations.metroManila),
      provincial: filterAndSort(locations.provincial)
    };
  }, [locations, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const LocationCard = ({ location, type, color }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${color === 'blue' ? 'bg-blue-100' : 'bg-red-100'}`}>
            <MapPinIcon className={`h-6 w-6 ${color === 'blue' ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
            <div className="text-sm text-gray-600 mt-1">
              <p>Latitude: {location.lat}</p>
              <p>Longitude: {location.lng}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(location, type)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(location, type)}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Locations Manager</h1>
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Metro Manila Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              Metro Manila Cities
              <span className="text-sm font-normal text-gray-500">
                ({filteredLocations.metroManila.length}{searchTerm && ` of ${locations.metroManila.length}`})
              </span>
            </h2>
            <button
              onClick={() => handleAdd('metroManila')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Metro Manila Location
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.metroManila.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                type="metroManila"
                color="blue"
              />
            ))}
          </div>
          {filteredLocations.metroManila.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No Metro Manila locations found matching "${searchTerm}"` : 'No Metro Manila locations found'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => handleAdd('metroManila')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first location
                </button>
              )}
            </div>
          )}
        </div>

        {/* Provincial Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              Provincial Locations
              <span className="text-sm font-normal text-gray-500">
                ({filteredLocations.provincial.length}{searchTerm && ` of ${locations.provincial.length}`})
              </span>
            </h2>
            <button
              onClick={() => handleAdd('provincial')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Provincial Location
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.provincial.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                type="provincial"
                color="red"
              />
            ))}
          </div>
          {filteredLocations.provincial.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No provincial locations found matching "${searchTerm}"` : 'No provincial locations found'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => handleAdd('provincial')}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Add your first location
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <LocationForm
          location={selectedLocation}
          type={selectedType}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, location: null, type: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Location"
        message={`Are you sure you want to delete "${deleteConfirm.location?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default LocationsManager;
