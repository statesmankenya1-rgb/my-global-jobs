# Railway Deployment Guide for ZOE AFRICA

## ✅ Pre-Deployment Checklist

- [x] `.env` file configured locally (NOT committed to repo)
- [x] `.gitignore` properly configured
- [x] `npm run build` passes without errors
- [x] Server PORT is dynamic (uses `process.env.PORT`)
- [x] All API endpoints tested locally

---

## 📋 Railway Setup Steps

### 1. **Connect GitHub Repository**
- Go to [railway.app](https://railway.app)
- Sign in with your GitHub account
- Click "New Project" → "Deploy from GitHub repo"
- Select `statesmankenya1-rgb/my-global-jobs`

### 2. **Configure Build & Start Commands**
In Railway's **Service Settings**:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment**: `Node.js`

### 3. **Add Environment Variables**
Go to Railway's **Variables** panel and add:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production
```

### 4. **Deploy & Monitor**
- Railway will auto-deploy on `git push`
- Check logs in Railway dashboard for any errors
- Visit the generated Railway URL to test the app

---

## 🔍 Testing Your Deployment

After deployment, test these endpoints:

**Health Check:**
```bash
curl https://your-railway-app.railway.app/health
```

**AI Chat Endpoint:**
```bash
curl -X POST https://your-railway-app.railway.app/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are high-demand jobs in tech?"}'
```

**Frontend:**
Visit `https://your-railway-app.railway.app` in your browser.

---

## 🐛 Common Deployment Issues & Fixes

### Issue: Build fails with "esbuild" error
**Fix**: Ensure `esbuild` is in `devDependencies` in package.json ✓

### Issue: PORT binding error
**Fix**: Server now reads `process.env.PORT` dynamically ✓

### Issue: GEMINI_API_KEY undefined
**Fix**: Add the key in Railway's Variables panel, not in `.env` ✓

### Issue: Static files not serving
**Fix**: Ensure `dist/` folder is created by `npm run build` ✓

### Issue: SPA routing broken
**Fix**: Catch-all route in production mode handles SPA routing ✓

---

## 🚀 Local Testing Before Deploy

```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Test production server locally
NODE_ENV=production PORT=3000 npm run start

# Open browser and visit:
# http://localhost:3000
```

---

## 📞 Need Help?

- Check Railway logs for detailed error messages
- Verify `.env` variables are set in Railway dashboard (NOT in repo)
- Test API endpoints using Postman or cURL
- Check Google Gemini API console for rate limits

---

**Status**: ✅ Ready for Railway deployment
