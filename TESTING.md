# Testing Guide

## Unit Tests

### Backend Unit Tests

Create `backend/tests/test_video_extraction.py`:

```python
import pytest
from app.utils.url_validators import validate_youtube_url, validate_instagram_url


def test_youtube_url_validation():
    # Valid YouTube URLs
    assert validate_youtube_url("https://youtube.com/watch?v=dQw4w9WgXcQ")[0]
    assert validate_youtube_url("https://youtu.be/dQw4w9WgXcQ")[0]
    assert validate_youtube_url("youtube.com/watch?v=dQw4w9WgXcQ")[0]
    
    # Invalid URLs
    assert not validate_youtube_url("https://example.com")[0]
    assert not validate_youtube_url("")[0]


def test_instagram_url_validation():
    # Valid Instagram URLs
    assert validate_instagram_url("https://instagram.com/reel/ABC123/")[0]
    assert validate_instagram_url("https://www.instagram.com/reel/ABC123")[0]
    
    # Invalid URLs
    assert not validate_instagram_url("https://instagram.com/profile")[0]
    assert not validate_instagram_url("")[0]
```

### Frontend Unit Tests

Create `frontend/__tests__/components.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'


describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-red-600')
  })
})
```

## Integration Tests

### API Integration Tests

Create `backend/tests/test_api_integration.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_invalid_urls():
    response = client.post("/api/analyze", json={
        "youtube_url": "invalid_url",
        "instagram_url": "invalid_url"
    })
    assert response.status_code == 400


def test_chat_missing_session():
    response = client.post("/api/chat", json={
        "session_id": "non-existent",
        "question": "test"
    })
    assert response.status_code == 404
```

## Manual Testing Checklist

### Backend Testing

- [ ] Health endpoint returns 200
- [ ] API docs available at /docs
- [ ] YouTube metadata extraction works
- [ ] Instagram metadata extraction works
- [ ] Transcript extraction works
- [ ] Error messages are user-friendly
- [ ] Database operations work
- [ ] ChromaDB integration works

### Frontend Testing

- [ ] Page loads without errors
- [ ] Video URL validation works
- [ ] Form submission sends correct data
- [ ] Loading states display properly
- [ ] Error messages display correctly
- [ ] Chat interface shows messages
- [ ] Streaming responses work
- [ ] Source citations display properly

### End-to-End Testing

1. **Complete Workflow**
   - [ ] Enter valid YouTube URL
   - [ ] Enter valid Instagram URL
   - [ ] Click Analyze Videos
   - [ ] Wait for completion
   - [ ] See video cards with stats
   - [ ] Ask a question
   - [ ] Receive streaming response
   - [ ] See source citations

2. **Error Scenarios**
   - [ ] Invalid YouTube URL → Error message
   - [ ] Invalid Instagram URL → Error message
   - [ ] Private video → Graceful error
   - [ ] Network timeout → Error handling
   - [ ] API rate limit → Error message

3. **UI Responsiveness**
   - [ ] Desktop view works
   - [ ] Tablet view works
   - [ ] Mobile view responsive
   - [ ] Chat scrolls properly
   - [ ] Buttons are clickable

## Performance Testing

### Load Testing

```python
import requests
import concurrent.futures
import time


def test_endpoint(session_id, question):
    """Test chat endpoint performance"""
    start = time.time()
    response = requests.post(
        "http://localhost:8000/api/chat",
        json={"session_id": session_id, "question": question}
    )
    duration = time.time() - start
    return duration, response.status_code


def run_load_test(num_requests=10):
    """Run concurrent requests"""
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [
            executor.submit(test_endpoint, "session-1", f"Question {i}")
            for i in range(num_requests)
        ]
        
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        avg_duration = sum(r[0] for r in results) / len(results)
        success_rate = sum(1 for r in results if r[1] == 200) / len(results) * 100
        
        print(f"Average response time: {avg_duration:.2f}s")
        print(f"Success rate: {success_rate:.1f}%")


if __name__ == "__main__":
    run_load_test(num_requests=50)
```

## API Testing with cURL

### Test Analysis Endpoint

```bash
# Test with valid URLs
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "instagram_url": "https://instagram.com/reel/ABC123/"
  }' | jq .

# Expect: 200 OK with session_id
```

### Test Chat Endpoint

```bash
# Test streaming response
curl -N -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "[SESSION_ID]",
    "question": "Compare engagement"
  }'

# Expect: Server-Sent Events stream
```

### Test Error Cases

```bash
# Invalid YouTube URL
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "not_a_url",
    "instagram_url": "https://instagram.com/reel/ABC/"
  }'

# Expect: 400 Bad Request
```

## Security Testing

### Input Validation Tests

```python
# Test SQL injection prevention
def test_sql_injection_prevention():
    # This should be handled by database layer
    pass

# Test XSS prevention
def test_xss_prevention():
    # Frontend should escape user inputs
    pass
```

### API Security Tests

```bash
# Test CORS
curl -X OPTIONS http://localhost:8000/api/analyze \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST"

# Test rate limiting (future)
for i in {1..100}; do
  curl http://localhost:8000/api/health
done
```

## Database Testing

### Test Data Persistence

```python
def test_video_save_and_retrieve():
    from app.db.models import Database
    
    db = Database()
    
    # Save video
    video_data = {
        'video_id': 'test_video_1',
        'platform': 'youtube',
        'title': 'Test Video',
        # ... other fields
    }
    
    db.save_video(video_data)
    
    # Retrieve
    retrieved = db.get_video('test_video_1')
    assert retrieved is not None
    assert retrieved['title'] == 'Test Video'
```

## Continuous Integration (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: cd backend && pip install -r requirements.txt
      - run: cd backend && pytest

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - run: cd frontend && npm test
```

## Test Coverage Goals

- **Backend**: 80% code coverage
- **Frontend**: 70% component coverage
- **Critical paths**: 100% coverage for API endpoints

## Running Tests

```bash
# Backend
cd backend
pytest tests/ -v --cov

# Frontend
cd frontend
npm test -- --coverage

# Both
npm run test:all
```

## Test Data Management

### Fixtures

```python
# backend/tests/conftest.py
import pytest
from app.db.models import Database

@pytest.fixture
def db():
    db = Database(":memory:")  # Use in-memory SQLite for tests
    yield db
    # Cleanup

@pytest.fixture
def sample_session(db):
    # Create test session with sample videos
    session_id = "test-session"
    videoA_id = "youtube-test"
    videoB_id = "instagram-test"
    
    db.save_session(session_id, videoA_id, videoB_id)
    
    return session_id
```

## Monitoring Test Results

- Use GitHub Actions for CI/CD
- Set up code coverage badges
- Monitor test performance over time
- Fail builds if coverage drops below threshold

---

## Quick Test Commands

```bash
# Run all tests
npm run test:all

# Run backend tests
cd backend && pytest tests/

# Run frontend tests
cd frontend && npm test

# Run specific test file
pytest tests/test_api.py::test_health_check -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```
