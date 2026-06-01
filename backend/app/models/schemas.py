from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List
from datetime import datetime


class VideoAnalysisRequest(BaseModel):
    """Request to analyze two videos"""
    youtube_url: str = Field(..., description="YouTube video URL")
    instagram_url: str = Field(..., description="Instagram Reel URL")


class VideoMetadata(BaseModel):
    """Metadata for a video"""
    video_id: str
    platform: str  # "youtube" or "instagram"
    title: str
    creator: str
    views: int
    likes: int
    comments: int
    engagement_rate: float
    upload_date: Optional[str]
    duration: Optional[int]  # in seconds
    hashtags: List[str]
    thumbnail_url: Optional[str]
    follower_count: Optional[int]
    transcript_length: int
    chunks_count: int
    created_at: datetime


class VideoAnalysisResponse(BaseModel):
    """Response with analyzed videos"""
    session_id: str
    videoA: VideoMetadata
    videoB: VideoMetadata
    timestamp: datetime


class ChatMessage(BaseModel):
    """Chat message in conversation"""
    role: str  # "user" or "assistant"
    content: str
    sources: Optional[List[dict]] = None


class ChatRequest(BaseModel):
    """Chat request with question"""
    session_id: str
    question: str


class ChatResponse(BaseModel):
    """Streaming chat response"""
    session_id: str
    response: str
    sources: List[dict]
    timestamp: datetime


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    services: dict
