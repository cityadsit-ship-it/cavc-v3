# 🚀 Quick Deployment Checklist

## Prerequisites
- [ ] GitHub account with repository
- [ ] Netlify account (free)
- [ ] Render account (free)

## Backend Deployment (Render) - 10 minutes

### Step 1: Deploy to Render
1. Go to [render.com](https://render.com) → Sign in with GitHub
2. Click **"New +" → "Web Service"**
3. Select your `cavc-v3` repository
4. Configure:
   ```
   Name: cavc-backend
   Region: Oregon (Free)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://YOUR-SITE-NAME.netlify.app
   ```
   ⚠️ **Important**: Update `CORS_ORIGIN` after deploying frontend!

6. Click **"Create Web Service"**
7. ⏱️ Wait 5-10 minutes for deployment
8. ✅ Copy your backend URL: `https://cavc-backend-xxxx.onrender.com`

### Step 2: Test Backend
Visit: `https://cavc-backend-xxxx.onrender.com/api/services`
Should return JSON array of services

---

## Frontend Deployment (Netlify) - 5 minutes

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) → Sign in with GitHub
2. Click **"Add new site" → "Import an existing project"**
3. Select your `cavc-v3` repository
4. Configure:
   ```
   Branch: main
   Build command: npm run build
   Publish directory: dist
   ```

5. Add Environment Variable:
   ```
   Key: VITE_API_URL
   Value: https://cavc-backend-xxxx.onrender.com/api
   ```
   ⚠️ Use your actual Render URL from backend deployment!

6. Click **"Deploy site"**
7. ⏱️ Wait 2-3 minutes for build
8. ✅ Copy your frontend URL: `https://YOUR-SITE-NAME.netlify.app`

### Step 2: Update CORS in Render
1. Go back to Render dashboard
2. Select your backend service
3. Update Environment Variable:
   ```
   CORS_ORIGIN=https://YOUR-SITE-NAME.netlify.app
   ```
4. Save changes (backend will auto-redeploy)

---

## Verification ✅

### 1. Test Backend API
```bash
curl https://cavc-backend-xxxx.onrender.com/api/services
```
Should return services JSON

### 2. Test Frontend
Visit: `https://YOUR-SITE-NAME.netlify.app`
- [ ] Homepage loads
- [ ] Services display
- [ ] Images show correctly

### 3. Test Admin Panel
Visit: `https://YOUR-SITE-NAME.netlify.app/admin`
- [ ] Login page displays
- [ ] Can login with: `admin` / `cavc2024`
- [ ] Dashboard loads
- [ ] Services Manager shows services list
- [ ] No "Failed to connect" errors

---

## Troubleshooting 🔧

### ❌ "Failed to connect to server"
**Cause**: Frontend can't reach backend

**Fix**:
1. Check `VITE_API_URL` in Netlify matches your Render URL exactly
2. Ensure Render service is running (not sleeping)
3. Wait 60 seconds for Render cold start
4. Check Render logs for errors

### ❌ "Failed to load services"
**Cause**: API endpoint not responding

**Fix**:
1. Visit backend URL directly to wake it up
2. Check CORS settings in Render
3. Verify `server/data/services.json` exists in git
4. Check Render logs

### ❌ CORS Error in Browser Console
**Cause**: CORS_ORIGIN mismatch

**Fix**:
1. Go to Render → Environment Variables
2. Update `CORS_ORIGIN` to match Netlify URL exactly
3. Include `https://` and don't add trailing `/`

### ❌ Build Fails on Netlify
**Cause**: Missing dependencies or build errors

**Fix**:
1. Check Netlify build logs
2. Ensure `package.json` has all dependencies
3. Try building locally: `npm run build`
4. Push fixes to GitHub

### ❌ Images/PDFs Not Loading
**Cause**: Files not served correctly

**Fix**:
1. Ensure `public/images/` and `public/pdfs/` are in git
2. Check file paths in database match actual files
3. Verify static file serving in `server.js`

---

## Important URLs 📋

After deployment, save these:

```
Frontend (Netlify): https://YOUR-SITE-NAME.netlify.app
Backend (Render): https://cavc-backend-xxxx.onrender.com
Admin Panel: https://YOUR-SITE-NAME.netlify.app/admin

Default Credentials:
Username: admin
Password: cavc2024
```

⚠️ **CHANGE PASSWORD IMMEDIATELY!**

---

## Post-Deployment Tasks ✨

1. **Change Admin Password**
   - Login to admin panel
   - Go to Settings
   - Update password

2. **Test All Features**
   - [ ] Create a service
   - [ ] Upload an image
   - [ ] Edit gallery items
   - [ ] Update locations
   - [ ] Upload PDFs

3. **Bookmark URLs**
   - Save admin panel URL
   - Save API documentation

4. **Monitor Performance**
   - Check Render logs regularly
   - Monitor Netlify analytics

---

## Auto-Deployment 🔄

Both services auto-deploy on git push:

```bash
git add .
git commit -m "Update content"
git push origin main
```

- Netlify rebuilds automatically (2-3 minutes)
- Render redeploys automatically (3-5 minutes)

---

## Cost 💰

- Netlify: **FREE** (100GB bandwidth/month)
- Render: **FREE** (750 hours/month, sleeps after 15 min)

⚠️ **Render Free Tier**: Spins down after inactivity, first request takes 30-60 seconds

---

## Need Help? 🆘

1. Check [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed guide
2. Check Render logs for backend errors
3. Check Netlify deploy logs for build errors
4. Check browser console for frontend errors

---

## Success! 🎉

If you see:
- ✅ Services displaying on homepage
- ✅ Admin panel loads without errors
- ✅ Can login and manage content

**You're live in production!** 🚀
