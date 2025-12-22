# Complete Deployment Guide - CAVC Website

This guide covers the complete deployment process for the CAVC website from GitHub to production, including frontend (Netlify), backend (Render), and custom domain configuration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Custom Domain Setup](#custom-domain-setup)
5. [CORS Configuration](#cors-configuration)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Quick Reference Checklist](#quick-reference-checklist)

---

## Prerequisites

### Required Files & Configuration

#### Root Directory
- ✅ `netlify.toml` - Netlify configuration
- ✅ `render.yaml` - Render configuration
- ✅ `package.json` - Frontend dependencies
- ✅ `.gitignore` - Git ignore rules

#### Server Directory
- ✅ `server/package.json` - Backend dependencies
- ✅ `server/package-lock.json` - **CRITICAL** for Render builds
- ✅ `server/server.js` - Backend API server
- ✅ `server/data/*.json` - Database files

### GitHub Repository
- Repository must be pushed to GitHub
- All files committed and synced
- `server/package-lock.json` must be included (not in .gitignore)

---

## Frontend Deployment (Netlify)

### Step 1: Initial Netlify Setup

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Sign in with GitHub

2. **Create New Site**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"GitHub"**
   - Authorize Netlify to access your repository
   - Select your repository (e.g., `cavc-v3`)

3. **Configure Build Settings**
   ```yaml
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

4. **Add Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Click **"Add a variable"**
   
   **Required Variable:**
   ```
   Key: VITE_API_URL
   Value: https://your-backend.onrender.com/api
   ```
   
   **Note:** Initially use `http://localhost:3001/api` until backend is deployed

5. **Deploy Site**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build to complete
   - Note your Netlify URL: `https://[random-name].netlify.app`

### Step 2: Verify Frontend Deployment

- ✅ Check build logs for errors
- ✅ Visit your Netlify URL
- ✅ Test homepage loads correctly
- ✅ Verify all assets load (images, CSS)

### Common Frontend Issues

| Issue | Solution |
|-------|----------|
| 404 error on Netlify | Add redirects in `netlify.toml` |
| Build fails | Check `package.json` scripts, run `npm run build` locally first |
| Environment variable not working | Redeploy after adding variables |
| Assets not loading | Check `vite.config.js` base path settings |

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Render

**CRITICAL: Generate package-lock.json**

```bash
cd server
npm install
cd ..
git add server/package-lock.json
git commit -m "Add package-lock.json for Render"
git push
```

**Why this is important:** Render requires `package-lock.json` for reliable builds. Without it, builds will fail!

### Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Click **"Connect"** next to your repository

3. **Configure Build Settings**
   ```yaml
   Name: cavc-backend (or any name)
   Region: Oregon (Free)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Choose Plan**
   - Select **"Free"** plan
   - Note: Free tier sleeps after 15 minutes of inactivity

5. **Add Environment Variables**
   
   **Required Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   CORS_ORIGIN = https://your-netlify-site.netlify.app,https://yourdomain.com
   ```
   
   **Important:** For multiple domains, separate with commas (no spaces)

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for initial build
   - Note your Render URL: `https://cavc-backend-xyz.onrender.com`

### Step 3: Update Frontend with Backend URL

1. **Update Netlify Environment Variable**
   - Go to Netlify Dashboard → Your site → **Environment variables**
   - Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```

2. **Redeploy Frontend**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Wait 2-3 minutes

### Common Backend Issues

| Issue | Solution |
|-------|----------|
| Build fails: "Missing script: build" | Remove `buildCommand` or set to `npm install` |
| Build fails: "Cannot find module" | Ensure `package-lock.json` exists in server directory |
| CORS errors | Update `CORS_ORIGIN` environment variable |
| 502 Bad Gateway | Check Render logs, server might be crashing |
| Slow first load | Free tier sleeps - upgrade to paid plan or keep alive |

---

## Custom Domain Setup

### Connecting Domains from HostGator/cPanel to Netlify

#### Step 1: Add Domain in Netlify

1. **Go to Netlify Dashboard** → Your site → **Domain management**
2. Click **"Add custom domain"** or **"Add domain alias"**
3. Enter your domain (e.g., `cityadvertisingventures.com`)
4. Click **"Verify"**
5. Repeat for www subdomain (`www.cityadvertisingventures.com`)
6. **Note the DNS instructions** Netlify provides

#### Step 2: Configure DNS (Two Options)

##### **Option A: CNAME/A Record Method (Using HostGator/cPanel DNS)**

**In cPanel:**

1. Log into cPanel
2. Find **"Zone Editor"** (under Domains)
3. Select your domain
4. **Add these records:**

**For www subdomain:**
```
Type: CNAME
Name: www
Points to: your-site.netlify.app
TTL: 14400
```

**For root domain:**
```
Type: A
Name: @ (or leave blank)
Address: 75.2.60.5
TTL: 14400
```

**Important:** Verify the A record IP in Netlify's domain settings (usually `75.2.60.5`)

5. **Delete conflicting records** (old A records, parking pages, etc.)

##### **Option B: Netlify DNS (Recommended for Multiple Domains)**

1. **In Netlify** → Domain management → **"Set up Netlify DNS"**
2. Netlify will show 4 nameservers like:
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```

3. **In HostGator/Domain Registrar:**
   - Go to **Domain Management**
   - Find your domain
   - Click **"Manage Nameservers"**
   - Replace with Netlify's 4 nameservers
   - Save

⚠️ **Warning:** This transfers ALL DNS control to Netlify. Email services will need reconfiguration.

#### Step 3: Wait for DNS Propagation

- **Time:** 15 minutes to 48 hours (usually 1-4 hours)
- **Check propagation:** https://dnschecker.org
- Enter your domain and verify it points to Netlify IP or CNAME

#### Step 4: Enable HTTPS

1. **After DNS verifies** (green checkmark in Netlify)
2. Go to **Domain management** → **HTTPS**
3. Click **"Verify DNS configuration"**
4. Click **"Provision certificate"** (takes 1-5 minutes)
5. Enable **"Force HTTPS"** (redirects HTTP to HTTPS)

### Adding Multiple Domains

To add additional domains (e.g., `cityadvertising.com.ph`):

1. **Repeat Step 1-4 above** for each domain
2. All domains will point to the same Netlify site
3. No code changes needed
4. They all use the same backend API

**Example Configuration:**
```
✅ cityadvertisingventures.com    → cavc2025.netlify.app
✅ www.cityadvertisingventures.com → cavc2025.netlify.app
✅ cityadvertising.com.ph          → cavc2025.netlify.app
✅ www.cityadvertising.com.ph      → cavc2025.netlify.app
```

---

## CORS Configuration

### Why CORS Matters

CORS (Cross-Origin Resource Sharing) controls which domains can access your backend API. If not configured correctly, your frontend will fail to communicate with the backend.

### Single Domain CORS (Simple)

**In `server/server.js`:**
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

**Render Environment Variable:**
```
CORS_ORIGIN = https://yourdomain.com
```

### Multiple Domains CORS (Recommended)

**In `server/server.js`:**
```javascript
// Parse multiple origins from comma-separated string
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Render Environment Variable:**
```
CORS_ORIGIN = https://cityadvertisingventures.com,https://www.cityadvertisingventures.com,https://cityadvertising.com.ph,https://www.cityadvertising.com.ph,https://cavc2025.netlify.app
```

### CORS Troubleshooting

**Error:** `Access to fetch... has been blocked by CORS policy`

**Solutions:**
1. ✅ Add the domain to `CORS_ORIGIN` environment variable in Render
2. ✅ Separate multiple domains with commas (no spaces)
3. ✅ Include both www and non-www versions
4. ✅ Redeploy Render after changing environment variables
5. ✅ Clear browser cache or use incognito mode to test

---

## Common Issues & Solutions

### 1. "Site not found" on Custom Domain

**Symptoms:**
- Netlify subdomain works: `https://cavc2025.netlify.app` ✅
- Custom domain shows 404: `https://yourdomain.com` ❌

**Solutions:**
1. Check if domain is added in Netlify Domain management
2. Verify DNS records in cPanel/HostGator:
   ```bash
   nslookup yourdomain.com
   nslookup www.yourdomain.com
   ```
3. Check DNS propagation: https://dnschecker.org
4. Wait 24-48 hours for full DNS propagation
5. Clear browser cache (Ctrl + Shift + Delete)

---

### 2. CORS Error After Deployment

**Symptoms:**
```
Access to fetch at 'https://backend.onrender.com/api/...' from origin 'https://yourdomain.com' 
has been blocked by CORS policy
```

**Solutions:**
1. **Add domain to Render CORS_ORIGIN:**
   - Go to Render → Environment → Edit `CORS_ORIGIN`
   - Add: `https://yourdomain.com,https://www.yourdomain.com`
   - Save (triggers automatic redeploy)

2. **Update server.js** with multi-origin CORS (see CORS Configuration section above)

3. **Push changes to GitHub:**
   ```bash
   git add server/server.js
   git commit -m "Fix CORS for multiple domains"
   git push
   ```

4. **Wait for Render redeploy** (2-3 minutes)

5. **Test in incognito mode** to bypass cache

---

### 3. Backend Build Fails on Render

**Symptoms:**
```
npm error Missing script: "build"
npm error A complete log of this run can be found in: ...
```

**Solutions:**

**Option 1: Generate package-lock.json (Most Common)**
```bash
cd server
npm install
cd ..
git add server/package-lock.json
git commit -m "Add package-lock.json"
git push
```

**Option 2: Update render.yaml**
```yaml
services:
  - type: web
    name: cavc-backend
    buildCommand: npm install  # Changed from npm ci
    startCommand: node server.js
```

**Option 3: Add build script to server/package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'"
  }
}
```

---

### 4. Environment Variables Not Working

**Symptoms:**
- API calls fail
- Backend can't connect to database
- Features work locally but not in production

**Solutions:**

1. **Check Netlify Environment Variables:**
   - Go to Site settings → Environment variables
   - Verify `VITE_API_URL` is set correctly
   - Must start with `VITE_` for Vite projects
   - Example: `VITE_API_URL=https://backend.onrender.com/api`

