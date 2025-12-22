import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS with multiple origins support
// Always include localhost origins for development, plus any production origins from env
const localhostOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const productionOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];
const allowedOrigins = [...localhostOrigins, ...productionOrigins];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
// HERO IMAGES CRUD ENDPOINTS
// ============================================

// Get all hero images
app.get('/api/hero-images', async (req, res) => {
  try {
    const heroDir = path.join(__dirname, '../public/images/hero');
    
    // Ensure directory exists
    try {
      await fs.access(heroDir);
    } catch {
      await fs.mkdir(heroDir, { recursive: true });
      return res.json({ images: [] });
    }

    const files = await fs.readdir(heroDir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    // Sort files numerically (1.webp, 2.webp, etc.)
    webpFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const images = await Promise.all(
      webpFiles.map(async (file) => {
        const filePath = path.join(heroDir, file);
        const stats = await fs.stat(filePath);
        return {
          filename: file,
          url: `/images/hero/${file}`,
          size: `${(stats.size / 1024).toFixed(2)} KB`,
          uploadDate: stats.mtime
        };
      })
    );

    res.json({ images });
  } catch (error) {
    console.error('Failed to fetch hero images:', error);
    res.status(500).json({ error: 'Failed to fetch hero images', message: error.message });
  }
});

// Upload new hero image
app.post('/api/hero-images', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const heroDir = path.join(__dirname, '../public/images/hero');
    
    // Ensure directory exists
    await fs.mkdir(heroDir, { recursive: true });

    // Get existing files to determine next number
    const files = await fs.readdir(heroDir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    // Extract numbers and find the highest
    const numbers = webpFiles.map(file => {
      const match = file.match(/(\d+)\.webp$/i);
      return match ? parseInt(match[1]) : 0;
    });
    
    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    const filename = `${nextNumber}.webp`;
    const filepath = path.join(heroDir, filename);

    // Write file to disk
    await fs.writeFile(filepath, req.file.buffer);

    await logActivity('created', 'Hero Image', `Uploaded ${filename}`);

    res.json({
      success: true,
      message: 'Hero image uploaded successfully',
      filename,
      url: `/images/hero/${filename}`
    });
  } catch (error) {
    console.error('Failed to upload hero image:', error);
    res.status(500).json({ error: 'Failed to upload hero image', message: error.message });
  }
});

// Delete hero image (with password verification)
app.delete('/api/hero-images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { password } = req.body;

    // Verify admin password
    const adminData = await readAdminData();
    if (!password || password !== adminData.password) {
      return res.status(401).json({ error: 'Invalid password', message: 'Incorrect admin password' });
    }

    // Validate filename (security check)
    if (!filename.match(/^\d+\.webp$/i)) {
      return res.status(400).json({ error: 'Invalid filename format' });
    }

    const heroDir = path.join(__dirname, '../public/images/hero');
    const filepath = path.join(heroDir, filename);

    // Check if file exists
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the file
    await fs.unlink(filepath);

    await logActivity('deleted', 'Hero Image', `Deleted ${filename}`);

    res.json({
      success: true,
      message: 'Hero image deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete hero image:', error);
    res.status(500).json({ error: 'Failed to delete hero image', message: error.message });
  }
});

// Reorder hero images
app.put('/api/hero-images/reorder', async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const heroDir = path.join(__dirname, '../public/images/hero');
    const tempDir = path.join(heroDir, 'temp_reorder');

    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Step 1: Move all files to temp directory with new names
      for (const item of order) {
        const oldPath = path.join(heroDir, item.oldFilename);
        const tempPath = path.join(tempDir, `${item.newNumber}.webp`);
        
        try {
          await fs.access(oldPath);
          await fs.rename(oldPath, tempPath);
        } catch (error) {
          console.error(`Failed to move ${item.oldFilename}:`, error);
        }
      }

      // Step 2: Move all files back from temp to hero directory
      const tempFiles = await fs.readdir(tempDir);
      for (const file of tempFiles) {
        const tempPath = path.join(tempDir, file);
        const finalPath = path.join(heroDir, file);
        await fs.rename(tempPath, finalPath);
      }

      // Step 3: Clean up temp directory
      await fs.rmdir(tempDir);

      await logActivity('updated', 'Hero Images', `Reordered ${order.length} hero images`);

      res.json({
        success: true,
        message: 'Images reordered successfully'
      });
    } catch (error) {
      // Cleanup on error
      try {
        const tempFiles = await fs.readdir(tempDir);
        for (const file of tempFiles) {
          const tempPath = path.join(tempDir, file);
          const originalPath = path.join(heroDir, file);
          await fs.rename(tempPath, originalPath);
        }
        await fs.rmdir(tempDir);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to reorder hero images:', error);
    res.status(500).json({ error: 'Failed to reorder images', message: error.message });
  }
});

// ============================================
// START SERVER
// ============================================

// Start the server (works for both development and production)
app.listen(PORT, () => {
  console.log(`🚀 CMS Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving images from: ${path.join(__dirname, '../public/images')}`);
  console.log(`📄 Serving PDFs from: ${path.join(__dirname, '../public/pdfs')}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS Origins: ${allowedOrigins.join(', ')}`);
});

// Export app for testing purposes
export default app;
