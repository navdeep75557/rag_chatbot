import json
import os
import subprocess
import tempfile
from typing import Dict, Optional, Tuple
import requests
from datetime import datetime

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    YouTubeTranscriptApi = None

try:
    import yt_dlp
except ImportError:
    yt_dlp = None


class VideoExtractor:
    """Extract metadata and transcripts from videos"""

    def __init__(self, openai_api_key: str):
        self.openai_api_key = openai_api_key

    def extract_youtube_metadata(self, video_id: str) -> Dict:
        """Extract metadata from YouTube video"""
        if not yt_dlp:
            raise ImportError("yt-dlp not installed")

        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                url = f"https://www.youtube.com/watch?v={video_id}"
                info = ydl.extract_info(url, download=False)

                return {
                    'video_id': video_id,
                    'platform': 'youtube',
                    'title': info.get('title', 'Unknown'),
                    'creator': info.get('uploader', 'Unknown'),
                    'views': info.get('view_count', 0),
                    'likes': info.get('like_count', 0) or 0,
                    'comments': info.get('comment_count', 0) or 0,
                    'upload_date': info.get('upload_date', ''),
                    'duration': info.get('duration', 0),
                    'thumbnail_url': info.get('thumbnail', ''),
                    'description': info.get('description', ''),
                }
        except Exception as e:
            raise Exception(f"Error extracting YouTube metadata: {str(e)}")

    def extract_youtube_transcript(self, video_id: str) -> str:
        """Extract transcript from YouTube video"""
        if not YouTubeTranscriptApi:
            raise ImportError("youtube-transcript-api not installed")

        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return ' '.join([item['text'] for item in transcript])
        except Exception as e:
            # Fallback to audio extraction and Whisper
            return self._extract_transcript_with_whisper(f"https://www.youtube.com/watch?v={video_id}")

    def extract_instagram_metadata(self, reel_id: str) -> Dict:
        """Extract metadata from Instagram Reel"""
        if not yt_dlp:
            raise ImportError("yt-dlp not installed")

        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                url = f"https://www.instagram.com/reel/{reel_id}"
                info = ydl.extract_info(url, download=False)

                return {
                    'video_id': reel_id,
                    'platform': 'instagram',
                    'title': info.get('title', 'Instagram Reel'),
                    'creator': info.get('uploader', 'Unknown'),
                    'views': info.get('view_count', 0),
                    'likes': info.get('like_count', 0) or 0,
                    'comments': info.get('comment_count', 0) or 0,
                    'upload_date': info.get('upload_date', ''),
                    'duration': info.get('duration', 0),
                    'thumbnail_url': info.get('thumbnail', ''),
                    'description': info.get('description', ''),
                }
        except Exception as e:
            raise Exception(f"Error extracting Instagram metadata: {str(e)}")

    def extract_instagram_transcript(self, reel_id: str) -> str:
        """Extract transcript from Instagram Reel using Whisper"""
        url = f"https://www.instagram.com/reel/{reel_id}"
        return self._extract_transcript_with_whisper(url)

    def _extract_transcript_with_whisper(self, url: str) -> str:
        """Download audio and extract transcript using Whisper"""
        if not yt_dlp:
            raise ImportError("yt-dlp not installed")

        with tempfile.TemporaryDirectory() as temp_dir:
            audio_path = os.path.join(temp_dir, "audio.mp3")
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'outtmpl': os.path.join(temp_dir, 'audio'),
                'quiet': True,
                'no_warnings': True,
            }

            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])

                # Call Whisper API
                return self._transcribe_with_openai(audio_path)
            except Exception as e:
                raise Exception(f"Error extracting transcript with Whisper: {str(e)}")

    def _transcribe_with_openai(self, audio_path: str) -> str:
        """Transcribe audio using OpenAI Whisper API"""
        try:
            with open(audio_path, 'rb') as audio_file:
                response = requests.post(
                    'https://api.openai.com/v1/audio/transcriptions',
                    headers={'Authorization': f'Bearer {self.openai_api_key}'},
                    files={'file': audio_file},
                    data={'model': 'whisper-1'}
                )
                response.raise_for_status()
                return response.json()['text']
        except Exception as e:
            raise Exception(f"Error transcribing with OpenAI Whisper: {str(e)}")

    def calculate_engagement_rate(self, likes: int, comments: int, views: int) -> float:
        """Calculate engagement rate"""
        if views == 0:
            return 0.0
        return ((likes + comments) / views) * 100

    def extract_hashtags(self, text: str) -> list[str]:
        """Extract hashtags from text"""
        import re
        hashtags = re.findall(r'#\w+', text)
        return list(set(hashtags))
