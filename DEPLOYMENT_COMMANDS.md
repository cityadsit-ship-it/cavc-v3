# 🚀 Developer Handoff Commands

## Quick Command Reference for Production Deployment

### Pre-Deployment Testing

```bash
# Test production build locally
npm run build
npm run preview

# Check for build errors
npm run lint

# Run both frontend and backend
npm run dev:all
```

### Export Project for Client

```bash
# Option 1: Create clean zip (recommended)
git archive --format=zip --output=cavc-production.zip HEAD

# Option 2: Clone without history
git clone --depth 1 [your-repo-url] cavc-clean
cd cavc-clean
rm -rf .git

# Option 3: Just push to your GitHub (they'll transfer)
git add .
git commit -m "Production ready - configured for deployment"
git push origin main
```

### Client Repository Setup (Client runs these)

```bash
# Initialize and push to their GitHub
cd cavc-production-folder
git init
git add .
git commit -m "Initial commit - CAVC website"
git branch -M main
git remote add origin https://github.com/CLIENT_USERNAME/cavc-website.git
git push -u origin main
```

### Environment Variables to Configure

**In Netlify Dashboard → Site Settings → Environment Variables:**

```env
VITE_API_URL=https://your-backend-url.com/api
```

**For local development (.env):**

```env
VITE_API_URL=http://localhost:3001/api
VITE_SITE_URL=http://localhost:5173
```

### Netlify Deployment (via Netlify CLI - Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod

# Set environment variables via CLI
netlify env:set VITE_API_URL "https://your-api-url.com/api"
```

### Backend Deployment Options

#### Option 1: Hostgator VPS (if available)

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Upload files via SCP or git
git clone https://github.com/CLIENT/cavc-website.git
cd cavc-website

# Install dependencies
npm install --production

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server/server.js --name cavc-api
pm2 save
pm2 startup
```

#### Option 2: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Option 3: Render.com

1. Create account at render.com
2. New → Web Service
3. Connect GitHub repository
4. Build Command: `npm install`
5. Start Command: `node server/server.js`
6. Deploy

### DNS Configuration (Hostgator)

**For apex domain (cityadvph.com):**
```
Type: A
Host: @
Points to: [Netlify Load Balancer IP]
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Host: www
Points to: [sitename].netlify.app
TTL: 3600
```

**Or use Netlify DNS (recommended):**
1. In Netlify: Domain Settings → "Set up Netlify DNS"
2. Get nameservers (e.g., dns1.p01.nsone.net)
3. In Hostgator: Update nameservers to Netlify's

### Post-Deployment Verification

```bash
# Check if site is live
curl -I https://www.cityadvph.com

# Test API endpoint
curl https://your-api-url.com/api/services

# Check SSL certificate
openssl s_client -connect www.cityadvph.com:443 -servername www.cityadvph.com

# DNS propagation check
nslookup www.cityadvph.com
dig www.cityadvph.com
```

### Troubleshooting Commands

```bash
# Check Netlify deploy logs
netlify logs

# View build logs
netlify build

# Test local build
npm run build && npm run preview

# Clear Netlify cache and redeploy
# (Do this in Netlify dashboard: Deploys → Trigger Deploy → Clear cache)

# Check backend server status
pm2 status
pm2 logs cavc-api

# Restart backend
pm2 restart cavc-api
```

### Database Backup (JSON files)

```bash
# Backup all data
tar -czf cavc-backup-$(date +%Y%m%d).tar.gz server/data/

# Extract backup
tar -xzf cavc-backup-YYYYMMDD.tar.gz

# Backup images and PDFs
tar -czf cavc-media-$(date +%Y%m%d).tar.gz public/images/ public/pdfs/
```

### Git Workflow for Future Updates

```bash
# Client makes changes
git add .
git commit -m "Update services content"
git push origin main

# Netlify automatically rebuilds and deploys (if auto-deploy enabled)

# Manual deploy trigger
netlify deploy --prod
```

### Security Hardening

```bash
# Update all dependencies
npm audit fix

# Check for vulnerabilities
npm audit

# Update specific package
npm update [package-name]

# Change admin password (via admin panel or directly)
# Login → Settings → Change Password
```

### Performance Optimization

```bash
# Analyze bundle size
npm run build
# Check dist/ folder size

# Optimize images (if needed)
npm install -D @squoosh/lib
# Then use image optimization tool

# Test performance
lighthouse https://www.cityadvph.com --view
```

### Monitoring Setup

```bash
# Install Netlify Analytics (via dashboard)
# Site → Analytics → Enable

# Add custom uptime monitoring
# Use: uptimerobot.com, pingdom.com, or statuspage.io
```

### Emergency Rollback

```bash
# In Netlify dashboard:
# Deploys → [Previous Deploy] → "Publish deploy"

# Or via CLI:
netlify rollback
```

---

## 🔐 Important Credentials to Document

**For Client's Records (Store Securely):**

1. **GitHub Repository:**
   - URL: https://github.com/CLIENT_USERNAME/cavc-website
   - Access: Owner

2. **Netlify:**
   - Site name: [assigned by Netlify]
   - Site ID: [found in site settings]
   - Admin email: [client email]

3. **Domain (Hostgator):**
   - Domain: www.cityadvph.com
   - Registrar: Hostgator
   - DNS: [Netlify or Hostgator]

4. **Backend API:**
   - URL: [depends on hosting choice]
   - Access: [varies by platform]

5. **Admin Panel:**
   - URL: https://www.cityadvph.com/admin/login
   - Default user: admin (CHANGE THIS!)
   - Default pass: cavc2024 (CHANGE THIS!)

---

## 📊 Deployment Timeline Estimate

| Task | Time | Who |
|------|------|-----|
| Export project | 10 min | Developer |
| GitHub setup | 15 min | Client |
| Netlify deployment | 20 min | Client |
| Environment variables | 10 min | Client |
| Backend setup | 1-4 hours | Developer |
| Domain configuration | 30 min | Client |
| DNS propagation | 24-48 hours | Automatic |
| Security setup | 15 min | Client |
| Testing | 30 min | Both |
| **Total Active Time** | **~2.5 hours** | |
| **Total Calendar Time** | **2-3 days** | (includes DNS wait) |

---

## 🎯 Success Criteria

✅ **Deployment Successful When:**
- [ ] Site loads at custom domain with HTTPS
- [ ] All pages render correctly
- [ ] Admin panel is accessible
- [ ] Can login with new credentials (not default)
- [ ] Can upload images via admin panel
- [ ] Can add/edit services
- [ ] Contact form works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] DNS fully propagated
- [ ] Backups created

---

## 📞 Support Escalation

**Level 1: Documentation**
- PRODUCTION_TRANSITION_GUIDE.md
- QUICK_DEPLOYMENT_REFERENCE.md
- README.md

**Level 2: Community Support**
- Netlify Answers: https://answers.netlify.com
- Stack Overflow: tag [netlify] [react] [vite]

**Level 3: Direct Support**
- Netlify Support (if on paid plan)
- Developer (your contact info)

---

*Commands Reference v1.0 | Last Updated: December 18, 2025*
