# Prerequisites

- Node.js 18+ (for frontend build)
- Git
- GitHub account
- Vercel account (free)
- Railway account (free)
- OpenAI API key

# Step 1: Prepare Your Repository

1. Push all code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. Verify files exist:
   - `backend/Dockerfile` ✅
   - `backend/railway.json` ✅
   - `frontend/vercel.json` ✅
   - `frontend/.env.production` ✅

# Step 2: Deploy Frontend to Vercel

1. **Visit:** https://vercel.com/new

2. **Import Repository**
   - Select your GitHub repo
   - Set "Root Directory" to `frontend`
   - Click Deploy

3. **Configure Environment Variables**
   - After deployment, go to Settings → Environment Variables
   - Add new variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: (leave blank for now, we'll update after backend deploys)

4. **Wait for deployment** (~2-3 minutes)
   - Note your Vercel URL (e.g., `https://your-app.vercel.app`)

# Step 3: Deploy Backend to Railway

1. **Visit:** https://railway.app/dashboard

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub Repo"
   - Select this repository

3. **Add Environment Variables**
   - In Railway dashboard, go to Variables
   - Add these variables:
     - `OPENAI_API_KEY` = (your actual OpenAI API key)
     - `PYTHONUNBUFFERED` = 1
     - `PORT` = 8000

4. **Wait for deployment** (~5 minutes)
   - Watch deployment logs
   - Once done, note your Railway public URL (e.g., `https://rag-chatbot-backend-prod.railway.app`)

# Step 4: Connect Frontend to Backend

1. **Update Frontend Environment**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL`:
     - Old value: (empty or localhost)
     - New value: `https://your-railway-url.railway.app/api`
     - Replace `your-railway-url` with actual Railway URL

2. **Redeploy Frontend**
   - Go to Deployments tab
   - Click on latest deployment
   - Click "Redeploy"
   - Wait for redeployment (~2 minutes)

# Step 5: Test Your Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-railway-url.railway.app/api/health
   ```
   Expected response: `{"status":"ok",...}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Open browser DevTools → Network tab
   - Try uploading a YouTube/Instagram URL
   - Verify API calls go to your backend

# Step 6: Monitor Deployments

## Vercel Logs
- Dashboard → Deployments → Click latest → Logs tab
- Or view real-time logs via CLI:
  ```bash
  npm i -g vercel
  vercel logs <your-url>
  ```

## Railway Logs
- Dashboard → Services → Backend → Logs
- Search for errors or API calls

# Troubleshooting

## Issue: 502 Bad Gateway
**Cause:** Backend not running or crashed

**Fix:**
1. Check Railway dashboard → Logs
2. Verify `OPENAI_API_KEY` is set
3. Look for error traceback in logs
4. Redeploy from Railway dashboard

## Issue: CORS Error in Frontend
**Cause:** `NEXT_PUBLIC_API_URL` not set correctly

**Fix:**
1. Vercel → Settings → Environment Variables
2. Check `NEXT_PUBLIC_API_URL` value
3. Should be: `https://your-railway-url.railway.app/api`
4. Redeploy frontend

## Issue: OpenAI API Error
**Cause:** Invalid or missing API key

**Fix:**
1. Get your key from https://platform.openai.com/api-keys
2. Add to Railway Variables
3. Redeploy backend

## Issue: Blank Frontend Page
**Cause:** Build failed or wrong root directory

**Fix:**
1. Vercel Dashboard → Deployments
2. Check build logs
3. Ensure "Root Directory" is set to `frontend`
4. Retry deployment

# Maintenance

## Updating Code

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
3. Vercel and Railway auto-redeploy

## Updating Environment Variables

- **Vercel:** Settings → Environment Variables → Update → Redeploy
- **Railway:** Variables → Edit → Save → Redeploy

## Scaling (Optional)

- **Frontend:** Vercel handles auto-scaling
- **Backend:** Railway provides horizontal scaling (paid tier)

---

## Success! 🎉

Your RAG Chatbot is now live in production:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **API Docs:** https://your-backend.railway.app/docs

Visit your Vercel URL to start using the chatbot!
