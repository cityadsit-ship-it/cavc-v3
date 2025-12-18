// API Hook to fetch services data dynamically
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fetch services data from API
export const useFetchServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
        // Fallback to empty array if API fails
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};

// Transform API data to match ServicesData.js structure
export const transformServiceData = (apiServices) => {
  return apiServices.map(service => {
    const galleryItems = (service.galleryItems || []).map(item => ({
      webp: item.imagePath,
      jpg: item.jpgPath,
      modalDescription: item.modalDescription,
      modalDetails: item.modalDetails || {},
    }));

    // Create gallery array for ServiceGalleryModal (expects url, caption, modalDescription, modalDetails)
    const gallery = (service.galleryItems || []).map(item => ({
      url: item.imagePath,
      caption: item.modalDescription || service.title,
      modalDescription: item.modalDescription,
      modalDetails: item.modalDetails || {},
    }));

    return {
      id: service.id,
      folder: service.folder,
      title: service.title,
      description: service.description,
      mainImage: service.galleryItems?.[0]?.imagePath || '',
      imageCount: galleryItems.length,
      galleryItems,
      gallery, // For ServiceGalleryModal compatibility
      previewImage: service.galleryItems?.[0]?.imagePath || '',
      downloadFile: service.galleryItems?.[0]?.jpgPath || '',
      downloadFileName: service.galleryItems?.[0]?.jpgPath?.split('/').pop() || '',
      pdfFile: `/pdfs/services/${service.pdfFileName}`,
      pdfFileName: service.pdfFileName,
    };
  });
};

// Fetch and transform in one go
export const useFetchTransformedServices = () => {
  const { services, loading, error } = useFetchServices();
  const [transformedServices, setTransformedServices] = useState([]);

  useEffect(() => {
    if (services.length > 0) {
      setTransformedServices(transformServiceData(services));
    }
  }, [services]);

  return { services: transformedServices, loading, error };
};

export default useFetchTransformedServices;
