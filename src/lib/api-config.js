// API Configuration
// This file centralizes all API endpoint configuration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Admin
  ADMIN: `${API_BASE_URL}/admin`,
  ADMIN_PASSWORD: `${API_BASE_URL}/admin/password`,
  ADMIN_EMAIL: `${API_BASE_URL}/admin/email`,
  
  // Services
  SERVICES: `${API_BASE_URL}/services`,
  SERVICE: (id) => `${API_BASE_URL}/services/${id}`,
  SERVICE_GALLERY: (id) => `${API_BASE_URL}/services/${id}/gallery`,
  SERVICE_GALLERY_ITEM: (id, index) => `${API_BASE_URL}/services/${id}/gallery/${index}`,
  
  // Locations
  LOCATIONS: `${API_BASE_URL}/locations`,
  LOCATION: (type, id) => `${API_BASE_URL}/locations/${type}/${id}`,
  
  // PDFs
  PDFS: `${API_BASE_URL}/pdfs`,
  PDF_COMPANY_PROFILE: `${API_BASE_URL}/pdfs/company-profile`,
  PDF_SERVICE: (serviceId) => `${API_BASE_URL}/pdfs/service/${serviceId}`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
  
  // Activity Logs
  ACTIVITY_LOGS: `${API_BASE_URL}/activity-logs`,
};

export default API_BASE_URL;
