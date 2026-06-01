# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
No authentication required for MVP. Add JWT/API keys for production.

## Endpoints

### 1. Analyze Videos
**POST** `/analyze`

Extract metadata, transcripts, and create embeddings for two videos.

#### Request Body
```json
{
  "youtube_url": "string (required)",
  "instagram_url": "string (required)"
}
```

#### Example Request
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "instagram_url": "https://instagram.com/reel/ABC123/"
  }'
```

#### Response (200 OK)
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "videoA": {
    "video_id": "dQw4w9WgXcQ",
    "platform": "youtube",
    "title": "Rick Astley - Never Gonna Give You Up",
    "creator": "Rick Astley",
    "views": 1309000000,
    "likes": 12000000,
    "comments": 2000000,
    "engagement_rate": 1.07,
    "upload_date": "2009-10-25T06:57:33Z",
    "duration": 213,
    "hashtags": ["#rickroll", "#classic"],
    "thumbnail_url": "https://...",
    "follower_count": null,
    "transcript_length": 15000,
    "chunks_count": 30,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "videoB": {
    "video_id": "ABC123",
    "platform": "instagram",
    "title": "Instagram Reel",
    "creator": "Content Creator",
    "views": 50000,
    "likes": 5000,
    "comments": 500,
    "engagement_rate": 11.0,
    "upload_date": "2024-01-10T15:20:00Z",
    "duration": 30,
    "hashtags": ["#trending", "#viral"],
    "thumbnail_url": "https://...",
    "follower_count": 100000,
    "transcript_length": 2000,
    "chunks_count": 4,
    "created_at": "2024-01-15T10:35:00Z"
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid URL format
```json
{
  "detail": "Invalid YouTube URL. Use: youtube.com/watch?v=xxx or youtu.be/xxx"
}
```

**500 Internal Server Error** - Processing error
```json
{
  "detail": "Error analyzing videos: [error message]"
}
```

---

### 2. Chat with Videos
**POST** `/chat`

Stream chat responses with RAG retrieval and source citations.

#### Request Body
```json
{
  "session_id": "string (required)",
  "question": "string (required)"
}
```

#### Example Request
```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "question": "Why did Video A get more engagement?"
  }'
```

#### Response (200 OK - Server-Sent Events)

The response streams tokens as they are generated:

```
data: {"token": "Video"}
data: {"token": " A"}
data: {"token": " received"}
data: {"token": " more"}
data: {"token": " engagement"}
...
data: {"sources": [{"video_id": "dQw4w9WgXcQ", "platform": "youtube", "chunk_index": 5}, {"video_id": "ABC123", "platform": "instagram", "chunk_index": 2}], "done": true}
```

#### Client Implementation (JavaScript)

```javascript
async function chat(sessionId, question) {
  const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, question })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.token) {
          fullResponse += data.token;
          console.log('Token:', data.token);
        }
        if (data.sources) {
          console.log('Sources:', data.sources);
        }
      }
    }
  }

  return fullResponse;
}
```

#### Error Responses

**404 Not Found** - Invalid session ID
```json
{
  "detail": "Session not found"
}
```

**500 Internal Server Error** - Processing error
```
data: {"error": "Error processing your question: [error message]"}
```

---

### 3. Health Check
**GET** `/health`

Check API and service health status.

#### Example Request
```bash
curl http://localhost:8000/api/health
```

#### Response (200 OK)
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

---

## Data Models

### VideoMetadata
```typescript
{
  video_id: string;
  platform: "youtube" | "instagram";
  title: string;
  creator: string;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;  // ((likes + comments) / views) * 100
  upload_date?: string;      // ISO 8601 format
  duration?: number;         // in seconds
  hashtags: string[];
  thumbnail_url?: string;
  follower_count?: number;
  transcript_length: number;
  chunks_count: number;
  created_at: string;        // ISO 8601 format
}
```

### ChatMessage
```typescript
{
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    video_id: string;
    platform: string;
    chunk_index: number;
  }>;
}
```

### Session
```typescript
{
  session_id: string;
  videoA_id: string;
  videoB_id: string;
  created_at: string;  // ISO 8601 format
}
```

---

## Rate Limiting

No rate limiting in MVP. For production:

- **Analyze endpoint**: 10 requests per hour per IP
- **Chat endpoint**: 100 requests per hour per session
- **Health endpoint**: Unlimited

---

## Error Handling

All errors return JSON with consistent structure:

```json
{
  "detail": "Error message"
}
```

HTTP Status Codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Example Workflow

### Step 1: Analyze Videos
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "instagram_url": "https://instagram.com/reel/ABC123/"
  }'
```

Response includes `session_id`.

### Step 2: Ask Questions
```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "[SESSION_ID_FROM_STEP_1]",
    "question": "Compare the engagement metrics"
  }'
```

Streams response with source citations.

### Step 3: Follow-up Questions
```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "[SESSION_ID]",
    "question": "Explain more about the hooks"
  }'
```

The chatbot remembers previous context.

---

## Testing with cURL

### Analyze with sample YouTube video
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "instagram_url": "https://instagram.com/reel/CY1234567890/"
  }' | jq .
```

### Chat with streaming (using -N flag)
```bash
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "[your-session-id]",
    "question": "What are the main differences between these videos?"
  }'
```

### Check health
```bash
curl http://localhost:8000/api/health | jq .
```

---

## OpenAPI/Swagger

Access interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Automatically generated from FastAPI.
