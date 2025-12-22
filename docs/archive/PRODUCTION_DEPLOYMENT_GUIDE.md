# Production Deployment Guide

This guide will help you deploy your CAVC application to production:
- **Frontend**: Netlify
- **Backend**: Render (Free Tier)

## 🚀 Quick Start

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `cavc-backend`
     - **Region**: Oregon (Free)
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables** (in Render dashboard)
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://your-actual-site.netlify.app
   ```
   ⚠️ Replace `your-actual-site` with your actual Netlify URL after Step 2

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes for first deploy)
   - Copy your Render URL: `https://cavc-backend-xxxx.onrender.com`

### Step 2: Deploy Frontend to Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository
   - Configure:
     - **Branch**: `main`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Add Environment Variable** (Site settings → Environment variables)
   ```
   VITE_API_URL=https://cavc-backend-xxxx.onrender.com/api
   ```
   ⚠️ Use your actual Render URL from Step 1

4. **Deploy**
   - Click "Deploy site"
   - Wait for build (2-3 minutes)
   - Copy your Netlify URL

5. **Update CORS in Render**
   - Go back to Render dashboard
   - Update `CORS_ORIGIN` environment variable with your actual Netlify URL
   - Redeploy backend

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Backend is running: Visit `https://your-backend.onrender.com/api/services`
- [ ] Frontend loads: Visit your Netlify URL
- [ ] Services display on homepage
- [ ] Admin login works at `/admin`
- [ ] Can create/edit services in admin panel
- [ ] Images upload correctly
- [ ] PDFs upload and display

## ⚠️ Important Notes

### Render Free Tier Limitations
- **Spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds
- Limited to 750 hours/month (sufficient for testing)
- Consider upgrading for production use

### Handling Cold Starts
Your frontend should show loading states while waiting for the backend to wake up.

### Security Considerations
1. Change default admin credentials immediately:
   - Login to admin panel
   - Go to Settings
   - Update password

2. Consider adding JWT authentication for production

## 🔧 Troubleshooting

### "Failed to connect to server" Error
**Problem**: Frontend can't reach backend

**Solutions**:
1. Check if backend is running on Render
2. Verify `VITE_API_URL` is set correctly in Netlify
3. Check CORS settings in Render
4. Wait 60 seconds for Render to wake up from sleep

### Services Not Loading
**Problem**: API returns errors

**Solutions**:
1. Check Render logs for errors
2. Verify `server/data/` files exist in repository
3. Ensure all dependencies installed correctly

### Images/PDFs Not Displaying
**Problem**: Static files not serving correctly

**Solutions**:
1. Verify files exist in `public/` directory
2. Check file paths in database
3. Ensure Render serves static files correctly

### Admin Login Fails
**Problem**: Authentication not working

**Solutions**:
1. Check `server/data/admin.json` exists
2. Verify credentials (default: admin/cavc2024)
3. Check browser console for errors

## 📁 Required Files Checklist

Ensure these files are in your GitHub repository:

### Backend (server/)
- ✅ `server.js`
- ✅ `package.json`
- ✅ `data/services.json`
- ✅ `data/admin.json`
- ✅ `data/locations.json`
- ✅ `data/pdfs.json`
- ✅ `data/activity-logs.json`

### Frontend
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `netlify.toml`
- ✅ `src/lib/api-config.js`
- ✅ `public/images/`
- ✅ `public/pdfs/`

## 🔄 Continuous Deployment

Both Netlify and Render auto-deploy on git push:

1. Make changes locally
2. Commit: `git commit -m "your message"`
3. Push: `git push origin main`
4. Netlify and Render automatically rebuild

## 💡 Tips for Success

1. **Test Locally First**: Always run `npm run dev:all` locally before pushing
2. **Check Logs**: Use Render logs to debug backend issues
3. **Environment Variables**: Double-check all URLs are correct
4. **CORS**: Ensure frontend URL matches CORS_ORIGIN exactly
5. **Data Backup**: Keep backups of `server/data/` files

## 📞 Support

If you encounter issues:
1. Check Render logs (Render dashboard → Logs)
2. Check Netlify deploy logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## 🎉 Success!

If everything is working:
- ✅ Your site is live on Netlify
- ✅ Backend API is running on Render
- ✅ Admin panel is accessible
- ✅ Services are displaying correctly

Remember to change your admin password immediately!
