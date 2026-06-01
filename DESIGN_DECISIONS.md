# Design Decisions & Architecture

## 1. Frontend Framework: Next.js 15 App Router

### Why Next.js?
- **Server-side rendering** for better SEO
- **API routes** integration capability
- **Built-in optimization** (images, fonts, bundles)
- **Vercel deployment** ready
- **File-based routing** simplicity
- **TypeScript first-class support**

### Alternative Considered
- React CRA: Too basic, no built-in optimizations
- Vue.js: Smaller ecosystem
- Svelte: Smaller community for our use case

---

## 2. Backend Framework: FastAPI

### Why FastAPI?
- **Async/await native** - perfect for streaming
- **Auto-generated docs** with Swagger/ReDoc
- **Type hints** with Pydantic validation
- **High performance** (near-C speed)
- **WebSocket support** for real-time updates
- **Middleware ecosystem**

### Alternative Considered
- Django: Overkill for this use case, slower async
- Flask: No built-in async, would need Flask-CORS
- Go/Rust: Slower development, team expertise

---

## 3. Vector Database: ChromaDB

### Why ChromaDB?
- **Python-native** - integrates perfectly with LangChain
- **Lightweight** - no external server needed for MVP
- **Embeddings support** - direct integration with OpenAI
- **Cosine similarity** search fast and efficient
- **Metadata filtering** for multi-video queries
- **Easy migration** to Qdrant/Pinecone later

### Scalability Path
```
ChromaDB (MVP) 
  ↓ (10,000+ creators/day)
Qdrant (self-hosted or cloud)
  OR
pgvector (PostgreSQL extension)
```

---

## 4. LLM: OpenAI GPT-4o-mini

### Why GPT-4o-mini?
- **Cost-effective** - 10x cheaper than GPT-4
- **Fast responses** - ideal for streaming
- **High quality** - still excellent reasoning
- **Vision capabilities** (future enhancement)
- **Reliable API** - industry standard

### Token Estimates
- Input: ~2,000 tokens per chat turn
- Output: ~1,500 tokens per response
- Cost: ~$0.00175 per turn at scale

### Alternative Path
Future support for:
- Local LLMs (Llama, Mistral) via Ollama
- Azure OpenAI for enterprise customers
- Anthropic Claude for compliance-heavy use cases

---

## 5. Transcript Extraction: Dual Approach

### YouTube Strategy
```
1. Try: youtube-transcript-api (auto captions)
2. Fallback: Whisper API (if no captions available)
```

**Why?**
- Fast (captions already available)
- No audio download needed
- Free/cheap

### Instagram Strategy
```
1. Use: yt-dlp to download audio
2. Process: OpenAI Whisper API for transcription
```

**Why?**
- Instagram has no caption API
- Whisper is highly accurate (>99%)
- Supports multiple languages

---

## 6. Chunking Strategy: Recursive Character Splitter

### Configuration
```python
chunk_size = 500        # characters per chunk
chunk_overlap = 100     # character overlap between chunks
```

### Rationale
- **500 chars** ≈ 100-150 words = semantic unit
- **100 char overlap** ensures context preservation
- **Recursive split** respects document structure
  - Splits by paragraph first
  - Then by sentence
  - Finally by character

### Example
```
Chunk 1: [characters 0-500 + 100 overlap]
Chunk 2: [characters 400-900 + 100 overlap]
Chunk 3: [characters 800-1300 + 100 overlap]
```

---

## 7. Embedding Model: text-embedding-3-small

### Specification
- **Dimensions**: 1536
- **Cost**: $0.02 per 1M tokens
- **Speed**: ~1000 tokens/second
- **Quality**: High (better than Ada)

### Why Not Larger?
- `text-embedding-3-large` costs 5x more
- 1536 dimensions sufficient for semantic search
- ~99% of quality improvement with 20% of cost

---

## 8. Conversation Memory Strategy

### Implementation
- **ConversationBufferMemory** from LangChain
- Stores full chat history in database
- Allows context-aware multi-turn conversations

### Future Optimization
- Implement **ConversationSummaryMemory**
- Compress long conversations periodically
- Keep only recent important context

---

## 9. Streaming Architecture

