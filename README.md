# RAF Chatbot - Full Stack RAG Chatbot for Video Comparison

A production-ready Full Stack Retrieval-Augmented Generation (RAG) chatbot that compares YouTube and Instagram Reels using AI-powered analysis with streaming responses and source citations.

## 🎯 Features

- **Dual Video Analysis**: Compare YouTube videos and Instagram Reels side-by-side
- **Intelligent RAG Pipeline**: LangChain-powered retrieval with GPT-4o-mini
- **Transcript Extraction**: Automatic transcript retrieval with Whisper fallback
- **Vector Embeddings**: ChromaDB with OpenAI text-embedding-3-small
- **Streaming Responses**: Token-by-token streaming for real-time feedback
- **Source Citations**: Every answer includes clickable source references
- **Engagement Analytics**: Dynamic calculation of engagement rates
- **Conversation Memory**: Multi-turn conversations with context awareness
- **Modern UI**: Next.js 15 with Tailwind CSS and ShadCN components

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     RAF Chatbot System                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                        │
         ┌───────▼────────┐      ┌────────▼────────┐
         │  Frontend       │      │   Backend       │
         │  (Next.js 15)   │      │  (FastAPI)      │
         └────────────────┘      └─────────────────┘
                 │                        │
                 │                        │
            React Query              FastAPI Routes
            Zustand Store            ├── POST /api/analyze
            TypeScript               ├── POST /api/chat
            Tailwind CSS             └── GET /api/health
                                          │
                         ┌────────────────┼────────────┬─────────────┐
                         │                │            │             │
                    ┌────▼───┐      ┌────▼────┐  ┌──────▼──┐  ┌─────▼──┐
                    │ Video  │      │ LangChain│  │ChromaDB │  │SQLite  │
                    │Extraction    │ RAG Pipe │  │Vector   │  │Database│
                    │Service  │      │ Pipeline │  │Store    │  │        │
                    └────────┘      └─────────┘  └─────────┘  └────────┘
                         │
                ┌────────┼────────┐
                │        │        │
          ┌─────▼──┐ ┌──▼───┐ ┌──▼────┐
          │YouTube │ │Whisper│ │yt-dlp │
          │Transcript│ API  │ │        │
          │API   │ └──────┘ └────────┘
          └──────┘
```

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Form Handling**: React Hook Form

### Backend
- **Framework**: FastAPI
- **Language**: Python
- **RAG Framework**: LangChain
- **LLM**: OpenAI GPT-4o-mini
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector Store**: ChromaDB
- **Database**: SQLite (PostgreSQL ready)

### Video Processing
- **YouTube**: youtube-transcript-api
- **Instagram**: yt-dlp + OpenAI Whisper
- **Chunking**: LangChain RecursiveCharacterTextSplitter

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key
- ChromaDB server (optional - can use in-memory)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📊 API Endpoints

### POST `/api/analyze`
Analyze two videos and extract metadata, transcripts, and embeddings.

**Request:**
```json
{
  "youtube_url": "https://youtube.com/watch?v=xxxx",
  "instagram_url": "https://instagram.com/reel/xxxx"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "videoA": {
    "video_id": "xxxx",
    "platform": "youtube",
    "title": "...",
    "creator": "...",
    "views": 10000,
    "likes": 500,
    "comments": 50,
    "engagement_rate": 5.5,
    "duration": 600,
    "hashtags": ["#viral", "#trending"],
    "thumbnail_url": "...",
    "transcript_length": 5000,
    "chunks_count": 10
  },
  "videoB": { ... },
  "timestamp": "2024-01-15T10:30:00"
}
```

### POST `/api/chat`
Stream chat responses with RAG and source citations.

**Request:**
```json
{
  "session_id": "uuid",
  "question": "Why did Video A get more engagement?"
}
```

**Response (Server-Sent Events):**
```
data: {"token": "Video"}
data: {"token": " A"}
...
data: {"sources": [...], "done": true}
```

### GET `/api/health`
Health check endpoint.

**Response:**
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

## 🔍 Metadata Extraction

### Extracted Fields
- **Title**: Video title
- **Creator Name**: Channel/Account name
- **Views**: Total view count
- **Likes**: Total likes
- **Comments**: Total comments
- **Engagement Rate**: Calculated as `((likes + comments) / views) * 100`
- **Upload Date**: Publication timestamp
- **Duration**: Video length in seconds
- **Hashtags**: Extracted from description
- **Thumbnail**: Video thumbnail URL
- **Follower Count**: Creator's followers (if available)

## 📝 Transcript Processing

1. **YouTube**: Uses youtube-transcript-api for automatic captions
2. **Instagram**: Falls back to yt-dlp + OpenAI Whisper for audio transcription
3. **Chunking**: RecursiveCharacterTextSplitter with:
   - `chunk_size`: 500 characters
   - `chunk_overlap`: 100 characters
4. **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
5. **Storage**: ChromaDB with metadata including:
   - `video_id`
   - `platform`
   - `creator`
   - `title`
   - `chunk_index`

## 🤖 RAG Pipeline

```
User Question
    ↓
