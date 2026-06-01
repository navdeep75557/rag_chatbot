# Deployment Guide

## Quick Start: Vercel + Railway

### Frontend (Vercel)

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Select your GitHub repo
   - Set Root Directory to rontend

2. **Add Environment Variables**
   - In Vercel Dashboard ? Settings ? Environment Variables
   - Add: NEXT_PUBLIC_API_URL = (your backend URL)

3. **Deploy**
   - Vercel auto-deploys on push to main
   - Your frontend is now live!

### Backend (Railway)

1. **Create Project**
   - Go to https://railway.app
   - Click "New Project" ? "Deploy from GitHub"
   - Select this repo

2. **Add Environment Variables**
   - OPENAI_API_KEY = (your OpenAI API key)
   - PYTHONUNBUFFERED = 1

3. **Deploy**
   - Railway auto-detects Dockerfile
   - Service starts automatically
   - Get public URL from Railway dashboard

### Connect Frontend to Backend

1. Copy backend URL from Railway (e.g., https://rag-chatbot-backend-prod.railway.app)
2. Update frontend environment variable:
   - Vercel ? Settings ? Environment Variables
   - Set NEXT_PUBLIC_API_URL = backend URL + /api
   - Redeploy frontend

---

## Alternative: Docker Compose (Self-Hosted)

`ash
cd backend
docker build -t rag-chatbot-backend .
docker run -p 8000:8000 -e OPENAI_API_KEY=<key> rag-chatbot-backend
`

---

## Environment Variables

### Frontend
- NEXT_PUBLIC_API_URL - Backend API base URL (e.g., https://api.example.com/api)

### Backend
- OPENAI_API_KEY - Your OpenAI API key (REQUIRED)
- PYTHONUNBUFFERED - Set to 1 for Railway logs
- PORT - Port (default 8000)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 502 Error | Check backend logs in Railway dashboard |
| CORS Error | Verify NEXT_PUBLIC_API_URL in Vercel |
| Missing OpenAI Key | Add OPENAI_API_KEY to Railway env vars |

---

## Production Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway (or alternative)
- [ ] NEXT_PUBLIC_API_URL configured correctly
- [ ] OPENAI_API_KEY set on backend
- [ ] CORS enabled (should be by default)
- [ ] Test /api/health endpoint
- [ ] Monitor deployment logs

---

## Alternative Backend Hosting

| Service | Free Tier | Python Support | Deploy from GitHub |
|---------|-----------|----------------|-------------------|
| Railway | /month | ? | ? |
| Render | ? (Cold start) | ? | ? |
| Fly.io | ? | ? | ? |
| AWS Lambda | ? (limited) | ? | ? |

---

For more details: See README.md and API_DOCUMENTATION.md
