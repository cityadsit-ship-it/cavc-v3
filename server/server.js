import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/pdfs', express.static(path.join(__dirname, '../public/pdfs')));

// Configure multer for image uploads - use memory storage first, then save to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  }
});

// Configure multer for PDF uploads
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for PDFs
  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf';
    
    if (isPDF) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Helper function to read services data
async function readServicesData() {
  const dataPath = path.join(__dirname, 'data/services.json');
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write services data
async function writeServicesData(data) {
  const dataPath = path.join(__dirname, 'data/services.json');
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to read PDFs data
async function readPDFsData() {
  const pdfsPath = path.join(__dirname, 'data/pdfs.json');
  try {
    const data = await fs.readFile(pdfsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { companyProfile: {}, services: {} };
  }
}

// Helper function to write PDFs data
async function writePDFsData(data) {
  const pdfsPath = path.join(__dirname, 'data/pdfs.json');
  await fs.writeFile(pdfsPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to read activity logs
async function readActivityLogs() {
  const logsPath = path.join(__dirname, 'data/activity-logs.json');
  try {
    const data = await fs.readFile(logsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { logs: [] };
  }
}

// Helper function to write activity logs
async function writeActivityLogs(data) {
  const logsPath = path.join(__dirname, 'data/activity-logs.json');
  await fs.writeFile(logsPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to log activity
async function logActivity(action, entity, description) {
  try {
    const logsData = await readActivityLogs();
    const newLog = {
      action, // 'created', 'updated', 'deleted'
      entity, // 'Service', 'Gallery Item', 'Location'
      description,
      timestamp: new Date().toISOString()
    };
    
    logsData.logs.unshift(newLog); // Add to beginning
    
    // Keep only last 100 logs
    if (logsData.logs.length > 100) {
      logsData.logs = logsData.logs.slice(0, 100);
    }
    
    await writeActivityLogs(logsData);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// Helper function to read admin data
async function readAdminData() {
  const adminPath = path.join(__dirname, 'data/admin.json');
  try {
    const data = await fs.readFile(adminPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { username: 'admin', password: 'cavc2024', email: '', lastPasswordChange: new Date().toISOString() };
  }
}

// Helper function to write admin data
async function writeAdminData(data) {
  const adminPath = path.join(__dirname, 'data/admin.json');
  await fs.writeFile(adminPath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================
// AUTHENTICATION
// ============================================

// Login endpoint (validates against admin.json)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const adminData = await readAdminData();
    
    if (username === adminData.username && password === adminData.password) {
      res.json({
        success: true,
        token: 'simple-token-' + Date.now(), // In production, use JWT
        user: { username }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================
// SERVICES CRUD ENDPOINTS
// ============================================

// GET all services
app.get('/api/services', async (req, res) => {
  try {
    const data = await readServicesData();
    res.json(data.services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read services data', message: error.message });
  }
});

// GET single service
app.get('/api/services/:id', async (req, res) => {
  try {
    const data = await readServicesData();
    const service = data.services.find(s => s.id === parseInt(req.params.id));
    
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read service data', message: error.message });
  }
});

// POST create new service
app.post('/api/services', async (req, res) => {
  try {
    const data = await readServicesData();
    const newService = {
      id: Math.max(...data.services.map(s => s.id), 0) + 1,
      ...req.body,
      galleryItems: req.body.galleryItems || []
    };
    
    data.services.push(newService);
    await writeServicesData(data);
    await logActivity('created', 'Service', `Created service "${newService.title}"`);
    
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service', message: error.message });
  }
});

// PUT update service
app.put('/api/services/:id', async (req, res) => {
  try {
    const data = await readServicesData();
    const index = data.services.findIndex(s => s.id === parseInt(req.params.id));
    
    if (index !== -1) {
      data.services[index] = {
        ...data.services[index],
        ...req.body,
        id: parseInt(req.params.id) // Ensure ID doesn't change
      };
      
      await writeServicesData(data);
      await logActivity('updated', 'Service', `Updated service "${data.services[index].title}"`);
      res.json(data.services[index]);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service', message: error.message });
  }
});

// DELETE service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const data = await readServicesData();
    const index = data.services.findIndex(s => s.id === parseInt(req.params.id));
    
    if (index !== -1) {
      const deletedService = data.services.splice(index, 1)[0];
      await writeServicesData(data);
      await logActivity('deleted', 'Service', `Deleted service "${deletedService.title}"`);
      res.json({ message: 'Service deleted', service: deletedService });
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service', message: error.message });
  }
});

// ============================================
// GALLERY ITEM ENDPOINTS
// ============================================

// POST add gallery item to service
app.post('/api/services/:id/gallery', async (req, res) => {
  try {
    const data = await readServicesData();
    const service = data.services.find(s => s.id === parseInt(req.params.id));
    
    if (service) {
      const newGalleryItem = {
        ...req.body
      };
      
      service.galleryItems.push(newGalleryItem);
      await writeServicesData(data);
      await logActivity('created', 'Gallery Item', `Added "${newGalleryItem.modalDescription}" to ${service.title}`);
      
      res.status(201).json(newGalleryItem);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add gallery item', message: error.message });
  }
});

// PUT update gallery item
app.put('/api/services/:id/gallery/:index', async (req, res) => {
  try {
    const data = await readServicesData();
    const service = data.services.find(s => s.id === parseInt(req.params.id));
    const index = parseInt(req.params.index);
    
    if (service && service.galleryItems[index]) {
      service.galleryItems[index] = {
        ...service.galleryItems[index],
        ...req.body
      };
      
      await writeServicesData(data);
      await logActivity('updated', 'Gallery Item', `Updated "${service.galleryItems[index].modalDescription}" in ${service.title}`);
      res.json(service.galleryItems[index]);
    } else {
      res.status(404).json({ error: 'Service or gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery item', message: error.message });
  }
});

// DELETE gallery item
app.delete('/api/services/:id/gallery/:index', async (req, res) => {
  try {
    const data = await readServicesData();
    const service = data.services.find(s => s.id === parseInt(req.params.id));
    const index = parseInt(req.params.index);
    
    if (service && service.galleryItems[index]) {
      const deletedItem = service.galleryItems.splice(index, 1)[0];
      await writeServicesData(data);
      await logActivity('deleted', 'Gallery Item', `Deleted "${deletedItem.modalDescription}" from ${service.title}`);
      
      res.json({ message: 'Gallery item deleted', item: deletedItem });
    } else {
      res.status(404).json({ error: 'Service or gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item', message: error.message });
  }
});

// ============================================
// IMAGE UPLOAD ENDPOINT
// ============================================

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const folder = req.body.folder || 'general';
    const uploadPath = path.join(__dirname, '../public/images/services', folder);
    
    // Create directory if it doesn't exist
    await fs.mkdir(uploadPath, { recursive: true });
    
    // Generate filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const name = path.basename(req.file.originalname, ext);
    const filename = `${name}-${uniqueSuffix}${ext}`;
    
    // Save file to disk
    const filePath = path.join(uploadPath, filename);
    await fs.writeFile(filePath, req.file.buffer);
    
    const imagePath = `/images/services/${folder}/${filename}`;
    
    console.log('Image uploaded successfully:', imagePath);
    
    res.json({
      success: true,
      imagePath,
      filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// ============================================
// LOCATIONS API
// ============================================

const locationsPath = path.join(__dirname, 'data', 'locations.json');

// Get all locations
app.get('/api/locations', async (req, res) => {
  try {
    const data = await fs.readFile(locationsPath, 'utf8');
    const locations = JSON.parse(data);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read locations', message: error.message });
  }
});

// Add location
app.post('/api/locations/:type', async (req, res) => {
  try {
    const { type } = req.params; // 'metroManila' or 'provincial'
    const newLocation = req.body;
    
    const data = await fs.readFile(locationsPath, 'utf8');
    const locations = JSON.parse(data);
    
    if (!locations[type]) {
      return res.status(400).json({ error: 'Invalid location type' });
    }
    
    // Generate new ID
    const allLocations = [...locations.metroManila, ...locations.provincial];
    const maxId = Math.max(...allLocations.map(loc => loc.id), 0);
    newLocation.id = maxId + 1;
    
    locations[type].push(newLocation);
    
    await fs.writeFile(locationsPath, JSON.stringify(locations, null, 2));
    await logActivity('created', 'Location', `Added "${newLocation.name}" to ${type === 'metroManila' ? 'Metro Manila' : 'Provincial'}`);
    res.json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add location', message: error.message });
  }
});

// Update location
app.put('/api/locations/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const updatedLocation = req.body;
    
    const data = await fs.readFile(locationsPath, 'utf8');
    const locations = JSON.parse(data);
    
    if (!locations[type]) {
      return res.status(400).json({ error: 'Invalid location type' });
    }
    
    const index = locations[type].findIndex(loc => loc.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    locations[type][index] = { ...locations[type][index], ...updatedLocation, id: parseInt(id) };
    
    await fs.writeFile(locationsPath, JSON.stringify(locations, null, 2));
    await logActivity('updated', 'Location', `Updated "${locations[type][index].name}" in ${type === 'metroManila' ? 'Metro Manila' : 'Provincial'}`);
    res.json(locations[type][index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location', message: error.message });
  }
});

// Delete location
app.delete('/api/locations/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const data = await fs.readFile(locationsPath, 'utf8');
    const locations = JSON.parse(data);
    
    if (!locations[type]) {
      return res.status(400).json({ error: 'Invalid location type' });
    }
    
    const deletedLocation = locations[type].find(loc => loc.id === parseInt(id));
    locations[type] = locations[type].filter(loc => loc.id !== parseInt(id));
    
    await fs.writeFile(locationsPath, JSON.stringify(locations, null, 2));
    
    if (deletedLocation) {
      await logActivity('deleted', 'Location', `Deleted "${deletedLocation.name}" from ${type === 'metroManila' ? 'Metro Manila' : 'Provincial'}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete location', message: error.message });
  }
});

// ============================================
// PDF MANAGEMENT
// ============================================

// Get all PDFs
app.get('/api/pdfs', async (req, res) => {
  try {
    const pdfsData = await readPDFsData();
    res.json(pdfsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDFs', message: error.message });
  }
});

// Update company profile PDF
app.post('/api/pdfs/company-profile', pdfUpload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const uploadPath = path.join(__dirname, '../public');
    const fileName = 'company-profile.pdf';
    const filePath = path.join(uploadPath, fileName);

    // Save file to disk
    await fs.writeFile(filePath, req.file.buffer);

    // Update PDFs database
    const pdfsData = await readPDFsData();
    pdfsData.companyProfile = {
      name: 'Company Profile',
      fileName: fileName,
      filePath: `/${fileName}`,
      lastUpdated: new Date().toISOString()
    };

    await writePDFsData(pdfsData);
    await logActivity('updated', 'PDF', 'Updated Company Profile PDF');

    res.json({ success: true, pdf: pdfsData.companyProfile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload PDF', message: error.message });
  }
});

// Update service PDF
app.post('/api/pdfs/service/:serviceId', pdfUpload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { serviceId } = req.params;
    const servicesData = await readServicesData();
    const service = servicesData.services.find(s => s.id === parseInt(serviceId));

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Construct filename based on service
    const fileName = service.pdfFileName || `${service.title.toLowerCase().replace(/\s+/g, '-')}-cavc.pdf`;
    const uploadPath = path.join(__dirname, '../public/pdfs/services');
    const filePath = path.join(uploadPath, fileName);

    // Create directory if it doesn't exist
    await fs.mkdir(uploadPath, { recursive: true });

    // Save file to disk
    await fs.writeFile(filePath, req.file.buffer);

    // Update PDFs database
    const pdfsData = await readPDFsData();
    if (!pdfsData.services) {
      pdfsData.services = {};
    }

    pdfsData.services[serviceId] = {
      name: service.title,
      fileName: fileName,
      filePath: `/pdfs/services/${fileName}`,
      lastUpdated: new Date().toISOString()
    };

    await writePDFsData(pdfsData);
    await logActivity('updated', 'PDF', `Updated PDF for ${service.title}`);

    res.json({ success: true, pdf: pdfsData.services[serviceId] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload PDF', message: error.message });
  }
});

// ============================================
// ADMIN SETTINGS
// ============================================

// Get admin info (without password)
app.get('/api/admin', async (req, res) => {
  try {
    const adminData = await readAdminData();
    const { password, ...adminInfo } = adminData;
    res.json(adminInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// Update admin password
app.put('/api/admin/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const adminData = await readAdminData();

    // Verify current password
    if (adminData.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    adminData.password = newPassword;
    adminData.lastPasswordChange = new Date().toISOString();

    await writeAdminData(adminData);
    await logActivity('updated', 'Admin Settings', 'Password changed');

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password', message: error.message });
  }
});

// Update admin email
app.put('/api/admin/email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const adminData = await readAdminData();
    adminData.email = email;

    await writeAdminData(adminData);
    await logActivity('updated', 'Admin Settings', `Email updated to ${email}`);

    res.json({ success: true, message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email', message: error.message });
  }
});

// ============================================
// ACTIVITY LOGS
// ============================================

// Get activity logs
app.get('/api/activity-logs', async (req, res) => {
  try {
    const logsData = await readActivityLogs();
    res.json(logsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs', logs: [] });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 CMS Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving images from: ${path.join(__dirname, '../public/images')}`);
  console.log(`📄 Serving PDFs from: ${path.join(__dirname, '../public/pdfs')}`);
});
