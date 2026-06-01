# 🚀 Deploy to Vercel + Railway in 5 Minutes

Your RAG Chatbot is ready for production deployment! Follow this guide to go live.

## What You're Deploying

- **Frontend:** Next.js app on Vercel (free tier)
- **Backend:** FastAPI app on Railway (~$5/month)
- **Total Cost:** ~$5/month or less with free tiers

## Prerequisites

Before you start, gather:

1. **GitHub Account** - Repository already set up ✅
2. **OpenAI API Key** - Get from https://platform.openai.com/api-keys
3. **Vercel Account** - Sign up at https://vercel.com (free)
4. **Railway Account** - Sign up at https://railway.app (free)

## Deployment Steps

### Step 1: Deploy Backend (5 minutes)

1. Go to **https://railway.app/dashboard**
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Select your repository
5. Wait for Railway to detect the Dockerfile

Once Railway is building:

6. Click **"Variables"** tab
7. Add these environment variables:
   - Name: `OPENAI_API_KEY` → Value: `sk-...` (your actual key)
   - Name: `PYTHONUNBUFFERED` → Value: `1`
8. Click **"Deploy"**
9. Wait ~5 minutes for deployment to complete
10. Copy your public URL from the Railway dashboard (e.g., `https://rag-chatbot-backend-prod.railway.app`)

✅ **Backend is now live!** Test it: Visit `https://your-railway-url.railway.app/api/health`

---

### Step 2: Deploy Frontend (5 minutes)

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Set **"Root Directory"** to `frontend`
5. Click **"Deploy"**
6. Wait ~2 minutes for build and deployment

Once deployed:

7. Go to **Settings → Environment Variables**
8. Add new variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-railway-url.railway.app/api` (replace with actual Railway URL)
9. Click **"Save"**
10. Go to **Deployments** tab
11. Click the latest deployment
12. Click **"Redeploy"** to apply environment changes
13. Wait ~2 minutes for redeployment

✅ **Frontend is now live!** Visit your Vercel URL (shown in Deployments tab)

---

### Step 3: Verify Everything Works

1. **Visit your frontend URL** (from Vercel dashboard)
2. **Open browser DevTools** (F12) → Network tab
3. **Try uploading a YouTube/Instagram URL**
4. **Check Network tab** - API calls should show success (200 status)
5. **Chat should work** if video extraction succeeds

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **502 Bad Gateway** | Check Railway logs → look for error. Verify `OPENAI_API_KEY` is set. |
| **CORS Error** | Verify `NEXT_PUBLIC_API_URL` in Vercel is correct (ends with `/api`). Redeploy frontend. |
| **Blank Page** | Check Vercel deployment logs. Ensure root directory is `frontend`. |
| **"Missing OpenAI Key"** | Add `OPENAI_API_KEY` to Railway Variables. Redeploy backend. |
| **No API Calls** | Open browser console (F12) → check for errors. Verify network tab shows correct API URL. |

---

## After Deployment

### Set up Auto-Redeploy (Optional)

**Both Vercel and Railway auto-redeploy on `git push` to main branch** ✅

Just push code and both will update automatically:
```bash
git add .
git commit -m "Update chatbot"
git push origin main
```

### Monitor in Production

**Vercel Logs:**
- Dashboard → Deployments → Click deployment → Logs

**Railway Logs:**
- Dashboard → Services → Backend → Logs
- Look for errors or API calls

### Update Environment Variables

**To change OpenAI API key or other settings:**

1. **For backend (Railway):**
   - Dashboard → Variables
   - Edit value
   - Click "Save"
   - Auto-redeploys

2. **For frontend (Vercel):**
   - Settings → Environment Variables
   - Edit value
   - Redeploy from Deployments tab

---

## Production Checklist

- [ ] Backend deployed on Railway
- [ ] Backend `OPENAI_API_KEY` configured
- [ ] Frontend deployed on Vercel
- [ ] Frontend `NEXT_PUBLIC_API_URL` set to Railway URL + `/api`
- [ ] Frontend redeployed after updating env var
- [ ] Tested `/api/health` endpoint
- [ ] Tested video upload from frontend
- [ ] Verified API calls in Network tab
- [ ] Shared URLs with team/users

---

## Your Production URLs

Once deployed, you'll have:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **API Docs:** `https://your-backend.railway.app/docs`
- **API Health:** `https://your-backend.railway.app/api/health`

Share the frontend URL with users!

---

## Need Help?

### Documentation Files

- `DEPLOYMENT.md` - More detailed deployment options
- `VERCEL_DEPLOYMENT_STEPS.md` - Step-by-step with images
- `PRODUCTION_CHECKLIST.md` - Full checklist
- `README.md` - Project overview

### Common Questions

**Q: What if I need to update code?**
A: Push to GitHub → both Vercel and Railway auto-redeploy ✅

**Q: How much will it cost?**
A: Vercel (free), Railway (~$5/month minimum). OpenAI costs depend on usage.

**Q: Can I use a different backend host?**
A: Yes! See DEPLOYMENT.md for Render, Fly.io, AWS options.

**Q: What if the backend keeps crashing?**
A: Check Railway logs for errors. Usually missing environment variables or invalid API key.

---

## 🎉 Success!

Your RAG Chatbot is now deployed and accessible worldwide!

**Next Steps:**
1. Share the frontend URL with users
2. Monitor logs for errors
3. Iterate and improve based on feedback

Happy chatting! 🚀