2. **Check Render Environment Variables:**
   - Go to Environment tab
   - Verify `CORS_ORIGIN`, `NODE_ENV`, `PORT`

3. **Redeploy After Adding Variables:**
   - Netlify: Deploys → Trigger deploy → Clear cache and deploy
   - Render: Automatically redeploys when env vars change

4. **Local Testing:**
   ```bash
   # Test locally first
   echo $VITE_API_URL  # Should show your API URL
   npm run build       # Should succeed
   ```

---

### 5. 502 Bad Gateway on Render

**Symptoms:**
- Backend URL returns 502 error
- Render shows "Service unavailable"

**Solutions:**

1. **Check Render Logs:**
   - Go to Render Dashboard → Your service → Logs
   - Look for crash messages or errors

2. **Common Causes:**
   - Port not set correctly (must use `process.env.PORT`)
   - Missing dependencies in package.json
   - Data directory missing or incorrect paths
   - Server crash on startup

3. **Verify server.js:**
   ```javascript
   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Redeploy:**
   - Manual Deploy → Clear build cache & deploy

---

### 6. Images/Assets Not Loading

**Symptoms:**
- Website loads but images are broken
- Console shows 404 errors for assets

**Solutions:**

1. **Check public directory structure:**
   ```
   public/
   ├── images/
   │   ├── hero/
   │   ├── services/
   │   └── cavclogo.png
   └── pdfs/
   ```

2. **Verify image paths in code:**
   ```javascript
   // ✅ Correct (relative to public)
   <img src="/images/hero/1.webp" />
   
   // ❌ Wrong
   <img src="./public/images/hero/1.webp" />
   ```

3. **Check Netlify headers in netlify.toml:**
   ```toml
   [[headers]]
     for = "/images/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   ```

