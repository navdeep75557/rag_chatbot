# Test Data and Sample URLs

## Popular YouTube Videos to Test

### Educational Content
- **How to Make the Perfect Cup of Coffee**
  - URL: `https://www.youtube.com/watch?v=st571DYYCS8`
  - Duration: 10 minutes
  - Good for: Tutorial comparison

- **The Art of Negotiation**
  - URL: `https://www.youtube.com/watch?v=tnmA3zOCpEw`
  - Duration: 20 minutes
  - Good for: Business analysis

### Entertainment
- **Viral TikTok Compilation**
  - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - Duration: Various
  - Good for: Entertainment metrics

## Instagram Reels to Test

### Fashion & Lifestyle
- Example format: `https://www.instagram.com/reel/C1234567890/`

### Food Content
- Example format: `https://www.instagram.com/reel/ABC123XYZ/`

## Test Cases

### Test Case 1: Educational Comparison
```
YouTube: https://www.youtube.com/watch?v=education_video
Instagram: https://www.instagram.com/reel/educational_reel/
Question: "What teaching methods does each use?"
```

### Test Case 2: Engagement Analysis
```
YouTube: https://www.youtube.com/watch?v=high_engagement_video
Instagram: https://www.instagram.com/reel/viral_reel/
Question: "Why did one get more engagement than the other?"
```

### Test Case 3: Storytelling
```
YouTube: https://www.youtube.com/watch?v=narrative_video
Instagram: https://www.instagram.com/reel/story_reel/
Question: "Compare the storytelling approach"
```

## Expected Results

### Metadata Extraction
- YouTube: Successfully extracts transcripts via youtube-transcript-api
- Instagram: Falls back to Whisper API for transcription
- Both: Extract engagement metrics, dates, creator info

### Engagement Rate Calculation
Formula: `((likes + comments) / views) * 100`

Example:
- Views: 10,000
- Likes: 500
- Comments: 100
- Engagement Rate: (600 / 10,000) * 100 = **6%**

### Transcript Processing
- Chunks: ~500 characters each with 100-character overlap
- Embeddings: 1536-dimensional vectors
- Storage: ChromaDB with metadata

## Mock Data

For testing without real videos:

```python
mock_analysis_response = {
    "session_id": "test-session-123",
    "videoA": {
        "video_id": "test_youtube_1",
        "platform": "youtube",
        "title": "Test YouTube Video",
        "creator": "Test Creator",
        "views": 100000,
        "likes": 5000,
        "comments": 500,
        "engagement_rate": 5.5,
        "upload_date": "2024-01-01T00:00:00Z",
        "duration": 600,
        "hashtags": ["#test", "#youtube"],
        "thumbnail_url": "https://example.com/thumb.jpg",
        "transcript_length": 5000,
        "chunks_count": 10
    },
    "videoB": {
        "video_id": "test_instagram_1",
        "platform": "instagram",
        "title": "Test Instagram Reel",
        "creator": "Test Influencer",
        "views": 50000,
        "likes": 5000,
        "comments": 500,
        "engagement_rate": 10.0,
        "upload_date": "2024-01-02T00:00:00Z",
        "duration": 30,
        "hashtags": ["#trending", "#instagram"],
        "thumbnail_url": "https://example.com/thumb2.jpg",
        "transcript_length": 2000,
        "chunks_count": 4
    }
}
```

## Performance Benchmarks

### Expected Processing Times

| Task | Time | Notes |
|------|------|-------|
| YouTube metadata extraction | ~2s | API call |
| YouTube transcript retrieval | ~1-3s | Already available |
| Instagram Whisper transcription | ~10-30s | Depends on video length |
| Chunking & embedding | ~5-10s | 1536-dim vectors |
| ChromaDB indexing | ~2-5s | Per 20 chunks |
| **Total analysis** | **~30-60s** | Both videos |

### Memory Usage

- Backend container: 512MB minimum (1GB recommended)
- ChromaDB: 256MB minimum (512MB recommended)
- PostgreSQL: 512MB minimum (1GB recommended)

### API Costs

Per analysis + 5 chat turns:
- YouTube metadata: Free
- Instagram Whisper: ~$0.02
- Embeddings: ~$0.01
- Chat (5 turns): ~$0.10
- **Total: ~$0.13**

## Troubleshooting Common Issues

### 1. YouTube Transcript Not Found
```
Problem: Video doesn't have captions
Solution: System falls back to Whisper transcription
```

### 2. Instagram Video Access
```
Problem: Private account or deleted reel
Solution: API returns 404 error
Resolution: User should select public video
```

### 3. API Rate Limiting
```
Problem: Too many requests to OpenAI
Solution: Implement exponential backoff + queue
```

### 4. ChromaDB Connection Error
```
Problem: Vector database not responding
Solution: Ensure ChromaDB container is running
Check: docker ps | grep chromadb
```