Vector Similarity Search (ChromaDB)
    ↓
Retrieve Top 5 Chunks with Metadata
    ↓
Format Prompt Template
    ↓
GPT-4o-mini (with streaming)
    ↓
Extract Source Citations
    ↓
Stream Response to Frontend
```

### Supported Comparison Questions
- "Why did Video A get more engagement?"
- "Compare the first 5 seconds hooks"
- "What creator patterns contributed to success?"
- "Which video had stronger CTA?"
- "Compare storytelling structures"
- "Compare audience engagement"
- "Suggest improvements for Video B"
- "Summarize both videos"
- "What are common themes?"

## 💾 Database Schema

### Videos Table
```sql
CREATE TABLE videos (
    video_id TEXT PRIMARY KEY,
    platform TEXT,           -- "youtube" or "instagram"
    title TEXT,
    creator TEXT,
    views INTEGER,
    likes INTEGER,
    comments INTEGER,
    engagement_rate REAL,
    upload_date TEXT,
    duration INTEGER,        -- in seconds
    hashtags TEXT,          -- JSON array
    thumbnail_url TEXT,
    follower_count INTEGER,
    transcript TEXT,        -- full transcript
    transcript_length INTEGER,
    chunks_count INTEGER,
    created_at TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    videoA_id TEXT,
    videoB_id TEXT,
    created_at TIMESTAMP
);
```

### Chat History Table
```sql
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY,
    session_id TEXT,
    role TEXT,              -- "user" or "assistant"
    content TEXT,
    sources TEXT,          -- JSON array
    created_at TIMESTAMP
);
```

## 🔐 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=sk-...
DATABASE_URL=sqlite:///./chatbot.db
CHROMA_HOST=localhost
CHROMA_PORT=8000
HOST=0.0.0.0
PORT=8000
DEBUG=True
MAX_VIDEO_DURATION=3600
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 💰 Cost Analysis

### Per Conversation (Assuming 5 turns)
- **Video Extraction**: ~$0.05
  - YouTube: Free (transcript API)
  - Instagram: ~$0.02 (Whisper)
  - Metadata: ~$0.03 (yt-dlp)

- **Embeddings**: ~$0.01
  - text-embedding-3-small: $0.02 per 1M tokens
  - ~500 tokens per chunk × 20 chunks = 10,000 tokens

- **Chat**: ~$0.10
  - GPT-4o-mini: $0.15 per 1M input, $0.60 per 1M output
  - ~2,000 input + 1,500 output tokens per turn

**Total per conversation**: ~$0.16

**For 1000 creators/day**:
- 1000 × $0.16 = $160/day = ~$4,800/month

## 📈 Scalability Analysis

### Current Architecture (1-10 creators/day)
- ✅ ChromaDB sufficient
- ✅ SQLite adequate
- ✅ Single FastAPI instance
- ✅ In-memory caching

### Medium Scale (100-1000 creators/day)
- 🔄 Migrate to PostgreSQL (pgvector)
- 🔄 Add Redis caching layer
- 🔄 Background job queue (Celery)
- 🔄 Async transcription pipeline

### High Scale (10,000+ creators/day)
```
┌──────────────────────┐
│  Load Balancer       │
└──────────┬───────────┘
           │
    ┌──────┴──────┬──────────┐
    │      │      │