4. **Verify build includes public directory:**
   - Check `dist/` folder after build
   - Should contain `images/` and `pdfs/` folders

---

### 7. Admin Panel Not Accessible

**Symptoms:**
- `/admin/login` shows 404
- Admin routes not working in production

**Solutions:**

1. **Check netlify.toml redirects:**
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
   This enables SPA routing for React Router

2. **Verify React Router configuration:**
   ```javascript
   <BrowserRouter>
     <Routes>
       <Route path="/admin/login" element={<AdminLogin />} />
       {/* ... */}
     </Routes>
   </BrowserRouter>
   ```

3. **Test locally first:**
   ```bash
   npm run build
   npm run preview
   # Navigate to http://localhost:4173/admin/login
   ```

---

## Quick Reference Checklist

### Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] `server/package-lock.json` exists and committed
- [ ] `.env` files NOT committed (use environment variables instead)
- [ ] `npm run build` works locally without errors
- [ ] Backend runs locally: `cd server && node server.js`
- [ ] Frontend runs locally: `npm run dev`

### Netlify Deployment Checklist

- [ ] Repository connected to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Build succeeds (green checkmark)
- [ ] Site accessible via Netlify URL

### Render Deployment Checklist

- [ ] Repository connected to Render
- [ ] Root directory: `server`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables: `NODE_ENV`, `PORT`, `CORS_ORIGIN`
- [ ] Build succeeds and service is "Live"
- [ ] API endpoint responds: `https://backend.onrender.com/api/services`

