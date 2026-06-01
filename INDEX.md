# Project Overview & Index

## Welcome to RAF Chatbot 🤖

A **production-ready Full Stack RAG Chatbot** that compares YouTube and Instagram videos using AI-powered analysis with streaming responses and source citations.

---

## 📚 Documentation Index

### Getting Started
1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
2. **[SETUP.sh](setup.sh) / [SETUP.bat](setup.bat)** - Automated setup scripts

### Core Documentation
3. **[README.md](README.md)** - Complete project documentation with:
   - Architecture diagram
   - Tech stack details
   - Features overview
   - Database schema
   - Cost analysis
   - Scalability notes

4. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full API reference
   - All endpoints with examples
   - Request/response formats
   - Error handling
   - cURL examples

5. **[DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)** - Technical decisions
   - Why we chose each technology
   - Trade-offs made
   - Future improvement paths
   - Architecture decisions explained

6. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
   - Docker setup
   - Kubernetes deployment
   - AWS/Azure cloud deployment
   - Security checklist
   - Performance optimization

### Testing & Quality
7. **[TESTING.md](TESTING.md)** - Testing strategy
   - Unit tests
   - Integration tests
   - Performance testing
   - Security testing
   - CI/CD setup

### Reference
8. **[SAMPLE_DATA.md](SAMPLE_DATA.md)** - Test data and examples
   - Sample URLs
   - Test cases
   - Mock data
   - Troubleshooting

---

## 🏗️ Project Structure

```
RAF_Chatbot/
│
├── backend/                          # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes.py            # API endpoints
│   │   ├── services/                # Business logic
│   │   │   └── video_extraction.py  # Video/transcript handling
│   │   ├── rag/pipeline.py          # LangChain RAG pipeline
│   │   ├── vectorstore/             # ChromaDB integration
│   │   ├── db/models.py             # Database operations
│   │   ├── models/schemas.py        # Pydantic schemas
│   │   ├── utils/                   # Utilities
│   │   │   ├── url_validators.py
│   │   │   ├── text_processing.py
│   │   │   └── production.py
│   │   ├── config.py                # Settings
│   │   └── main.py                  # FastAPI app
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   ├── Dockerfile                    # Container definition
│   └── README.md
│
├── frontend/                         # Next.js 15 React frontend
│   ├── app/
│   │   ├── page.tsx                 # Main page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ui/                      # ShadCN UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── VideoAnalyzer.tsx        # URL input form
│   │   ├── VideoCard.tsx            # Video display
│   │   └── ChatPanel.tsx            # Chat interface
│   ├── hooks/
│   │   ├── useChatStore.ts          # Zustand store
│   │   └── useChat.ts               # Chat logic
│   ├── services/api.ts              # API client
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .env.example
│   └── Dockerfile
│
├── README.md                         # Main documentation
├── API_DOCUMENTATION.md              # API reference
├── DESIGN_DECISIONS.md               # Technical decisions
├── DEPLOYMENT.md                     # Deployment guide
├── QUICKSTART.md                     # Quick start guide
├── TESTING.md                        # Testing guide
├── SAMPLE_DATA.md                    # Test data
├── docker-compose.yml                # Docker compose setup
├── setup.sh                          # Linux/Mac setup
└── setup.bat                         # Windows setup

```

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OpenAI API key
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Option 3: Docker

```bash
docker-compose up
```

---

## 🎯 Key Features

✅ **Dual Video Analysis**
- YouTube: Automatic transcript via API
- Instagram: Whisper-powered transcription

✅ **Intelligent RAG**
- LangChain pipeline
- ChromaDB vector store
- OpenAI GPT-4o-mini

✅ **Streaming Responses**
- Token-by-token streaming
- Real-time feedback
- Source citations

✅ **Production Ready**
- TypeScript frontend & backend
- Error handling
- Database persistence
- Scalable architecture

---

## 📊 Architecture Overview

