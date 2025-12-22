# 🚀 CAVC Website - Production Transition Guide

## 📋 Overview

This guide provides step-by-step instructions for transferring the CAVC website from your development environment to the client's production environment using their GitHub account, Netlify hosting, and Hostgator domain.

---

## ✅ Pre-Transition Checklist (Completed)

The following production-readiness steps have been completed:

- ✅ Environment variables configured (.env.example created)
- ✅ Netlify configuration file (netlify.toml) created
- ✅ API URLs centralized using environment variables
- ✅ Security headers configured
- ✅ .gitignore updated to exclude sensitive data
- ✅ SPA redirect rules configured
- ✅ Static asset caching configured

---

## 🔒 Security Notes

**CRITICAL: Before transferring, ensure:**

1. **Admin Credentials**: The default admin credentials in `server/data/admin.json` are:
   - Username: `admin`
   - Password: `cavc2024`
   - ⚠️ **Client MUST change these immediately after deployment**

2. **Sensitive Files**: The following file contains sensitive data:
   - `server/data/admin.json` - Contains admin password (hashed)
   - This file is now in .gitignore but may be in git history
   - Consider asking client to change password immediately after first login

---

## 📦 Part 1: Transfer Repository to Client's GitHub

### Step 1: Prepare Current Repository

```bash
# 1. Make sure all changes are committed
git add .
git commit -m "Production ready - configured for client deployment"
git push origin main

# 2. Create a clean export (removes your git history)
# Option A: Create a zip file
git archive --format=zip --output=cavc-production.zip HEAD

# Option B: Clone fresh without history
git clone --depth 1 https://your-repo-url cavc-clean
cd cavc-clean
rm -rf .git
```

### Step 2: Client Creates New Repository

**Client's Actions:**

1. Log into their GitHub account
2. Click "New Repository"
3. Repository name: `cavc-website` (or their preferred name)
4. Make it **Private** (recommended for business sites)
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create Repository"

### Step 3: Upload Code to Client's Repository

**Option A: Client Uploads Manually (Easier)**
1. Extract the zip file you provided
2. In the new GitHub repository page, click "uploading an existing file"
3. Drag and drop all project files
4. Commit with message: "Initial commit - CAVC website"

**Option B: Push via Git (More Advanced)**
```bash
# In the project directory
git init
git add .
git commit -m "Initial commit - CAVC website"
git remote add origin https://github.com/CLIENT_USERNAME/cavc-website.git
git branch -M main
git push -u origin main
```

---

## 🌐 Part 2: Deploy to Netlify

### Step 1: Client Creates Netlify Account

1. Go to https://www.netlify.com/
2. Sign up with their GitHub account (recommended for easier integration)
3. Verify email address

### Step 2: Import Project from GitHub

1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access their GitHub account
4. Select the `cavc-website` repository
5. Configure build settings:

```
Build command: npm run build
Publish directory: dist
```

6. Click **"Deploy site"**

### Step 3: Configure Environment Variables

**IMPORTANT:** Set up environment variables before the site goes live.

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add the following variable:

```
Variable name: VITE_API_URL
Value: https://your-api-url.com/api
```

**Note:** For now, use a placeholder like `https://api.placeholder.com` - you'll update this once the backend is hosted.

3. Click **"Save"**
4. Go to **Deploys** and click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Get Netlify Site URL

After deployment, Netlify will provide a URL like:
```
https://random-name-123456.netlify.app
```

Save this URL - you'll need it for the next step.

---

## 🔗 Part 3: Connect Custom Domain (Hostgator)

### Step 1: Get Domain Information from Client

Client needs to provide:
- Domain name (e.g., `www.cityadvph.com`)
- Hostgator account access or DNS management access

### Step 2: Configure Domain in Netlify

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add a domain"**
3. Enter the client's domain: `www.cityadvph.com`
4. Netlify will provide DNS configuration instructions

### Step 3: Update DNS Records in Hostgator

**Client logs into Hostgator cPanel:**

1. Find **"Zone Editor"** or **"DNS Management"**
2. Add/Update the following records:

**For apex domain (cityadvph.com):**
```
Type: A Record
Name: @ (or leave blank)
Value: [Netlify's IP - provided by Netlify]
TTL: 3600
```

**For www subdomain (www.cityadvph.com):**
```
Type: CNAME
Name: www
Value: [your-netlify-site].netlify.app
TTL: 3600
```

**OR use Netlify's DNS (Recommended):**

1. In Netlify, go to **Domain settings** → **"Set up Netlify DNS"**
2. Netlify will provide nameservers (e.g., dns1.p01.nsone.net)
3. In Hostgator, update nameservers to Netlify's nameservers
4. Wait 24-48 hours for DNS propagation

