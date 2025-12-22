import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import HeroImagesManager from './pages/admin/HeroImagesManager'
import ServicesManager from './pages/admin/ServicesManager'
import LocationsManager from './pages/admin/LocationsManager'
import PDFManager from './pages/admin/PDFManager'
import AdminSettings from './pages/admin/AdminSettings'
import ProtectedRoute from './pages/admin/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero-images" element={<HeroImagesManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="locations" element={<LocationsManager />} />
          <Route path="pdfs" element={<PDFManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
