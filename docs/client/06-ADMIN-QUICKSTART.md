# 🚀 Quick Start - CMS Admin

## Start the System

```bash
# Start both frontend and backend together
npm run dev:all
```

OR run separately:

```bash
# Terminal 1 - Frontend (Port 5173)
npm run dev

# Terminal 2 - Backend API (Port 3001)
npm run server
```

## Access Points

- **Main Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin/dashboard
- **API Server**: http://localhost:3001/api

## Login Credentials

```
Username: admin
Password: cavc2024
```

## What You Can Do

### ✅ Manage Services
- Create, edit, delete advertising services
- Set service titles, descriptions, folders
- Configure PDF files

### ✅ Manage Gallery Images
- Add multiple images per service
- Upload images directly (WebP, JPG, PNG)
- Edit image details and specifications
- Add key-value pairs (Ad Size, Location, etc.)

### ✅ Image Upload
- Drag & drop or click to upload
- Auto-organized by service folder
- 10MB max file size

## File Structure

```
server/
  ├── server.js           # Backend API
  └── data/
      └── services.json   # Database

src/pages/admin/
  ├── AdminLogin.jsx      # Login page
  ├── AdminLayout.jsx     # Admin shell
  ├── Dashboard.jsx       # Overview
  ├── ServicesManager.jsx # Services list
  └── ...more components
```

## Common Commands

```bash
# Install dependencies
npm install

# Start dev (frontend + backend)
npm run dev:all

# Start frontend only
npm run dev

# Start backend only
npm run server

# Build for production
npm build
```

## Troubleshooting

**Can't login?**
- Check if backend is running on port 3001
- Clear browser localStorage: `localStorage.clear()`

**Images not showing?**
- Verify paths in `server/data/services.json`
- Check `public/images/services/` folders exist

**Port already in use?**
- Frontend: Change port in `vite.config.js`
- Backend: Change PORT in `server/server.js`

## Next Steps

1. ✅ Login to admin panel
2. ✅ Create/edit services
3. ✅ Upload images
4. ✅ Test CRUD operations
5. ✅ Customize as needed

Full documentation: See [CMS_SETUP.md](./CMS_SETUP.md)
