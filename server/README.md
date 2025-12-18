# CAVC Backend Server

Express.js backend API for the CAVC Content Management System.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
cd server
npm install

# Start server
npm start
```

Server runs on `http://localhost:3001`

### Production Deployment (Render)

1. **Automatic Deployment via render.yaml**
   - Push code to GitHub
   - Import repository in Render
   - Render will auto-detect `render.yaml` configuration

2. **Manual Deployment**
   - Create new Web Service on Render
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (see below)

## 🔧 Environment Variables (Production)

Set these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

## 📁 Project Structure

```
server/
├── server.js              # Main Express application
├── package.json          # Dependencies and scripts
├── data/                 # JSON database files
│   ├── services.json     # Services data
│   ├── locations.json    # Location data
│   ├── admin.json        # Admin credentials
│   ├── pdfs.json        # PDF metadata
│   └── activity-logs.json # Activity logs
└── scripts/             # Utility scripts
```

## 🔐 Security Notes

**Default Admin Credentials:**
- Username: `admin`
- Password: `cavc2024`

⚠️ **IMPORTANT**: Change these immediately after first login!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Gallery
- `POST /api/services/:id/gallery` - Add gallery item
- `PUT /api/services/:id/gallery/:index` - Update gallery item
- `DELETE /api/services/:id/gallery/:index` - Delete gallery item

### Locations
- `GET /api/locations` - List all locations
- `POST /api/locations/:type` - Add location (metroManila/provincial)
- `PUT /api/locations/:type/:id` - Update location
- `DELETE /api/locations/:type/:id` - Delete location

### PDFs
- `GET /api/pdfs` - List all PDFs
- `POST /api/pdfs/company-profile` - Upload company profile PDF
- `POST /api/pdfs/service/:serviceId` - Upload service PDF

### Admin
- `GET /api/admin` - Get admin info
- `PUT /api/admin/password` - Update password
- `PUT /api/admin/email` - Update email

### Uploads
- `POST /api/upload` - Upload image

### Activity Logs
- `GET /api/activity-logs` - Get activity logs

## 🐛 Debugging

View logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Watch real-time logs

Common issues:
- **CORS errors**: Check CORS_ORIGIN matches frontend URL exactly
- **File not found**: Ensure all data files are committed to git
- **Module errors**: Check Node version (>=18.0.0)

## 📦 Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `multer` - File upload handling

## 🔄 Data Persistence

Data is stored in JSON files in `server/data/`. These files should be committed to git for Render to access them. Changes made via the admin panel update these files on the server.

⚠️ **Note**: On Render free tier, file system is ephemeral. Consider implementing a proper database (MongoDB, PostgreSQL) for production use.

## 📝 Notes

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Limited to 750 hours/month on free tier
- Consider upgrading to paid plan for production

## 🤝 Support

For issues or questions, check the main [PRODUCTION_DEPLOYMENT_GUIDE.md](../PRODUCTION_DEPLOYMENT_GUIDE.md)
