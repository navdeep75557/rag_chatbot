# Production Deployment Checklist

## Pre-Deployment (Complete these first)

- [ ] Have OpenAI API key ready (from https://platform.openai.com/api-keys)
- [ ] Have GitHub account and repository set up
- [ ] Create Vercel account (https://vercel.com)
- [ ] Create Railway account (https://railway.app)
- [ ] All code committed and pushed to GitHub main branch

## Deployment Files Ready

- [x] `backend/Dockerfile` - Production container image
- [x] `backend/railway.json` - Railway deployment config
- [x] `backend/.dockerignore` - Optimize Docker build
- [x] `frontend/vercel.json` - Vercel configuration
- [x] `frontend/.env.production` - Production environment config
- [x] `DEPLOYMENT.md` - Deployment guide
- [x] `VERCEL_DEPLOYMENT_STEPS.md` - Step-by-step instructions

## Step-by-Step Deployment

### 1. Deploy Frontend (Vercel)

- [ ] Go to https://vercel.com/new
- [ ] Import GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Click Deploy
- [ ] Add environment variable `NEXT_PUBLIC_API_URL` (update after backend deploys)
- [ ] Note Vercel URL

### 2. Deploy Backend (Railway)

- [ ] Go to https://railway.app/dashboard
- [ ] Create new project from GitHub
- [ ] Add environment variables:
  - [ ] `OPENAI_API_KEY` = your actual key
  - [ ] `PYTHONUNBUFFERED` = 1
- [ ] Wait for deployment to complete
- [ ] Note Railway public URL

### 3. Connect Frontend to Backend

- [ ] Update Vercel `NEXT_PUBLIC_API_URL` = Railway URL + `/api`
- [ ] Redeploy frontend on Vercel

### 4. Test Deployment

- [ ] Visit frontend URL in browser
- [ ] Test health endpoint: `https://your-railway-url/api/health`
- [ ] Try uploading YouTube/Instagram URL in UI
- [ ] Check browser Network tab for API calls

## Monitoring & Maintenance

- [ ] Set up Vercel alerts (optional)
- [ ] Set up Railway alerts (optional)
- [ ] Monitor logs regularly
- [ ] Keep OpenAI API within budget
- [ ] Plan for scaling if needed

## Troubleshooting Resources

See `DEPLOYMENT.md` for:
- Common error fixes
- Alternative backend hosting options
- Performance optimization tips

---

**Need help?** Check VERCEL_DEPLOYMENT_STEPS.md for detailed step-by-step instructions.
