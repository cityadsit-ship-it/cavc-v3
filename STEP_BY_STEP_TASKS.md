# 🎯 CAVC Website - Step-by-Step Task Guide

**Simple Instructions for Common Tasks**

---

## Table of Contents

1. [How to Add a Billboard/Transit Service](#task-1-add-a-new-service)
2. [How to Add Photos to Existing Service](#task-2-add-photos-to-service)
3. [How to Update Contact Phone Number](#task-3-update-contact-info)
4. [How to Upload New Company Brochure](#task-4-upload-pdf-brochure)
5. [How to Add a New Office Location](#task-5-add-office-location)
6. [How to Change Your Password](#task-6-change-password)
7. [How to Update Footer Social Media Links](#task-7-update-social-links)

---

## Task 1: Add a New Service

**Example: Adding "Premium LED Billboards" Service**

### Before You Start:
- Prepare at least 3 high-quality images
- Write a brief service description (2-3 paragraphs)
- Have PDF brochure ready (optional)

### Steps:

**Step 1: Login to Admin**
```
1. Go to: https://www.cityadvph.com/admin/login
2. Enter username: admin (or your username)
3. Enter password: [your password]
4. Click "Login"
```

**Step 2: Go to Services Manager**
```
1. Look at the left menu
2. Click "Services Manager"
3. You'll see a list of existing services
```

**Step 3: Add New Service**
```
1. Click the blue button "Add New Service"
2. A form will appear
```

**Step 4: Fill in Service Details**
```
Title: Premium LED Billboards
↑ This appears as the main heading

Description: 
Our premium LED billboards offer exceptional visibility day and night. 
Located in high-traffic areas across Metro Manila, these digital displays 
provide dynamic advertising capabilities with stunning clarity and brightness.
↑ This is what visitors read

Folder Name: premium-led-billboards
↑ Simple name, no spaces, lowercase (used for organizing files)
```

**Step 5: Save Service**
```
1. Click "Save" button at bottom
2. You'll see success message
3. Your new service appears in the list
```

**Step 6: Add Images to Service**
```
1. Find "Premium LED Billboards" in the services list
2. Click "Manage Gallery" button
3. Click "Add New Item"
```

**Step 7: Add First Image**
```
Image Caption: EDSA Guadalupe LED Billboard
↑ Short title (appears on gallery)

Detailed Description: 
Premium 15m x 8m LED billboard located at EDSA Guadalupe southbound. 
High-traffic location with excellent visibility 24/7.
↑ Detailed info (appears in popup)

Location: EDSA Guadalupe, Makati City
↑ Where it's located

Dimensions: 15m x 8m
↑ Size of the billboard

Features: Double-sided LED, 24/7 illumination, Weather-resistant
↑ Special features
```

**Step 8: Upload Image**
```
1. Click "Choose File" button
2. Navigate to your image folder
3. Select the image (billboard-edsa-guadalupe.jpg)
4. Click "Save"
5. Wait for upload to complete
```

**Step 9: Add More Images**
```
1. Click "Add New Item" again
2. Repeat steps 7-8 for each image
3. Add at least 3-5 images per service
```

**Step 10: Upload PDF Brochure (Optional)**
```
1. Click "PDF Manager" in left menu
2. Scroll to "Service PDFs" section
3. Select "Premium LED Billboards" from dropdown
4. Click "Choose File"
5. Select PDF: CAVC-Premium-LED-Billboards-2025.pdf
6. Click "Upload Service PDF"
7. Wait for success message
```

**Step 11: Verify on Website**
```
1. Open new browser tab
2. Go to: https://www.cityadvph.com
3. Scroll to Services section
4. Find "Premium LED Billboards"
5. Click to view gallery
6. Check all images display correctly
7. Test PDF download button (if uploaded)
```

✅ **Done! Your new service is now live on the website.**

---

## Task 2: Add Photos to Service

**Example: Adding new photos to "LED Billboards" service**

### Steps:

**Step 1: Login and Go to Services**
```
1. Login to admin panel
2. Click "Services Manager"
```

**Step 2: Open Gallery Manager**
```
1. Find "LED Billboards" in the list
2. Click "Manage Gallery" button
```

**Step 3: Add New Photo**
```
1. Click "Add New Item" button
2. Fill in the form:

   Image Caption: Shaw Boulevard LED Display
   
   Detailed Description:
   State-of-the-art LED billboard at Shaw Boulevard featuring 
   high-resolution display and optimal viewing angles. Perfect 
   for brand visibility in Mandaluyong's business district.
   
   Location: Shaw Boulevard, Mandaluyong City
   Dimensions: 12m x 6m
   Features: HD LED Display, Prime Location, High Traffic
   
3. Click "Choose File"
4. Select image: shaw-boulevard-led.jpg
5. Click "Save"
```

**Step 4: Repeat for More Photos**
```
For each additional photo:
- Click "Add New Item"
- Fill in details specific to that location
- Upload image
- Save
```

**Step 5: Verify**
```
1. Go to live website
2. Find LED Billboards service
3. Open gallery
4. New photos should appear
```

✅ **Done! New photos are now in the gallery.**

---

## Task 3: Update Contact Info

**Example: Changing company phone number**

### Method 1: Using GitHub (Permanent Change)

**Step 1: Login to GitHub**
```
1. Go to: https://github.com
2. Login with your credentials
3. Navigate to: github.com/YOUR-USERNAME/cavc-website
```

**Step 2: Find the File**
```
1. Click on "src" folder
2. Click on "components" folder
3. Click on "MessageMe.jsx" file
```

**Step 3: Edit the File**
```
1. Click the pencil icon (✏️) "Edit this file"
2. Find this section (around line 10-20):

   const contactInfo = {
     phone: "+63 123 456 7890",     ← OLD NUMBER
     email: "info@cityadvph.com",
     address: "Your address here"
   };
```

**Step 4: Change Phone Number**
```
Change this line:
phone: "+63 123 456 7890",

To this:
phone: "+63 917 555 1234",

⚠️ IMPORTANT: 
- Keep the quotes " "
- Keep the comma ,
- Only change the numbers inside quotes
```

**Step 5: Save Changes**
```
1. Scroll to bottom
2. In "Commit changes" box, type: "Updated phone number"
3. Click "Commit changes" button
```

**Step 6: Wait for Deployment**
```
1. Website will automatically rebuild (2-5 minutes)
2. Go to your website: https://www.cityadvph.com
3. Scroll to contact section
4. Verify new phone number appears
```

### Method 2: Also Update in Footer

**Repeat above steps for:**
```
File: src/components/Footer.jsx
Find and update phone number there too
```

✅ **Done! Phone number updated everywhere.**

---

## Task 4: Upload PDF Brochure

**Example: Uploading updated company profile**

### Steps:

**Step 1: Prepare PDF**
```
1. Make sure PDF is ready
2. Filename should be clear: CAVC-Company-Profile-2025.pdf
3. File size must be under 20MB
4. Test: Open PDF on your computer to verify it works
```

**Step 2: Login to Admin**
```
1. Go to admin panel: https://www.cityadvph.com/admin/login
2. Login with credentials
```

**Step 3: Go to PDF Manager**
```
1. Click "PDF Manager" in left menu
2. You'll see two sections:
   - Company Profile (top)
   - Service PDFs (bottom)
```

**Step 4: Upload Company Profile**
```
1. In "Company Profile" section
2. Click "Choose File" button
3. Navigate to your PDF
4. Select: CAVC-Company-Profile-2025.pdf
5. Click "Upload Company Profile" button
6. Wait for green success message
```

**Step 5: Verify Upload**
```
1. Go to your website
2. Look for "Download Company Profile" button
3. Click to test download
4. PDF should open showing your new brochure
```

### To Upload Service-Specific PDF:

**Steps:**
```
1. In PDF Manager, scroll to "Service PDFs"
2. Click dropdown menu
3. Select service: "LED Billboards"
4. Click "Choose File"
5. Select PDF: CAVC-LED-Billboards-Brochure.pdf
6. Click "Upload Service PDF"
7. Verify success message
```

**Test:**
```
1. Go to website
2. Click on "LED Billboards" service
3. Look for PDF download button
4. Click to test download
```

✅ **Done! PDF brochure is now available for download.**

---

## Task 5: Add Office Location

**Example: Adding new branch office in Quezon City**

### Before You Start:

**Get Coordinates from Google Maps:**
```
1. Go to: https://www.google.com/maps
2. Search for: "123 Quezon Avenue, Quezon City"
3. Right-click on the exact location
4. Click the coordinates (example: 14.6488, 121.0509)
5. Copy to clipboard
```

### Steps:

**Step 1: Login and Go to Locations**
```
1. Login to admin panel
2. Click "Locations Manager" in left menu
```

**Step 2: Add New Office**
```
1. Make sure you're on "Offices" tab (not "Sites")
2. Click "Add New Office" button
3. A form will appear
```

**Step 3: Fill in Office Details**
```
Name: CAVC Quezon City Branch
↑ Office name

Address: 123 Quezon Avenue, Brgy. Paligsahan, Quezon City, 1103
↑ Complete address

Latitude: 14.6488
↑ First number from Google Maps

Longitude: 121.0509
↑ Second number from Google Maps
```

**Step 4: Save Location**
```
1. Double-check all information
2. Click "Save" button
3. Success message will appear
4. New office appears in list
```

**Step 5: Verify on Website Map**
```
1. Go to: https://www.cityadvph.com
2. Scroll to "Coverage Areas" map
3. Look for your new office marker
4. Click marker to see office details
```

### To Add Site Location (Billboard Location):

**Same steps but:**
```
1. Click "Sites" tab (instead of Offices)
2. Click "Add New Site"
3. Fill in:
   - Name: EDSA Guadalupe Billboard Site
   - Address: EDSA Guadalupe, Makati City
   - Latitude: 14.5547
   - Longitude: 121.0244
4. Save
```

✅ **Done! New location appears on website map.**

---

## Task 6: Change Password

**Example: Changing admin password for security**

### Steps:

**Step 1: Login**
```
1. Go to: https://www.cityadvph.com/admin/login
2. Login with current credentials
```

**Step 2: Go to Settings**
```
1. Click "Settings" in left menu
2. Scroll to "Change Password" section
```

**Step 3: Change Password**
```
Current Password: [type your current password]
↑ Must be correct or change will fail

New Password: MyNewStr0ng!Pass2025
↑ Create strong password (see requirements below)

Confirm New Password: MyNewStr0ng!Pass2025
↑ Must match exactly
```

**Password Requirements:**
```
✓ At least 8 characters (12+ recommended)
✓ Uppercase letters (A-Z)
✓ Lowercase letters (a-z)
✓ Numbers (0-9)
✓ Special characters (!@#$%^&*)

Good examples:
- CAVC@Admin2025!
- MyStr0ng!PassW0rd
- C!tyAdv3rt!s1ng

Bad examples:
- password (too simple)
- 12345678 (no letters)
- cavc2024 (too common)
```

**Step 4: Save New Password**
```
1. Click "Update Password" button
2. Wait for green success message
3. Write down new password in secure location
```

**Step 5: Test New Password**
```
1. Click "Logout" (top right)
2. Login again using new password
3. If successful, password change is complete
```

⚠️ **IMPORTANT:** Store new password securely!

✅ **Done! Password updated successfully.**

---

## Task 7: Update Social Links

**Example: Updating Facebook page link in footer**

### Steps:

**Step 1: Login to GitHub**
```
1. Go to: https://github.com
2. Login with your credentials
3. Go to: github.com/YOUR-USERNAME/cavc-website
```

**Step 2: Navigate to Footer File**
```
1. Click "src" folder
2. Click "components" folder
3. Click "Footer.jsx" file
```

**Step 3: Edit File**
```
1. Click pencil icon (✏️) to edit
2. Scroll down to find social media links section
3. Look for lines like this:

   <a href="https://facebook.com/oldpage">
   <a href="https://instagram.com/oldpage">
   <a href="https://linkedin.com/company/oldcompany">
```

**Step 4: Update Links**
```
Change this:
<a href="https://facebook.com/oldpage">

To this:
<a href="https://facebook.com/cityadvph">

⚠️ Only change the URL inside quotes
⚠️ Keep everything else the same
```

**Step 5: Update All Social Links**
```
Facebook:
<a href="https://facebook.com/cityadvph">

Instagram:
<a href="https://instagram.com/cityadvph">

LinkedIn:
<a href="https://linkedin.com/company/city-advertising-ventures">
```

**Step 6: Save Changes**
```
1. Scroll to bottom
2. Type commit message: "Updated social media links"
3. Click "Commit changes"
```

**Step 7: Verify (Wait 2-5 minutes)**
```
1. Go to: https://www.cityadvph.com
2. Scroll to footer
3. Click each social media icon
4. Verify links go to correct pages
```

✅ **Done! Social media links updated.**

---

## 🎯 Quick Troubleshooting

### Image Won't Upload
```
Problem: Error when uploading image
Solutions:
1. Check file size (must be under 5MB)
   - Right-click image → Properties → Size
2. Try smaller image or compress it
3. Check file type (must be JPG, PNG, or WebP)
4. Try different browser
```

### Can't Find Saved Changes
```
Problem: Made changes but can't see them
Solutions:
1. Wait 30 seconds and refresh page
2. Clear browser cache: Press Ctrl+F5
3. Try incognito/private window
4. Check you're on correct page
```

### Password Won't Change
```
Problem: Error when changing password
Solutions:
1. Verify current password is correct
2. Check new password meets requirements
3. Ensure both new password fields match exactly
4. Try copying/pasting to avoid typos
```

### GitHub Changes Not Showing
```
Problem: Updated file on GitHub but website unchanged
Solutions:
1. Wait 5 minutes for automatic rebuild
2. Check GitHub Actions tab for build status
3. Look for any error messages
4. Contact developer if issue persists
```

---

## 📋 Final Checklist Template

**Use this every time you make updates:**

```
Before Starting:
□ Logged into admin/GitHub
□ Have all content ready (images, text, PDFs)
□ Images are high quality and under 5MB
□ Text is proofread for typos

While Working:
□ Made changes carefully
□ Only edited what was necessary
□ Saved after each change
□ Noted what I changed

After Finishing:
□ Checked live website
□ Verified changes appear correctly
□ Tested on mobile phone
□ All links/downloads work
□ Logged out of admin panel

If Issues:
□ Tried troubleshooting steps
□ Documented the problem
□ Contacted developer if needed
```

---

## 💡 Pro Tips

1. **Work in Small Steps** - Make one change, test, then move to next
2. **Always Test** - Check live website after every change
3. **Keep Original Files** - Save copies before editing
4. **Use Clear Names** - Name files clearly (CAVC-Service-2025.pdf)
5. **Document Changes** - Keep notes of what you updated
6. **Schedule Updates** - Don't update during peak traffic hours
7. **Mobile First** - Always check how changes look on phone

---

## ✅ Success!

You now have step-by-step instructions for:
- ✓ Adding services
- ✓ Managing images
- ✓ Updating contact info
- ✓ Uploading PDFs
- ✓ Adding locations
- ✓ Changing passwords
- ✓ Updating social links

**Keep this guide handy and refer to it whenever you need to update your website!**

---

*Step-by-Step Task Guide v1.0*
*Last Updated: December 18, 2025*
