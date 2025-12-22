# Live API Integration - Admin Panel to Main Website

## Problem Solved
The main website was reading from hardcoded `ServicesData.js` while the admin panel was saving changes to `server/data/services.json`. This meant that any changes made in the admin panel (like editing the AD Material field) were not reflecting on the main website.

## Solution Implemented
We've now connected the main website to fetch data from the API, so changes made in the admin panel will immediately appear on the main website.

### Changes Made:

1. **Created API Hook** (`src/hooks/useFetchServices.js`):
   - Fetches service data from the backend API
   - Transforms API data to match the existing ServicesData.js structure
   - Includes fallback to static data if API is unavailable
   - Adds required properties: `mainImage` and `imageCount`

2. **Updated Services Component** (`src/components/Services.jsx`):
   - Now uses `useFetchTransformedServices()` hook instead of static import
   - Falls back to static data if API is unavailable
   - Logs to console which data source is being used
   - Maintains full backward compatibility with existing structure

## How to Test

### 1. Start Both Servers
```bash
npm run dev:all
```

This command starts:
- **Backend API** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173`

### 2. Make Changes in Admin Panel

1. Go to `http://localhost:5173/admin/login`
2. Login with credentials: `admin` / `cavc2024`
3. Navigate to **Services Manager**
4. Click **Edit** on any service (e.g., Pillar Ads)
5. Go to **Gallery Manager** for that service
6. Click **Edit** on any image
7. Modify the **AD Material** field or any other field
8. Click **Save Changes**
9. You should see a green success notification

### 3. Verify Changes on Main Website

1. Go to `http://localhost:5173` (or refresh if already open)
2. Scroll to the **Services** section
3. Click on the service you just edited
4. The modal should show your updated information immediately

### 4. Check Console Logs

Open browser DevTools (F12) and check the Console:
- ✅ You should see: `"✅ Using live API data from admin panel"`
- ⚠️ If API is down: `"⚠️ API unavailable, using static fallback data"`

## Data Flow

```
Admin Panel Edit
    ↓
Server API (saves to services.json)
    ↓
Frontend fetches from API
    ↓
Services Component updates
    ↓
Changes visible on main website
```

## Fallback Behavior

If the backend server is not running:
- Frontend automatically falls back to static `ServicesData.js`
- Console shows warning message
- Website continues to work normally with cached data

## Important Notes

### For Development:
- Always run `npm run dev:all` to start both servers
- Check console logs to verify which data source is active
- Changes in admin panel require API to be running

### For Production:
- Backend API must be deployed and running
- Update `VITE_API_URL` environment variable to point to production API
- Ensure CORS is properly configured on production backend

## API Endpoint

```
GET http://localhost:3001/api/services
```

Returns array of services with structure:
```json
[
  {
    "id": 1,
    "folder": "banners",
    "title": "Service Title",
    "description": "Service description",
    "pdfFileName": "banner-cavc.pdf",
    "galleryItems": [
      {
        "imagePath": "/images/services/banners/image.webp",
        "jpgPath": "/images/services/banners/image.jpg",
        "modalDescription": "Image Title",
        "modalDetails": {
          "Standard Size": "3ft x 9ft",
          "AD Material": "Your edited content here",
          "Locations": "Location info"
        }
      }
    ]
  }
]
```

## Troubleshooting

### Changes not showing?
1. Check if both servers are running: `npm run dev:all`
2. Check browser console for error messages
3. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Verify the API endpoint is accessible: `http://localhost:3001/api/services`

### API errors in console?
1. Make sure backend server is running: `npm run server`
2. Check server terminal for error messages
3. Verify `services.json` file exists and is valid JSON

### Still seeing old data?
1. Clear browser cache
2. Check which data source is active in console logs
3. Verify your changes were saved in admin panel (check for success notification)

## Benefits

✅ **Real-time Updates**: Changes in admin panel immediately visible on main site
✅ **No Rebuild Required**: No need to rebuild the app when content changes
✅ **Client-Friendly**: Your client can update content without developer assistance
✅ **Reliable Fallback**: Website works even if API is temporarily down
✅ **Developer-Friendly**: Console logs show which data source is active

## Next Steps

For production deployment:
1. Deploy backend API to a server (e.g., Heroku, DigitalOcean, AWS)
2. Set `VITE_API_URL` environment variable in production build
3. Configure proper authentication (recommend JWT tokens)
4. Set up database instead of JSON files (MongoDB, PostgreSQL, etc.)
5. Add image CDN for better performance
