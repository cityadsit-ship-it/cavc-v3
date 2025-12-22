# 🚀 CAVC Website - Quick Deployment Reference Card

## 📋 What You Need

- ✅ GitHub account
- ✅ Netlify account  
- ✅ Hostgator cPanel access
- ✅ Domain name: [e.g., www.cityadvph.com]

---

## 🔢 5-Step Deployment Process

### 1️⃣ GitHub (10 minutes)
```
1. Create new private repository on GitHub
2. Name it: cavc-website
3. Upload the project files you received
4. Done! ✅
```

### 2️⃣ Netlify (15 minutes)
```
1. Sign up at netlify.com with GitHub
2. Click "Add new site" → "Import from GitHub"
3. Select your cavc-website repository
4. Build settings:
   - Build command: npm run build
   - Publish directory: dist
5. Click "Deploy site"
6. Done! ✅ (You'll get a temporary URL like xyz123.netlify.app)
```

### 3️⃣ Environment Variable (5 minutes)
```
In Netlify dashboard:
1. Site settings → Environment variables
2. Add variable:
   - Name: VITE_API_URL
   - Value: [Backend URL - developer will provide]
3. Save
4. Deploys → Trigger deploy → Clear cache and deploy
```

### 4️⃣ Custom Domain (24-48 hours)
```
In Netlify:
1. Domain settings → Add custom domain
2. Enter your domain: www.cityadvph.com
3. Follow DNS instructions provided

In Hostgator cPanel:
1. Find "Zone Editor" or "DNS Management"
2. Add CNAME record:
   - Name: www
   - Points to: [your-site].netlify.app
3. Save

Wait 24-48 hours for DNS to update globally
```

### 5️⃣ Security & Testing (15 minutes)
```
1. Visit: https://www.cityadvph.com/admin/login
2. Login with: admin / cavc2024
3. IMMEDIATELY change password (Settings page)
4. Test:
   - Browse all pages ✅
   - Check admin panel ✅
   - Upload a test image ✅
5. Done! Your site is LIVE! 🎉
```

---

## 🔐 Important Security Notes

**⚠️ MUST DO IMMEDIATELY AFTER DEPLOYMENT:**
1. Change admin password from default `cavc2024`
2. Use strong password (12+ characters, mixed case, numbers, symbols)
3. Update admin email to yours

**Default Credentials (CHANGE THESE!):**
- Username: `admin`
- Password: `cavc2024`

---

## 📱 Your Site URLs

After deployment, save these:

- **Live Website:** https://www.cityadvph.com
- **Admin Panel:** https://www.cityadvph.com/admin/login
- **Temporary Netlify URL:** https://[random].netlify.app
- **Netlify Dashboard:** https://app.netlify.com
- **GitHub Repo:** https://github.com/[your-username]/cavc-website

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't log into admin | Check if backend is configured. Contact developer. |
| Domain not working | DNS takes 24-48 hours. Use temporary Netlify URL meanwhile. |
| Images not uploading | Check backend is running. Verify API_URL environment variable. |
| Site shows "Page not found" | Check Netlify deploy logs. Ensure build succeeded. |
| Forgot admin password | Contact developer - password reset not yet implemented. |

---

## 📞 Who to Contact

**For Deployment Help:**
- Developer: [Your Email/Phone]
- Read: PRODUCTION_TRANSITION_GUIDE.md (detailed instructions)

**For Hosting Support:**
- Netlify: https://answers.netlify.com
- GitHub: https://support.github.com
- Hostgator: Your hosting support portal

---

## ✅ Deployment Checklist

Print this and check off as you go:

**GitHub Setup:**
- [ ] Created GitHub account
- [ ] Created repository (cavc-website)
- [ ] Uploaded project files

**Netlify Setup:**
- [ ] Created Netlify account
- [ ] Imported repository
- [ ] Site deployed successfully
- [ ] Set VITE_API_URL environment variable
- [ ] Noted temporary URL: ___________________

**Backend Setup:**
- [ ] Discussed backend hosting with developer
- [ ] Backend deployed and running
- [ ] Updated VITE_API_URL with real backend URL

**Domain Setup:**
- [ ] Added domain in Netlify
- [ ] Updated DNS in Hostgator
- [ ] Waited for DNS propagation
- [ ] HTTPS working
- [ ] Domain fully working: www.cityadvph.com

**Security:**
- [ ] Logged into admin panel
- [ ] Changed password immediately
- [ ] Updated admin email
- [ ] Saved new credentials securely

**Testing:**
- [ ] Homepage loads ✅
- [ ] All services display ✅
- [ ] Contact form works ✅
- [ ] Admin panel accessible ✅
- [ ] Can upload images ✅
- [ ] Mobile responsive ✅

---

## 🎓 Quick Content Management Tips

**To update services:**
1. Login to admin panel
2. Go to "Services Manager"
3. Click "Manage Gallery" on any service
4. Add/edit/delete images
5. Changes appear immediately on live site

**To add PDFs:**
1. Go to "PDF Manager"
2. Upload PDF for specific service
3. Visitors can download from service page

**Admin Panel Sections:**
- **Dashboard** - Overview and activity
- **Services** - Manage service offerings
- **Gallery** - Update service images
- **Locations** - Update coverage areas
- **PDFs** - Upload brochures
- **Settings** - Change password/email

---

## 💡 Pro Tips

1. **Bookmark admin panel URL** for quick access
2. **Take screenshots** of your Netlify settings
3. **Save environment variables** in secure location
4. **Regular backups** - download service data monthly
5. **Test before big updates** - use preview mode

---

## 🎉 Success!

If all checkboxes above are checked, your website is LIVE and secure! 

**Congratulations! 🎊**

---

*Quick Reference v1.0 | December 18, 2025*

For detailed instructions, see: **PRODUCTION_TRANSITION_GUIDE.md**
