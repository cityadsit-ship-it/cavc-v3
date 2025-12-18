# 🏗️ CAVC Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │                  │
                    │   GitHub Repo    │
                    │   (Source Code)  │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
         ┌──────────▼─────────┐   ┌───▼──────────────┐
         │                    │   │                  │
         │   NETLIFY (Free)   │   │  RENDER (Free)   │
         │   Frontend Host    │   │  Backend API     │
         │                    │   │                  │
         │  - React + Vite    │   │  - Express.js    │
         │  - Static files    │◄──┤  - REST API      │
         │  - Admin Panel     │   │  - File uploads  │
         │  - Auto-deploy     │   │  - JSON DB       │
         │                    │   │  - Auto-deploy   │
         └────────────────────┘   └──────────────────┘
                  │                        │
                  │                        │
         ┌────────▼────────┐      ┌───────▼────────┐
         │                 │      │                │
         │   End Users     │      │   Static Files │
         │  - Browse site  │      │  - Images      │
         │  - View services│      │  - PDFs        │
         │                 │      │                │
         └─────────────────┘      └────────────────┘
                  │
         ┌────────▼────────┐
         │                 │
         │   Admins        │
         │  - Login /admin │
         │  - Manage CMS   │
         │  - Upload files │
         │                 │
         └─────────────────┘
```

## Data Flow

### 1. User Visits Website
```
User Browser → Netlify (Frontend)
             → Loads React App
             → Fetches data from Render API
             → Displays services/content
```

### 2. Admin Manages Content
```
Admin → /admin login
      → POST /api/auth/login (Render)
      → Token stored locally
      → Admin Dashboard
      → CRUD operations via API
      → Updates JSON files on Render
```

### 3. File Upload Process
```
Admin uploads image/PDF
      → Frontend sends to Render API
      → Multer processes file
      → Saves to /public directory
      → Returns file path
      → Frontend updates database via API
```

## Environment Variables Flow

### Development (Local)
```
Frontend: localhost:5173
  └─ VITE_API_URL = http://localhost:3001/api

Backend: localhost:3001
  └─ CORS_ORIGIN = http://localhost:5173
```

### Production
```
Netlify: https://your-site.netlify.app
  └─ VITE_API_URL = https://your-backend.onrender.com/api

Render: https://your-backend.onrender.com
  └─ CORS_ORIGIN = https://your-site.netlify.app
  └─ NODE_ENV = production
  └─ PORT = 10000
```

## API Endpoints Structure

```
Backend (Render)
├── /api/auth/login          (POST)   - Admin authentication
├── /api/services            (GET)    - List services
├── /api/services            (POST)   - Create service
├── /api/services/:id        (GET)    - Get service
├── /api/services/:id        (PUT)    - Update service
├── /api/services/:id        (DELETE) - Delete service
├── /api/services/:id/gallery (POST)  - Add gallery item
├── /api/locations           (GET)    - List locations
├── /api/locations/:type     (POST)   - Add location
├── /api/pdfs                (GET)    - List PDFs
├── /api/pdfs/company-profile(POST)   - Upload company PDF
├── /api/upload              (POST)   - Upload image
└── /api/activity-logs       (GET)    - Get logs
```

## File Structure

```
cavc-v3/
│
├── Frontend Files (Deployed to Netlify)
│   ├── src/
│   │   ├── components/      - React components
│   │   ├── pages/admin/     - Admin panel
│   │   ├── hooks/           - Custom hooks
│   │   └── lib/             - API config
│   ├── public/              - Static assets
│   ├── package.json         - Frontend dependencies
│   ├── vite.config.js       - Build config
│   └── netlify.toml         - Netlify config
│
├── Backend Files (Deployed to Render)
│   └── server/
│       ├── server.js        - Express API
│       ├── package.json     - Backend dependencies
│       └── data/            - JSON database
│           ├── services.json
│           ├── locations.json
│           ├── admin.json
│           ├── pdfs.json
│           └── activity-logs.json
│
├── Configuration Files
│   ├── render.yaml          - Render deployment
│   ├── .env.example         - Env template
│   └── .gitignore           - Git ignore rules
│
└── Documentation
    ├── DEPLOYMENT_SUMMARY.md
    ├── QUICK_DEPLOYMENT_CHECKLIST.md
    ├── PRODUCTION_DEPLOYMENT_GUIDE.md
    └── PRODUCTION_READINESS_CHECKLIST.md
```

## Deployment Flow

### Initial Setup
```
1. Developer pushes to GitHub
   └─> GitHub Repository Updated

2. Connect Render to GitHub
   └─> Render detects render.yaml
   └─> Builds from /server directory
   └─> Deploys backend API
   └─> Generates URL: https://cavc-backend-xxxx.onrender.com

3. Connect Netlify to GitHub
   └─> Netlify detects netlify.toml
   └─> Builds from root with 'npm run build'
   └─> Publishes /dist directory
   └─> Generates URL: https://your-site.netlify.app

4. Configure Environment Variables
   Netlify:
   └─> VITE_API_URL = Render backend URL
   
   Render:
   └─> CORS_ORIGIN = Netlify frontend URL
   └─> NODE_ENV = production
   └─> PORT = 10000

5. Redeploy Both Services
   └─> Backend accepts frontend requests
   └─> Frontend can call backend API
   └─> ✅ Application is live!