```
User Input (YouTube + Instagram URLs)
    ↓
Backend Analysis Pipeline
├── Extract Metadata
├── Retrieve Transcripts
├── Chunk & Embed
└── Store in Vector DB
    ↓
RAG Chat Interface
├── Retrieve Relevant Chunks
├── Generate Response (GPT-4o-mini)
└── Stream to Frontend
    ↓
Frontend Display
├── Video Cards (side-by-side)
├── Chat Panel
└── Source Citations
```

---

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS | UI/UX |
| **State** | Zustand, React Query | State management |
| **Backend** | FastAPI, Python 3.11 | API server |
| **RAG** | LangChain, GPT-4o-mini | AI pipeline |
| **Embeddings** | text-embedding-3-small | Vector embeddings |
| **Vector DB** | ChromaDB | Semantic search |
| **Database** | SQLite (PostgreSQL ready) | Data persistence |
| **Transcripts** | YouTube API, Whisper API | Extraction |
| **Deployment** | Docker, Docker Compose | Containerization |

---

## 💰 Cost Breakdown

Per analysis + 5 chat turns:
- YouTube extraction: Free
- Instagram Whisper: ~$0.02
- Embeddings: ~$0.01
- Chat (5 turns): ~$0.10
- **Total: ~$0.13 per analysis**

For 1000 analyses/day: **~$130/day = $3,900/month**

---

## 📈 Scalability Path

### MVP (Current)
- ✅ ChromaDB for vector store
- ✅ SQLite for database
- ✅ Single FastAPI server
- ✅ In-memory caching
- **Handles**: 10-100 analyses/day

### Growth Phase
- PostgreSQL + pgvector
- Redis caching
- Celery workers for background jobs
- **Handles**: 1,000-10,000 analyses/day

### Enterprise Phase
- Qdrant or Pinecone for vector DB
- Kubernetes orchestration
- Multiple FastAPI instances
- Advanced monitoring
- **Handles**: 100,000+ analyses/day

---

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Backend tests
cd backend && pytest tests/ -v

# Frontend tests
cd frontend && npm test
```

See [TESTING.md](TESTING.md) for detailed testing guide.

---

## 📝 API Examples

### Analyze Videos
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://youtube.com/watch?v=xxx",
    "instagram_url": "https://instagram.com/reel/yyy"
  }'
```

### Chat with Videos
```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "question": "Compare engagement rates"
  }'
```

---

## 🔐 Environment Variables

### Backend Required
```
OPENAI_API_KEY=sk-...
```

### Backend Optional
```
DATABASE_URL=sqlite:///./chatbot.db
CHROMA_HOST=localhost
CHROMA_PORT=8000
DEBUG=False
```

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🚢 Deployment

### Local Docker
```bash
docker-compose up
```

### Production
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- AWS ECS deployment
- Kubernetes setup
- SSL/TLS configuration
- Database migration
- Monitoring setup

---

## 🛠️ Development Workflow

1. **Start servers**
   ```bash
   # Terminal 1: Backend
   cd backend && uvicorn app.main:app --reload
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

2. **Make changes**
   - Auto-reload enabled for both
   - TypeScript checking on save
   - Hot module replacement on frontend

3. **Test locally**
   - Backend: http://localhost:8000/docs
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/health

4. **Deploy**
   - See DEPLOYMENT.md

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [ChromaDB Docs](https://docs.trychroma.com/)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Add tests
4. Submit pull request

---

## 📞 Support

For issues and questions:
1. Check [QUICKSTART.md](QUICKSTART.md)
2. Review [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)
3. Check [TESTING.md](TESTING.md)
4. Review error logs in terminal

---

## 📄 License

MIT License - See LICENSE file

---

## 🎉 You're Ready!

```bash
# Start here:
1. ./setup.sh (or setup.bat on Windows)
2. cd backend && uvicorn app.main:app --reload
3. cd frontend && npm run dev
4. Open http://localhost:3000
```

**Happy coding! 🚀**
