import re
from typing import Tuple


def validate_youtube_url(url: str) -> Tuple[bool, str, str]:
    """
    Validate YouTube URL and extract video ID
    Returns: (is_valid, video_id, error_message)
    """
    patterns = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
        r'(?:https?://)?(?:www\.)?youtu\.be/([a-zA-Z0-9_-]{11})',
        r'(?:https?://)?(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return True, match.group(1), ""

    return False, "", "Invalid YouTube URL. Use: youtube.com/watch?v=xxx or youtu.be/xxx"


def validate_instagram_url(url: str) -> Tuple[bool, str, str]:
    """
    Validate Instagram Reel URL and extract reel ID
    Returns: (is_valid, reel_id, error_message)
    """
    patterns = [
        r'(?:https?://)?(?:www\.)?instagram\.com/reel/([a-zA-Z0-9_-]+)',
        r'(?:https?://)?(?:www\.)?instagram\.com/p/([a-zA-Z0-9_-]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return True, match.group(1), ""

    return False, "", "Invalid Instagram URL. Use: instagram.com/reel/xxx"