### Step 4: Enable HTTPS

1. In Netlify dashboard, go to **Domain settings** → **HTTPS**
2. Click **"Verify DNS configuration"**
3. Once verified, click **"Provision certificate"**
4. Enable **"Force HTTPS"** (redirect HTTP to HTTPS)

---

## 🖥️ Part 4: Backend Server Setup

### ⚠️ Important: Backend Hosting Decision Needed

The current project has a Node.js backend server (`server/server.js`) that handles:
- Admin authentication
- Content management (services, locations, PDFs)
- Image uploads
- Activity logging

### Hosting Options:

#### **Option 1: Netlify Functions (Recommended - Easiest)**

Convert the Express server to Netlify Serverless Functions.

**Pros:**
- Free tier available
- Automatic scaling
- No server management
- Same platform as frontend

**Setup Required:**
1. Convert Express routes to Netlify Functions
2. Use Netlify Blob Storage for uploaded images
3. Update environment variables

**Estimated Setup Time:** 4-6 hours

#### **Option 2: Hostgator VPS/Dedicated Server**

Host the Node.js backend on Hostgator if they have VPS or dedicated hosting.

**Pros:**
- Keep current backend code
- Full control
- Client already has hosting

**Cons:**
- Requires SSH access
- Server management needed
- May require upgraded Hostgator plan

**Setup Steps:**
1. Install Node.js on server
2. Upload backend files via FTP/SSH
3. Install dependencies (`npm install`)
4. Set up PM2 or similar process manager
5. Configure firewall/security
6. Point API_URL to this server

#### **Option 3: Heroku / Railway / Render (Cloud Platform)**

Host backend on a dedicated Node.js platform.

**Pros:**
- Easy deployment
- Free/low-cost tiers
- Good documentation

**Cons:**
- Additional service to manage
- Monthly costs (after free tier)

### Current Backend Configuration

The backend currently:
- Runs on port 3001
- Stores data in JSON files (`server/data/*.json`)
- Serves images from `public/images/`
- Serves PDFs from `public/pdfs/`

### Action Required:

**Choose hosting option with client and then:**

1. Update `VITE_API_URL` in Netlify environment variables
2. Deploy backend to chosen platform
3. Test admin panel functionality
4. Verify image uploads work
5. Test PDF management

---

## 🔐 Part 5: Post-Deployment Security Checklist

### Immediate Actions After Deployment:

1. **Change Admin Password**
   - Client logs in with default credentials (admin/cavc2024)
   - Goes to Settings → Change Password
   - Uses strong password (minimum 12 characters, mixed case, numbers, symbols)

2. **Update Admin Email**
   - Add client's email for notifications/recovery

3. **Backup Configuration**
   - Export all service data
   - Save copy of images and PDFs
   - Document custom configurations

4. **Test Everything**
   - Homepage loads correctly
   - All service galleries work
   - Contact form submits
   - Map displays properly
   - Admin panel accessible
   - Image uploads work
   - PDF uploads work

5. **Monitor Analytics** (Optional but Recommended)
   - Add Google Analytics
   - Set up Netlify Analytics
   - Monitor for errors

---

## 📊 Part 6: Content Management Guide for Client

### Accessing Admin Panel

URL: `https://www.cityadvph.com/admin/login`

Login with credentials provided (must change on first login).

### Admin Panel Features:

1. **Dashboard** - Overview of locations and recent activity
2. **Services Manager** - Add/edit/delete services
3. **Gallery Manager** - Manage service images
4. **Locations Manager** - Update coverage areas
5. **PDF Manager** - Upload/manage PDF brochures
6. **Settings** - Change password and email

### Content Update Workflow:

**To Add a New Service:**
1. Go to Services Manager
2. Click "Add New Service"
3. Fill in title, description, folder name
4. Click "Save"
5. Click "Manage Gallery" to add images
6. Upload images with captions
7. Upload PDF brochure if available

**To Update Service Images:**
1. Go to Services Manager
2. Click "Manage Gallery" on the service
3. Add/edit/delete images
4. Changes are live immediately

---

## 🛠️ Part 7: Developer Handoff Information

### Project Structure:
```
cavc-v3/
├── public/              # Static assets
│   ├── images/         # Service images
│   └── pdfs/           # PDF brochures
├── server/             # Backend API
│   ├── server.js       # Express server
│   └── data/           # JSON data storage
├── src/                # React frontend
│   ├── components/     # UI components
│   ├── pages/          # Route pages
│   │   └── admin/      # Admin panel
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utilities
├── .env.example        # Environment template
├── netlify.toml        # Netlify configuration
└── package.json        # Dependencies
```