┌───▼─┐ ┌──▼──┐ ┌──▼──┐
│API-1│ │API-2│ │API-3│  (Horizontal scaling)
└───┬─┘ └──┬──┘ └──┬──┘
    │      │      │
    └──────┬──────┘
         ┌─▼─────┐
         │Qdrant │ or pgvector
         │Vector │
         └───────┘
         
         Redis Cache
         PostgreSQL
         Celery Workers
```

### Optimization Strategies
1. **Caching**: Redis for frequent queries
2. **Batch Processing**: Celery workers for transcription
3. **Vector DB**: Qdrant or pgvector for distributed embeddings
4. **Database**: PostgreSQL with pgvector extension
5. **CDN**: CloudFront for thumbnail caching
6. **Rate Limiting**: Prevent API abuse

## 🎨 UI Components

### VideoAnalyzer
- URL input form with validation
- Real-time feedback during analysis

### VideoCard
- Thumbnail preview
- Metadata display (views, likes, comments)
- Engagement rate visualization
- Hashtags
- Processing stats

### ChatPanel
- Message history
- Streaming response display
- Source citations with badges
- Auto-scroll
- Input field with Enter-to-send

## 📚 Project Structure

```
RAF_Chatbot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── services/
│   │   │   └── video_extraction.py # Video extraction logic
│   │   ├── rag/
│   │   │   └── pipeline.py         # RAG pipeline
│   │   ├── vectorstore/
│   │   │   └── chroma_handler.py   # ChromaDB handler
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic schemas
│   │   ├── db/
│   │   │   └── models.py           # Database operations
│   │   ├── utils/
│   │   │   ├── url_validators.py
│   │   │   └── text_processing.py
│   │   └── main.py                 # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # ShadCN components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── VideoAnalyzer.tsx
│   │   ├── ChatPanel.tsx
│   │   └── VideoCard.tsx
│   ├── hooks/
│   │   ├── useChatStore.ts
│   │   └── useChat.ts
│   ├── services/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
│
└── README.md
```

## 🧪 Testing

### Manual Testing

1. **Test YouTube analysis**:
   - Input: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Verify metadata extraction
   - Check transcript retrieval

2. **Test Instagram analysis**:
   - Input: `https://instagram.com/reel/ABC123/`
   - Verify Whisper transcription
   - Check engagement metrics

3. **Test RAG Pipeline**:
   - Ask comparison questions
   - Verify source citations
   - Check streaming responses

4. **Test Conversation Memory**:
   - Ask multi-turn questions
   - Verify context retention

## 🚢 Production Deployment

### Backend (FastAPI)
```bash
# Using Gunicorn + Uvicorn
pip install gunicorn

gunicorn -w 4 -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  app.main:app
```

### Frontend (Next.js)
```bash
npm run build
npm start
```

### Docker Deployment
Create `docker-compose.yml` for orchestration:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - chromadb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api

  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔮 Future Improvements

1. **Multi-Video Analysis**: Compare 3+ videos simultaneously
2. **Custom LLMs**: Support for local LLMs (Llama, Mistral)
3. **Advanced Analytics**: Sentiment analysis, topic modeling
4. **Social Media Integration**: Direct posting of AI insights
5. **User Accounts**: Save and share analyses
6. **Team Collaboration**: Shared sessions and annotations
7. **API Rate Limiting**: Tier-based usage limits
8. **Analytics Dashboard**: Usage metrics and insights
9. **Export Functionality**: PDF reports and summaries
10. **Mobile App**: React Native mobile version

## 📄 License

MIT License

## 👨‍💻 Contributing

Contributions are welcome! Please follow the code style and create feature branches.

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ for content creators and analysts**
