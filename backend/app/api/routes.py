from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import json
import uuid
from datetime import datetime
from app.models.schemas import (
    VideoAnalysisRequest,
    VideoAnalysisResponse,
    VideoMetadata,
    ChatRequest,
    ChatResponse,
)
from app.services.video_extraction import VideoExtractor
from app.utils.url_validators import validate_youtube_url, validate_instagram_url
from app.utils.text_processing import chunk_transcript, extract_hashtags
from app.db.models import Database
from app.vectorstore.chroma_handler import ChromaDBHandler
from app.rag.pipeline import RAGPipeline
import os

router = APIRouter()


# Dependencies

def get_db():
    return Database()


def get_openai_api_key() -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Missing OPENAI_API_KEY. "
                "Set the OPENAI_API_KEY environment variable or create backend/.env from .env.example."
            )
        )
    return api_key


def get_video_extractor():
    return VideoExtractor(openai_api_key=get_openai_api_key())


def get_chroma_handler():
    return ChromaDBHandler(openai_api_key=get_openai_api_key())


def get_rag_pipeline():
    return RAGPipeline(openai_api_key=get_openai_api_key())


@router.post("/analyze", response_model=VideoAnalysisResponse)
async def analyze_videos(
    request: VideoAnalysisRequest,
    db: Database = Depends(get_db),
    extractor: VideoExtractor = Depends(get_video_extractor),
    chroma: ChromaDBHandler = Depends(get_chroma_handler),
):
    """
    Analyze two videos and extract metadata, transcripts, and embeddings
    """
    # Validate URLs
    youtube_valid, youtube_id, youtube_error = validate_youtube_url(request.youtube_url)
    if not youtube_valid:
        raise HTTPException(status_code=400, detail=youtube_error)

    instagram_valid, instagram_id, instagram_error = validate_instagram_url(request.instagram_url)
    if not instagram_valid:
        raise HTTPException(status_code=400, detail=instagram_error)

    try:
        # Extract YouTube metadata and transcript
        youtube_metadata = extractor.extract_youtube_metadata(youtube_id)
        youtube_transcript = extractor.extract_youtube_transcript(youtube_id)

        # Extract Instagram metadata and transcript
        instagram_metadata = extractor.extract_instagram_metadata(instagram_id)
        instagram_transcript = extractor.extract_instagram_transcript(instagram_id)

        # Process YouTube video
        youtube_chunks = chunk_transcript(youtube_transcript)
        youtube_engagement = extractor.calculate_engagement_rate(
            youtube_metadata['likes'],
            youtube_metadata['comments'],
            youtube_metadata['views']
        )
        youtube_hashtags = extract_hashtags(youtube_metadata['description'])

        youtube_video_data = {
            'video_id': youtube_id,
            'platform': 'youtube',
            'title': youtube_metadata['title'],
            'creator': youtube_metadata['creator'],
            'views': youtube_metadata['views'],
            'likes': youtube_metadata['likes'],
            'comments': youtube_metadata['comments'],
            'engagement_rate': youtube_engagement,
            'upload_date': youtube_metadata.get('upload_date'),
            'duration': youtube_metadata.get('duration'),
            'hashtags': youtube_hashtags,
            'thumbnail_url': youtube_metadata.get('thumbnail_url'),
            'follower_count': None,
            'transcript': youtube_transcript,
            'transcript_length': len(youtube_transcript),
            'chunks_count': len(youtube_chunks)
        }

        # Process Instagram video
        instagram_chunks = chunk_transcript(instagram_transcript)
        instagram_engagement = extractor.calculate_engagement_rate(
            instagram_metadata['likes'],
            instagram_metadata['comments'],
            instagram_metadata['views']
        )
        instagram_hashtags = extract_hashtags(instagram_metadata['description'])

        instagram_video_data = {
            'video_id': instagram_id,
            'platform': 'instagram',
            'title': instagram_metadata['title'],
            'creator': instagram_metadata['creator'],
            'views': instagram_metadata['views'],
            'likes': instagram_metadata['likes'],
            'comments': instagram_metadata['comments'],
            'engagement_rate': instagram_engagement,
            'upload_date': instagram_metadata.get('upload_date'),
            'duration': instagram_metadata.get('duration'),
            'hashtags': instagram_hashtags,
            'thumbnail_url': instagram_metadata.get('thumbnail_url'),
            'follower_count': None,
            'transcript': instagram_transcript,
            'transcript_length': len(instagram_transcript),
            'chunks_count': len(instagram_chunks)
        }

        # Save videos to database
        db.save_video(youtube_video_data)
        db.save_video(instagram_video_data)

        # Add chunks to vector store
        youtube_metadatas = [
            {
                'video_id': youtube_id,
                'platform': 'youtube',
                'creator': youtube_metadata['creator'],
                'title': youtube_metadata['title'],
                'chunk_index': i
            }
            for i, chunk in enumerate(youtube_chunks)
        ]

        instagram_metadatas = [
            {
                'video_id': instagram_id,
                'platform': 'instagram',
                'creator': instagram_metadata['creator'],
                'title': instagram_metadata['title'],
                'chunk_index': i
            }
            for i, chunk in enumerate(instagram_chunks)
        ]

        # Add to ChromaDB
        chroma.add_documents(youtube_chunks, youtube_metadatas)
        chroma.add_documents(instagram_chunks, instagram_metadatas)

        # Create session
        session_id = str(uuid.uuid4())
        db.save_session(session_id, youtube_id, instagram_id)

        # Create response
        videoA = VideoMetadata(
            video_id=youtube_id,
            platform='youtube',
            title=youtube_metadata['title'],
            creator=youtube_metadata['creator'],
            views=youtube_metadata['views'],
            likes=youtube_metadata['likes'],
            comments=youtube_metadata['comments'],
            engagement_rate=youtube_engagement,
            upload_date=youtube_metadata.get('upload_date'),
            duration=youtube_metadata.get('duration'),
            hashtags=youtube_hashtags,
            thumbnail_url=youtube_metadata.get('thumbnail_url'),
            follower_count=None,
            transcript_length=len(youtube_transcript),
            chunks_count=len(youtube_chunks),
            created_at=datetime.now()
        )

        videoB = VideoMetadata(
            video_id=instagram_id,
            platform='instagram',
            title=instagram_metadata['title'],
            creator=instagram_metadata['creator'],
            views=instagram_metadata['views'],
            likes=instagram_metadata['likes'],
            comments=instagram_metadata['comments'],
            engagement_rate=instagram_engagement,
            upload_date=instagram_metadata.get('upload_date'),
            duration=instagram_metadata.get('duration'),
            hashtags=instagram_hashtags,
            thumbnail_url=instagram_metadata.get('thumbnail_url'),
            follower_count=None,
            transcript_length=len(instagram_transcript),
            chunks_count=len(instagram_chunks),
            created_at=datetime.now()
        )

        return VideoAnalysisResponse(
            session_id=session_id,
            videoA=videoA,
            videoB=videoB,
            timestamp=datetime.now()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing videos: {str(e)}")


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: Database = Depends(get_db),
    rag: RAGPipeline = Depends(get_rag_pipeline),
):
    """
    Stream chat responses with RAG
    """
    # Verify session exists
    session = db.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get chat history
    chat_history = db.get_chat_history(request.session_id)
    history_tuples = [(msg['content'], "") for msg in chat_history if msg['role'] == 'user']
    history_tuples = [(history_tuples[i][0], chat_history[i+1]['content'] if i+1 < len(chat_history) else "") for i in range(len(history_tuples))]

    async def generate():
        """Generator for streaming response"""
        full_response = ""

        try:
            async for token in rag.query_streaming(
                question=request.question,
                chat_history=history_tuples,
                session_id=request.session_id
            ):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"

            # Extract sources
            sources = rag.extract_sources(full_response)

            # Save to database
            db.save_chat_message(
                session_id=request.session_id,
                role="user",
                content=request.question
            )

            db.save_chat_message(
                session_id=request.session_id,
                role="assistant",
                content=full_response,
                sources=sources
            )

            yield f"data: {json.dumps({'sources': sources, 'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "openai": "connected",
            "chromadb": "available",
            "database": "sqlite"
        }
    }
