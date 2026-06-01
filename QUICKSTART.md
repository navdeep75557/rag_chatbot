# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites Check
```bash
# Python 3.10+
python --version

# Node.js 18+
node --version

# pip installed
pip --version
```

---

## Backend Setup (3 minutes)

### 1. Navigate to backend
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-xxxxx
```

### 5. Start FastAPI server
```bash
uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Visit: http://localhost:8000/docs for Swagger UI

---

## Frontend Setup (2 minutes)

### 1. Open new terminal, navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env.local
```

### 4. Start development server
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
```

Visit: http://localhost:3000 in your browser

---

## Test the Application

### 1. Open the App
Go to http://localhost:3000

You should see:
- Title: "RAF Chatbot"
- Two input fields for YouTube and Instagram URLs
- "Analyze Videos" button

### 2. Enter Test URLs

**YouTube Example:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Instagram Example:**
```
https://www.instagram.com/reel/ABC123/
```

*Note: Use actual public videos for full functionality*

### 3. Click "Analyze Videos"

The backend will:
1. Extract metadata (title, creator, views, likes, comments)
2. Fetch transcript (YouTube) or Whisper (Instagram)
3. Chunk and embed transcript
4. Create a session for chatting

This takes **30-60 seconds**

### 4. See Results

After analysis, you'll see:
- Left panel: Video A (YouTube) card with stats
- Center panel: Video B (Instagram) card with stats
- Right panel: Chat interface ready for questions

### 5. Ask Questions

Example questions:
- "Compare the engagement rates"
- "Which video has better pacing?"
- "What are the main differences?"
- "Which video would perform better on TikTok?"

The chatbot will:
- Retrieve relevant transcript chunks
- Use GPT-4o-mini to generate answer
- Stream response token-by-token
- Show source citations

---

## 🔍 Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "services": {
    "openai": "connected",
    "chromadb": "available",
    "database": "sqlite"
  }
}
```

### Check Swagger Documentation
Visit: http://localhost:8000/docs

You should see all API endpoints documented interactively.

### Check Frontend Build
```bash
cd frontend
npm run build
```

No errors = frontend is healthy

---

## 🛠️ Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Then install again
pip install -r requirements.txt
```

### "OPENAI_API_KEY not found"
```bash
# Verify .env file has the key
cat .env  # macOS/Linux
type .env  # Windows

# Should show:
# OPENAI_API_KEY=sk-xxxxx
```

### "Module not found" errors in frontend
```bash
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Then restart
npm run dev
```

### "Connection refused" on port 8000
```bash
# Port is already in use
# Kill the process or use different port:
uvicorn app.main:app --reload --port 8001
```

### Instagram video download fails
- Ensure internet connection is good
- Try a different Instagram reel URL
- Check if account is public
- Whisper API needs internet access

---

## 📚 Next Steps

1. **Explore API documentation**: http://localhost:8000/docs
2. **Read full README**: See `README.md` for architecture
3. **Test different videos**: Try various YouTube and Instagram content
4. **Configure OpenAI**: Verify token limits and costs
5. **Deploy to production**: See `DEPLOYMENT.md`

---

## 💡 Example Workflow

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend (separate terminal)
cd frontend
npm run dev

# Browser: http://localhost:3000
# Enter URLs → Analyze → Chat → Get insights
```

---

## 🎯 Common Use Cases

### Use Case 1: Compare Viral Content
```
YouTube: Tutorial that got 1M views
Instagram: Reel with 500K views
Question: "Why did YouTube version perform better?"
```

### Use Case 2: Analyze Storytelling
```
YouTube: 10-minute narrative video
Instagram: 30-second story reel
Question: "Compare the story structure"
```

### Use Case 3: Engagement Study
```
YouTube: Educational content
Instagram: Entertainment content
Question: "Which audience is more engaged?"
```

---

## 📱 Mobile Testing

Frontend works on mobile (responsive design):
1. Open http://localhost:3000 on phone
2. Use browser address bar to connect to your machine IP
3. Example: `http://192.168.1.100:3000`

---

## 🔑 Key Environment Variables

```bash
# Backend .env (required)
OPENAI_API_KEY=sk-...

# Frontend .env.local (optional, defaults to localhost)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📊 Monitor API Activity

### Real-time logs in backend
```bash
# Terminal shows all requests
INFO:     GET http://localhost:8000/api/health
INFO:     POST http://localhost:8000/api/analyze
INFO:     POST http://localhost:8000/api/chat
```

### Real-time logs in frontend
```bash
# Browser console (F12 → Console)
Shows API calls and responses
```

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] API health check returns "ok"
- [ ] Can analyze YouTube and Instagram videos
- [ ] Can ask questions and get responses
- [ ] Chat shows source citations
- [ ] Streaming works (tokens appear one-by-one)

---

## 🎓 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [LangChain Docs](https://python.langchain.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [ChromaDB Docs](https://docs.trychroma.com/)

---

## 💬 Getting Help

1. **Check logs**: Look at terminal output for error messages
2. **Verify URLs**: Ensure videos are public and working
3. **Check API**: Visit http://localhost:8000/docs
4. **Test locally**: Use curl commands from API docs
5. **Read documentation**: Check DESIGN_DECISIONS.md

---

**You're ready to go! Start at http://localhost:3000 🚀**
