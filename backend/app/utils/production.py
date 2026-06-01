"""
Production-ready utilities for the RAF Chatbot backend.
Includes helpers for logging, caching, and monitoring.
"""

import logging
import json
import time
from functools import wraps
from typing import Any, Callable, TypeVar
import os

# Configure structured logging
def setup_logging():
    """Setup structured JSON logging for production"""
    class JSONFormatter(logging.Formatter):
        def format(self, record):
            log_data = {
                "timestamp": self.formatTime(record),
                "level": record.levelname,
                "message": record.getMessage(),
                "module": record.name,
            }
            
            if record.exc_info:
                log_data["exception"] = self.formatException(record.exc_info)
            
            return json.dumps(log_data)

    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    
    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(
        logging.DEBUG if os.getenv("DEBUG") == "True" else logging.INFO
    )
    
    return logger

logger = setup_logging()

# Timing decorator
F = TypeVar("F", bound=Callable[..., Any])

def timeit(func: F) -> F:
    """Decorator to measure function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start
            logger.info(f"{func.__name__} completed in {duration:.2f}s")
            return result
        except Exception as e:
            duration = time.time() - start
            logger.error(f"{func.__name__} failed after {duration:.2f}s: {str(e)}")
            raise
    
    return wrapper

# Cache decorator
def cache_result(ttl: int = 3600):
    """Simple in-memory cache decorator with TTL"""
    cache_dict = {}
    
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            if key in cache_dict:
                value, timestamp = cache_dict[key]
                if time.time() - timestamp < ttl:
                    logger.debug(f"Cache hit for {func.__name__}")
                    return value
            
            result = func(*args, **kwargs)
            cache_dict[key] = (result, time.time())
            return result
        
        return wrapper
    
    return decorator

# Error handling
class RAFChatbotException(Exception):
    """Base exception for RAF Chatbot"""
    pass

class VideoExtractionError(RAFChatbotException):
    """Error during video extraction"""
    pass

class TranscriptError(RAFChatbotException):
    """Error during transcript processing"""
    pass

class EmbeddingError(RAFChatbotException):
    """Error during embedding generation"""
    pass

class RAGError(RAFChatbotException):
    """Error in RAG pipeline"""
    pass