```

### Continuous Deployment
```
Developer makes changes
   └─> git commit & git push
   └─> GitHub webhook triggers
       │
       ├─> Netlify auto-rebuild
       │   └─> 2-3 minutes
       │   └─> New frontend deployed
       │
       └─> Render auto-rebuild
           └─> 3-5 minutes
           └─> New backend deployed
```

## Request/Response Flow

### Frontend Request Example
```javascript
// User visits homepage

1. Browser loads from Netlify
   └─> Fetches https://your-site.netlify.app

2. React app initializes
   └─> useFetchServices() hook runs
   └─> fetch(`${VITE_API_URL}/services`)
   └─> https://your-backend.onrender.com/api/services

3. Render API responds
   └─> Checks CORS (matches Netlify URL)
   └─> Reads server/data/services.json
   └─> Returns JSON array

4. Frontend receives data
   └─> Updates React state
   └─> Renders services on page
   └─> User sees content
```

### Admin Action Example
```javascript
// Admin creates new service

1. Admin fills form at /admin/services
   └─> Clicks "Save"

2. Frontend sends POST request
   └─> fetch(API_ENDPOINTS.SERVICES, {
       method: 'POST',
       body: JSON.stringify(serviceData)
   })

3. Render API receives request
   └─> Validates data
   └─> Reads current services.json
   └─> Adds new service with ID
   └─> Writes updated services.json
   └─> Logs activity
   └─> Returns new service

4. Frontend receives response
   └─> Shows success notification
   └─> Refreshes service list
   └─> Admin sees new service
```

## Security Model

```
┌──────────────────────────────────────────┐
│           Public Access                  │
│  - Homepage                              │
│  - Services listing                      │
│  - Location map                          │
│  - PDF downloads                         │
└──────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│        Admin Authentication              │
│  - /admin/login                          │
│  - Validates against admin.json          │
│  - Returns token                         │
│  - Stores in localStorage                │
└──────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│         Protected Routes                 │
│  - Dashboard                             │
│  - Services Manager                      │
│  - Gallery Manager                       │
│  - Locations Manager                     │
│  - PDF Manager                           │
│  - Settings                              │
└──────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│         CRUD Operations                  │
│  - Create/Update/Delete via API          │
│  - File uploads                          │
│  - Settings changes                      │
└──────────────────────────────────────────┘
```

## Limitations & Considerations

### Render Free Tier
```
✓ Pros:
  - 750 hours/month
  - Automatic HTTPS
  - Auto-deploy from GitHub
  - Free forever

✗ Cons:
  - Spins down after 15 min inactivity
  - 30-60 second cold start
  - Ephemeral file system (uploaded files lost on redeploy)
  - Limited to 512MB RAM

💡 Solutions:
  - For production: Upgrade to paid ($7/mo)
  - For files: Use cloud storage (S3, Cloudinary)
  - For database: Use MongoDB Atlas or PostgreSQL
```

### Netlify Free Tier
```
✓ Pros:
  - 100GB bandwidth/month
  - Global CDN
  - Automatic HTTPS
  - Unlimited sites
  - Auto-deploy from GitHub

✗ Cons:
  - Static hosting only (no backend)
  - Build time limited

💡 Solutions:
  - Perfect for React frontend
  - Use Render for backend API
  - Upgrade for more bandwidth if needed
```

## Recommended Upgrades

### For Production Use
```
1. Backend Database
   Replace JSON files with:
   - MongoDB Atlas (Free tier available)
   - PostgreSQL on Render ($7/mo)

2. File Storage
   Replace local storage with:
   - Cloudinary (Free tier: 25GB)
   - AWS S3 + CloudFront
   - Render Persistent Disks ($1/GB/mo)

3. Authentication
   Replace simple token with:
   - JWT tokens
   - Session management
   - Password hashing (bcrypt)

4. Monitoring
   - Uptime monitoring (UptimeRobot)
   - Error tracking (Sentry)
   - Analytics (Google Analytics)
```

## Troubleshooting Diagram

```
Issue: "Failed to connect to server"
                │
┌───────────────┴────────────────┐
│   Check Backend Status         │
│   - Is Render service running? │
│   - Check Render logs          │
└───────────────┬────────────────┘
                │
┌───────────────┴────────────────┐
│   Check Environment Variables  │
│   - VITE_API_URL correct?      │
│   - CORS_ORIGIN matches?       │
└───────────────┬────────────────┘
                │
┌───────────────┴────────────────┐
│   Test Directly                │
│   - Visit backend URL          │
│   - Test /api/services         │
│   - Wait for cold start (60s)  │
└───────────────┬────────────────┘
                │
┌───────────────┴────────────────┐
│   Verify Network               │
│   - Check browser console      │
│   - Check CORS errors          │
│   - Check network tab          │
└────────────────────────────────┘
```

---

## Summary

Your CAVC application uses a **JAMstack architecture**:
- **J**avaScript (React frontend)
- **A**PIs (Express backend on Render)
- **M**arkup (Static HTML served by Netlify)

**Benefits**:
- ✅ Fast performance (CDN)
- ✅ Scalable
- ✅ Secure (frontend/backend separation)
- ✅ Easy deployment
- ✅ Cost-effective (free tiers)
- ✅ Automatic CI/CD

**Perfect for**: Small to medium business websites with admin panel
