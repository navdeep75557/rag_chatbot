"""
Configuration management for RAF Chatbot
Handles environment variables and settings
"""

import os
from typing import Optional


class Settings:
    """Application settings from environment variables"""

    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./chatbot.db")
    
    # ChromaDB
    CHROMA_HOST: str = os.getenv("CHROMA_HOST", "localhost")
    CHROMA_PORT: int = int(os.getenv("CHROMA_PORT", "8000"))
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    
    # Redis (optional)
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL")
    
    # Video processing
    MAX_VIDEO_DURATION: int = int(os.getenv("MAX_VIDEO_DURATION", "3600"))  # 1 hour
    
    # RAG settings
    RAG_CHUNK_SIZE: int = 500
    RAG_CHUNK_OVERLAP: int = 100
    RAG_MAX_RETRIEVED: int = 5
    RAG_MODEL: str = "gpt-4o-mini"
    RAG_TEMPERATURE: float = 0.7
    
    # Embedding settings
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSIONS: int = 1536
    
    @classmethod
    def validate(cls) -> bool:
        """Validate required settings"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        return True

# Initialize and validate settings
settings = Settings()
settings.validate()