### Why Server-Sent Events (SSE)?
```
✅ Unidirectional (server → client)
✅ Simple HTTP (no WebSocket complexity)
✅ Auto-reconnect support
✅ Perfect for token-by-token responses
```

### Alternative Considered
- WebSockets: Overkill for one-way streaming
- Long-polling: Inefficient, high latency
- Server-Sent Events: ✓ Perfect fit

### Implementation Flow
```
1. Client sends question
2. Server starts streaming tokens
3. Chunks received as `data: {...}` events
4. Client renders tokens in real-time
5. After completion, sends sources
```

---

## 10. Database: SQLite → PostgreSQL Path

### MVP Phase
- **Database**: SQLite (file-based)
- **Pros**: Zero setup, perfect for prototyping
- **Cons**: Single writer, limited concurrency

### Scale Phase (>1000 users)
```sql
-- Migration to PostgreSQL with pgvector
CREATE EXTENSION vector;

CREATE TABLE video_embeddings (
    id SERIAL PRIMARY KEY,
    video_id TEXT,
    chunk_index INT,
    embedding vector(1536),
    content TEXT
);

CREATE INDEX ON video_embeddings USING ivfflat (embedding vector_cosine_ops);
```

---

## 11. Authentication Strategy

### MVP: No Auth
- Public API endpoints
- Session-based tracking

### Production: JWT + API Keys
```python
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/analyze")
async def analyze(request: VideoAnalysisRequest, credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials
    # Verify JWT
```

---

## 12. Error Handling Philosophy

### Client Errors (400)
```json
{
  "detail": "Invalid YouTube URL. Use: youtube.com/watch?v=xxx"
}
```

### Server Errors (500)
```json
{
  "detail": "Error analyzing videos: [error details]"
}
```

### Validation
- Input validation at API boundary (Pydantic)
- Processing errors caught and logged
- User-friendly error messages

---

## 13. Deployment Architecture Decision

### Development
```
Frontend: localhost:3000
Backend: localhost:8000
ChromaDB: localhost:8001
```

### Production
```
Docker Compose (single server)
  ↓ (scale needed)
Kubernetes + Managed Services
  - EKS (AWS) or AKS (Azure)
  - RDS PostgreSQL
  - Managed Redis
  - Managed Vector DB
```

---

## 14. Security Decisions

### API Security
- ✅ CORS configured for frontend origin
- ✅ HTTPS enforced in production
- ✅ Rate limiting (future: Redis)
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (parameterized)
- ✅ Secrets in environment variables

### Frontend Security
- ✅ XSS prevention (React escaping)
- ✅ CSRF protection (same-origin)
- ✅ Secure headers via Nginx
- ✅ No sensitive data in localStorage

---

## 15. Monitoring & Observability

### Logging Strategy
```python
import logging
import json

# Structured logging for production
logging.basicConfig(
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
    level=logging.INFO
)
```

### Metrics Collection
- Request latency
- Error rates
- ChromaDB query performance
- LLM token usage
- Database query times

### Future Tools
- Datadog / New Relic for APM
- Sentry for error tracking
- Prometheus for metrics

---

## Design Trade-offs

| Decision | Trade-off | Reasoning |
|----------|-----------|-----------|
| GPT-4o-mini | Slightly less capable than GPT-4 | 10x cost savings, still excellent |
| ChromaDB | Limited to Python | Tight LangChain integration |
| SQLite | Single writer | Simple for MVP, clear upgrade path |
| SSE over WebSocket | No bi-directional communication | Simpler, sufficient for use case |
| Next.js | Larger bundle | Built-in optimizations, better DX |
| Zustand | Less established than Redux | 3x faster, much smaller bundle |

---

## Future Architectural Improvements

### Phase 2: Scale & Performance
- Implement Celery for background jobs
- Add Redis caching layer
- Migrate to PostgreSQL + pgvector
- Implement advanced memory (summarization)

### Phase 3: Advanced Features
- Multi-video comparison (3+)
- Custom fine-tuned models
- Video segment analysis
- Real-time collaboration
- Mobile app (React Native)

### Phase 4: Enterprise Features
- Self-hosted deployment option
- Custom model integration
- SOC 2 compliance
- Advanced analytics
- White-label solution