### Technology Stack:
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** JSON files (consider upgrading to MongoDB/PostgreSQL for production)
- **Authentication:** JWT tokens (stored in localStorage)
- **File Uploads:** Multer (local storage)

### Environment Variables:
```bash
# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com/api

# Backend (server environment)
PORT=3001
NODE_ENV=production
```

### Recommended Upgrades (Future):
1. **Database:** Migrate from JSON to MongoDB or PostgreSQL
2. **Authentication:** Add password reset via email
3. **File Storage:** Use cloud storage (AWS S3, Cloudinary)
4. **Caching:** Implement Redis for better performance
5. **Monitoring:** Add error tracking (Sentry)
6. **Backups:** Automated daily backups
7. **CDN:** Use Cloudflare for faster global delivery

---

## 📞 Part 8: Support & Troubleshooting

### Common Issues and Solutions:

**Issue: Admin login fails**
- Check if backend server is running
- Verify VITE_API_URL is correct in Netlify
- Check browser console for CORS errors
- Verify credentials (admin/cavc2024 initially)

**Issue: Images not displaying**
- Check if images uploaded correctly
- Verify image paths in service data
- Check Netlify build logs for errors
- Ensure public folder is being served

**Issue: Domain not working**
- DNS propagation takes 24-48 hours
- Check DNS records in Hostgator
- Use https://dnschecker.org to verify propagation
- Ensure SSL certificate is provisioned in Netlify

**Issue: Site builds but shows blank page**
- Check browser console for errors
- Verify environment variables are set
- Check Netlify deploy logs
- Ensure all dependencies are in package.json

### Getting Help:

1. **Netlify Support:** https://answers.netlify.com/
2. **GitHub Issues:** Create issues in the repository
3. **Documentation:** Check README.md and other docs
4. **Build Logs:** Always check Netlify deploy logs first

---

## 📝 Transition Checklist for Client

Print and check off each step:

### Pre-Transfer
- [ ] Received project files (zip or git repository)
- [ ] Have GitHub account ready
- [ ] Have Netlify account ready
- [ ] Have Hostgator cPanel access
- [ ] Have domain name information

### GitHub Setup
- [ ] Created new private repository
- [ ] Uploaded project code
- [ ] Repository is accessible

### Netlify Setup
- [ ] Signed up for Netlify
- [ ] Connected GitHub account
- [ ] Imported repository
- [ ] Configured build settings
- [ ] Set environment variables
- [ ] Site deployed successfully
- [ ] Noted Netlify site URL

### Domain Setup
- [ ] Added custom domain in Netlify
- [ ] Updated DNS records in Hostgator
- [ ] SSL certificate provisioned
- [ ] Force HTTPS enabled
- [ ] Domain working (wait 24-48h if needed)

### Backend Setup (Choose One)
- [ ] Option selected with developer
- [ ] Backend deployed
- [ ] VITE_API_URL updated in Netlify
- [ ] Backend tested and working

### Security & Access
- [ ] Logged into admin panel
- [ ] Changed default password
- [ ] Updated admin email
- [ ] Saved new credentials securely

### Testing
- [ ] Homepage loads
- [ ] All services display
- [ ] Image galleries work
- [ ] Contact form works
- [ ] Map displays
- [ ] Admin panel accessible
- [ ] Can add/edit content
- [ ] Can upload images
- [ ] Can upload PDFs

### Final Steps
- [ ] Created content backup
- [ ] Reviewed content management guide
- [ ] Tested mobile responsiveness
- [ ] Set up analytics (optional)
- [ ] Bookmarked admin panel URL

---

## 🎉 Congratulations!

Your CAVC website is now live in production!

**Next Steps:**
1. Train client staff on content management
2. Schedule regular backups
3. Monitor site performance
4. Plan for future enhancements

**Maintenance Schedule:**
- **Daily:** Monitor site uptime
- **Weekly:** Check admin activity logs
- **Monthly:** Review analytics, backup data
- **Quarterly:** Update dependencies, security patches

---

## 📧 Contact Information

For technical support or questions during transition, contact:
- Developer: [Your Email]
- Emergency: [Your Phone]

**Client Resources:**
- Admin Panel: https://www.cityadvph.com/admin/login
- Netlify Dashboard: https://app.netlify.com/
- GitHub Repository: https://github.com/CLIENT_USERNAME/cavc-website

---

*Last Updated: December 18, 2025*
*Version: 1.0*
