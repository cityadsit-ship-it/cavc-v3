# ⚠️ CRITICAL VERCEL DEPLOYMENT CHECKLIST

## 🚨 IMPORTANT WARNINGS

### Data Persistence Issue
**Vercel serverless functions are STATELESS** - any changes to JSON files will NOT persist between deployments or function invocations. This means:

- ❌ Admin panel edits (services, locations, PDFs, settings) will NOT be saved
- ❌ Uploaded images/PDFs will be LOST after deployment
- ❌ Activity logs will NOT persist

### ✅ SOLUTIONS FOR PRODUCTION

You MUST choose one of these options before going live:

#### Option 1: Use External Database (RECOMMENDED)
1. Set up MongoDB Atlas (free tier available)
2. Replace JSON file storage with database operations
3. Store images in cloud storage (Cloudinary, AWS S3)

#### Option 2: Deploy Backend Separately
1. Deploy backend to persistent platform:
   - Railway (https://railway.app) - Free tier
   - Render (https://render.com) - Free tier
   - Heroku (paid)
   - DigitalOcean (paid)
2. Deploy frontend to Vercel
3. Set `VITE_API_URL` environment variable in Vercel

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. GitHub Repository Setup
- [ ] All code pushed to GitHub main/master branch
- [ ] `.gitignore` includes `node_modules/` and `.env`
- [ ] All dependencies in `package.json` are correct
- [ ] Data files are committed: `server/data/*.json`

### 2. Backend Deployment (CHOOSE ONE)

#### Option A: Separate Backend (RECOMMENDED)
- [ ] Backend deployed to Railway/Render
- [ ] Backend URL is accessible (test with Postman)
- [ ] CORS configured for your Vercel domain
- [ ] All API endpoints working

#### Option B: Vercel Serverless (LIMITED)
- [ ] Understand data will NOT persist
- [ ] Only use for testing/demo purposes
- [ ] Plan migration to database later

### 3. Vercel Project Setup
- [ ] Create new project in Vercel
- [ ] Connect to your GitHub repository
- [ ] Select the correct branch (main/master)

### 4. Environment Variables in Vercel

**REQUIRED Environment Variables:**

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Backend API URL (if separate) OR `/api` (if Vercel) |
| `NODE_VERSION` | `18` | Node.js version |

**Optional Environment Variables:**

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `CORS_ORIGIN` | `https://cavc.vercel.app` | Frontend domain for CORS |

### 5. Build Settings in Vercel

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 6. Deployment Steps

1. **Connect Repository**
   ```
   Vercel Dashboard → Add New Project → Import Git Repository
   ```

2. **Configure Project**
   - Root Directory: `./` (leave as default)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`

3. **Add Environment Variables**
   ```
   Settings → Environment Variables → Add
   - VITE_API_URL = [your-backend-url]/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Test all functionality

### 7. Post-Deployment Verification

**Frontend Tests:**
- [ ] Homepage loads correctly
- [ ] All images display
- [ ] Services section works
- [ ] Contact form appears
- [ ] Map displays correctly
- [ ] Navigation works

**Admin Panel Tests:**
- [ ] Can access `/admin/login`
- [ ] Login with credentials works
- [ ] Dashboard displays data
- [ ] Services manager loads
- [ ] Locations manager works
- [ ] Can view (but may not persist changes)

**API Tests (Critical!):**
- [ ] `GET /api/services` returns data
- [ ] `GET /api/locations` returns data
- [ ] `POST /api/auth/login` authenticates
- [ ] Admin operations work (if using separate backend)

### 8. Common Issues & Solutions

#### Issue: Build Fails
```bash
# Solution: Check build logs
# Common causes:
- Missing dependencies in package.json
- Environment variables not set
- Build command incorrect
```

#### Issue: API Calls Fail (404)
```bash
# Solution: Check VITE_API_URL
# Should be: https://your-backend-url.com/api
# NOT: http://localhost:3001/api
```

#### Issue: CORS Errors
```bash
# Solution: Configure CORS in backend
# Add your Vercel domain to allowed origins
```

#### Issue: Images Don't Load
```bash
# Solution: Check image paths
# Public folder images should be in /public
# Vercel serves public folder at root /
```

## 🔐 SECURITY CHECKLIST

- [ ] Change default admin password after deployment
- [ ] Use HTTPS for backend API
- [ ] Don't commit `.env` files with secrets
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for your domain (not *)

## 📊 Recommended Architecture

### For Production (RECOMMENDED):

```
GitHub Repository
    ↓
Vercel (Frontend)
    ↓ API Calls
Railway/Render (Backend API)
    ↓
MongoDB Atlas (Database)
    ↓
Cloudinary (Image Storage)
```

### For Testing Only:

```
GitHub Repository
    ↓
Vercel (Frontend + Serverless API)
    ↓
⚠️ JSON files (NOT PERSISTENT)
```

## 🚀 DEPLOYMENT COMMANDS

### Deploy from CLI (Optional)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variable
vercel env add VITE_API_URL production
```

### Redeploy After Changes
```bash
# Commit and push to GitHub
git add .
git commit -m "Update"
git push origin main

# Vercel auto-deploys from GitHub
# Or force redeploy:
vercel --prod
```

## 📝 FINAL NOTES

1. **Data Persistence**: If you deploy to Vercel without a separate backend, admin changes WILL NOT SAVE. This is suitable for DEMO ONLY.

2. **Production Use**: For real production use, you MUST deploy backend separately to Railway, Render, or similar platform with persistent storage.

3. **Cost**: 
   - Vercel: Free for personal projects
   - Railway: Free tier available
   - MongoDB Atlas: Free tier (512MB)
   - Cloudinary: Free tier (25GB)

4. **Support**: If you need help with database migration or backend deployment, create a separate task for implementation.

## ✅ READY TO DEPLOY?

Before clicking "Deploy" in Vercel, confirm:
- ✅ Backend is deployed and working (if separate)
- ✅ `VITE_API_URL` environment variable is set
- ✅ All code is pushed to GitHub
- ✅ You understand data persistence limitations

**Current Setup Status:**
- ✅ Vercel configuration created (`vercel.json`)
- ✅ Server supports environment variables
- ✅ CORS configured
- ✅ API endpoints ready
- ⚠️ Using JSON file storage (not persistent on Vercel serverless)
- ⚠️ No database configured (needs migration for production)

---

**Need Help?** 
- Database migration guide: Ask for "MongoDB migration for admin panel"
- Backend deployment: Ask for "Deploy backend to Railway guide"
- Issues: Check deployment logs in Vercel dashboard