### Custom Domain Checklist

- [ ] Domain added in Netlify
- [ ] DNS CNAME for www → `yoursite.netlify.app`
- [ ] DNS A record for @ → `75.2.60.5`
- [ ] Old/conflicting DNS records deleted
- [ ] DNS propagation complete (check dnschecker.org)
- [ ] SSL certificate provisioned in Netlify
- [ ] HTTPS enabled and forced
- [ ] Domain accessible and shows correct site

### Post-Deployment Testing

- [ ] Homepage loads correctly
- [ ] All images display properly
- [ ] Service pages work
- [ ] Admin login accessible
- [ ] Admin panel functions (CRUD operations)
- [ ] PDF downloads work
- [ ] Contact form submits (if applicable)
- [ ] Mobile responsive
- [ ] All custom domains work

---

## Useful Commands

### Local Development
```bash
# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Backend
cd server
node server.js           # Start backend server
```

### Git Commands
```bash
git status               # Check file changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
```

### DNS Verification
```bash
# Windows
nslookup yourdomain.com
nslookup www.yourdomain.com

# Check specific record type
nslookup -type=A yourdomain.com
nslookup -type=CNAME www.yourdomain.com
```

### Debugging
```bash
# Check if backend is running
curl https://backend.onrender.com/api/services

# Check CORS headers
curl -I -X OPTIONS https://backend.onrender.com/api/services \
  -H "Origin: https://yourdomain.com"
```

---

## Important URLs

### Development
- Local Frontend: http://localhost:5173
- Local Backend: http://localhost:3001

### Production
- Netlify Dashboard: https://app.netlify.com
- Render Dashboard: https://dashboard.render.com
- GitHub Repository: https://github.com/yourusername/cavc-v3

### Tools
- DNS Checker: https://dnschecker.org
- SSL Checker: https://www.sslshopper.com/ssl-checker.html
- CORS Test: https://www.test-cors.org

---

## Support & Resources

### Documentation
- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- Vite Docs: https://vitejs.dev/guide
- React Router Docs: https://reactrouter.com

### Common Error Messages

| Error | Where to Look | Solution |
|-------|---------------|----------|
| 404 Not Found | Netlify redirects | Add SPA redirect in netlify.toml |
| 502 Bad Gateway | Render logs | Check server startup logs |
| CORS Error | Browser console | Update CORS_ORIGIN in Render |
| Build Failed | Build logs | Check package.json and dependencies |
| SSL Certificate Error | Netlify domain settings | Re-provision certificate |

---

## Maintenance & Updates

### Making Code Changes

1. **Update code locally**
2. **Test locally:** `npm run dev` and `cd server && node server.js`
3. **Commit changes:** `git add . && git commit -m "description"`
4. **Push to GitHub:** `git push`
5. **Auto-deploy:** Netlify and Render will automatically rebuild

### Updating Environment Variables

1. **Netlify:** Site settings → Environment variables → Edit → Save → Redeploy
2. **Render:** Environment tab → Edit → Save (auto-redeploys)

### Monitoring

- **Netlify:** Check deploy status and logs regularly
- **Render:** Monitor uptime (free tier sleeps after 15 mins)
- **DNS:** If changing domains, allow 24-48 hours for propagation

---

## Emergency Rollback

If a deployment breaks production:

### Netlify Rollback
1. Go to Deploys tab
2. Find last working deploy
3. Click **"..."** → **"Publish deploy"**
4. Previous version restored instantly

### Render Rollback
1. Go to Render Dashboard → Service → Manual Deploy
2. Select previous commit
3. Click **"Deploy"**
4. Wait 2-3 minutes

### Git Rollback
```bash
# Find commit to rollback to
git log --oneline

# Rollback
git revert <commit-hash>
git push
```

---

## Notes

- **Free Tier Limitations:**
  - Render: Sleeps after 15 minutes, 750 hours/month
  - Netlify: 100 GB bandwidth, 300 build minutes/month

- **DNS Propagation:** Always allow 24-48 hours for full global propagation

- **HTTPS:** Never mix HTTP and HTTPS - always force HTTPS in production

- **Environment Variables:** Never commit `.env` files - always use platform env vars

---

**Last Updated:** December 22, 2025  
**Version:** 1.0  
**Project:** City Advertising Ventures Corporation Website
