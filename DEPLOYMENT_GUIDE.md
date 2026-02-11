# 🚀 JJ Electronics - Deployment Guide

## Quick Deploy (Free)

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- Railway account for PostgreSQL (sign up at railway.app)

---

## Method 1: Vercel + Render + Railway (Recommended - 100% Free)

### Step 1: Deploy Database to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Provision PostgreSQL"
4. Copy the database credentials:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

5. Connect to your database and run the schema:
   - Go to Railway dashboard → PostgreSQL → Data
   - Click "Query" tab
   - Copy and paste content from `server/setup/schema.sql`
   - Execute the query

### Step 2: Deploy Backend to Render

1. **Push to GitHub** (if not already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/jj-electronics.git
   git push -u origin main
   ```

2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `jj-electronics-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

6. Add Environment Variables:
   ```
   DB_USER=your_railway_user
   DB_HOST=your_railway_host
   DB_NAME=your_railway_database
   DB_PASSWORD=your_railway_password
   DB_PORT=5432
   PORT=5000
   ```

7. Click "Create Web Service"
8. Copy your API URL (e.g., `https://jj-electronics-api.onrender.com`)

### Step 3: Configure Frontend for Production

Update the API URLs in your React app:

**Create `.env` file in client folder:**
```bash
REACT_APP_API_URL=https://your-render-api-url.onrender.com
```

**Update all axios calls to use this URL:**
```javascript
// Instead of: http://localhost:5000/api/products
// Use: ${process.env.REACT_APP_API_URL}/api/products
```

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-render-api-url.onrender.com
   ```

6. Click "Deploy"
7. Your live link: `https://jj-electronics.vercel.app`

---

## Method 2: Netlify + Railway (Alternative)

Same as above but use Netlify instead of Vercel for frontend.

---

## Method 3: Full Stack on Railway (Easiest)

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL
4. Add Node.js service (Backend)
5. Add Static Site (Frontend)
6. Configure environment variables
7. Deploy!

---

## Quick Setup Commands

### Backend Update for CORS (Add to server.js)

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://jj-electronics.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Frontend - Create Production Build

```bash
cd client
npm run build
```

---

## 🎯 Expected Result

After deployment, you'll have:

- **Frontend**: https://jj-electronics.vercel.app
- **Backend API**: https://jj-electronics-api.onrender.com
- **Database**: PostgreSQL on Railway

Share the frontend URL with your friends! 🎉

---

## 🔧 Troubleshooting

### Issue: API not connecting
- Check CORS settings in server.js
- Verify environment variables on Render
- Check Render logs for errors

### Issue: Database connection failed
- Verify Railway database credentials
- Check if database is running
- Ensure schema is loaded

### Issue: Frontend 404 errors
- Add `_redirects` file in `public/` with: `/* /index.html 200`
- Or add `vercel.json` with rewrites configuration

---

## 📝 Post-Deployment Checklist

✅ Database schema loaded  
✅ Sample data inserted  
✅ Backend API responding  
✅ Frontend connecting to API  
✅ CORS configured properly  
✅ Environment variables set  
✅ SSL/HTTPS working  

---

## 💰 Cost

**Total Monthly Cost: $0** (Free tier)

- Vercel: Free (100GB bandwidth)
- Render: Free (750 hours/month)
- Railway: Free ($5 credit/month - more than enough)

**Need help?** Follow the step-by-step guide below!
