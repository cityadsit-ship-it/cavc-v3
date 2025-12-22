# CAVC CMS Setup Guide

## 🎯 Overview
Your CMS (Content Management System) is now set up with a complete admin panel for managing services and images with CRUD operations.

## 📁 Architecture

### Backend (Express Server)
- **Location**: `server/server.js`
- **Database**: JSON file at `server/data/services.json`
- **Port**: 3001
- **Features**:
  - RESTful API endpoints for services CRUD
  - Image upload with multer
  - Simple authentication
  - Gallery item management

### Frontend (React Admin)
- **Login Page**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Services Manager**: `/admin/services`
- **Protected Routes**: Requires authentication

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `express` - Backend server
- `cors` - Cross-origin resource sharing
- `multer` - File upload handling
- `react-router-dom` - Routing for admin pages
- `@heroicons/react` - Icons for UI
- `concurrently` - Run multiple commands

### 2. Start the Development Environment
```bash
# Option 1: Run both frontend and backend together
npm run dev:all

# Option 2: Run separately
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### 3. Access the Admin Panel
- **Frontend**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **Backend API**: http://localhost:3001

### 4. Default Login Credentials
```
Username: admin
Password: cavc2024
```

⚠️ **IMPORTANT**: Change these credentials in `server/server.js` before deploying to production!

## 📋 Features

### Services Management
✅ **Create** new advertising services
✅ **Read** and view all services
✅ **Update** service details
✅ **Delete** services

### Gallery Management
✅ Add multiple images per service
✅ Upload images directly
✅ Edit image details and metadata
✅ Delete gallery items
✅ Key-value pairs for ad specifications

### Image Upload
✅ Direct file upload from admin panel
✅ Automatic organization by service folder
✅ Support for WebP, JPG, PNG formats
✅ 10MB file size limit

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - Login to admin

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Gallery Items
- `POST /api/services/:id/gallery` - Add gallery item
- `PUT /api/services/:id/gallery/:index` - Update gallery item
- `DELETE /api/services/:id/gallery/:index` - Delete gallery item

### Upload
- `POST /api/upload` - Upload image file

## 📂 File Structure
```
cavc-v3/
├── server/
│   ├── server.js              # Express backend
│   └── data/
│       └── services.json      # Service database
├── src/
│   ├── pages/
│   │   └── admin/
│   │       ├── AdminLogin.jsx         # Login page
│   │       ├── AdminLayout.jsx        # Admin shell
│   │       ├── Dashboard.jsx          # Dashboard
│   │       ├── ServicesManager.jsx    # Services list
│   │       ├── ServiceForm.jsx        # Service editor
│   │       ├── GalleryManager.jsx     # Gallery view
│   │       ├── GalleryItemForm.jsx    # Image editor
│   │       └── ProtectedRoute.jsx     # Auth guard
│   └── components/
│       └── ServicesData.js            # Frontend data loader
└── public/
    └── images/
        └── services/                  # Image storage
            ├── banners/
            ├── billboards/
            ├── leds/
            ├── pillars/
            ├── signages/
            └── transits/
```

## 🎨 Admin Features

### Dashboard
- Overview statistics
- Quick action buttons
- Service count

### Services Manager
- Grid view of all services
- Quick edit/delete buttons
- Gallery count badges
- Add new service button

### Service Form
- Title, description, folder name
- PDF file name configuration
- Validation

### Gallery Manager
- Visual grid of all images
- Upload new images
- Edit/delete gallery items
- Preview images

### Gallery Item Form
- Image path (WebP & JPG)
- Title/description
- Dynamic key-value pairs for details
- Direct file upload

## 🔒 Security Notes

1. **Change default credentials** in production
2. **Add proper JWT authentication** for production
3. **Implement rate limiting** on API endpoints
4. **Validate file uploads** server-side
5. **Use environment variables** for sensitive data

## 🛠️ Customization

### Change Admin Credentials
Edit `server/server.js`:
```javascript
const ADMIN_CREDENTIALS = {
  username: 'your-username',
  password: 'your-secure-password',
};
```

### Modify Upload Settings
Edit `server/server.js`:
```javascript
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Change size limit
  fileFilter: (req, file, cb) => {
    // Modify allowed file types
  }
});
```

## 🚀 Deployment

### Before Deploying:
1. ✅ Change admin credentials
2. ✅ Implement proper authentication (JWT)
3. ✅ Set up environment variables
4. ✅ Configure CORS for production domain
5. ✅ Set up proper database (MongoDB, PostgreSQL)
6. ✅ Implement backup strategy for services.json
7. ✅ Add HTTPS for file uploads

### Environment Variables (.env)
```env
PORT=3001
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📝 Next Steps

1. **Test the system**: Login and try CRUD operations
2. **Migrate existing data**: Copy your current service data to `services.json`
3. **Upload images**: Add images through the admin panel
4. **Customize styling**: Modify Tailwind classes in admin components
5. **Add more features**: User management, analytics, etc.

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify `server/data/services.json` exists
- Check Node.js version (use v16+)

### Images not loading
- Verify image paths in `services.json`
- Check public/images/services folders exist
- Ensure Vite is serving static files correctly

### Authentication fails
- Clear localStorage: `localStorage.clear()`
- Check backend console for errors
- Verify credentials in `server/server.js`

## 📞 Support

For issues or questions:
1. Check console logs (browser & server)
2. Verify all dependencies installed
3. Ensure both dev servers running
4. Check network tab for API errors

---

**Ready to use!** Start the servers and visit http://localhost:5173/admin/login 🎉
