import sqlite3
from datetime import datetime
from typing import Optional, List
import json


class Database:
    """SQLite database wrapper"""

    def __init__(self, db_path: str = "chatbot.db"):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initialize database schema"""
        conn = self.get_connection()
        cursor = conn.cursor()

        # Videos table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS videos (
                video_id TEXT PRIMARY KEY,
                platform TEXT NOT NULL,
                title TEXT NOT NULL,
                creator TEXT NOT NULL,
                views INTEGER NOT NULL,
                likes INTEGER NOT NULL,
                comments INTEGER NOT NULL,
                engagement_rate REAL NOT NULL,
                upload_date TEXT,
                duration INTEGER,
                hashtags TEXT,
                thumbnail_url TEXT,
                follower_count INTEGER,
                transcript TEXT NOT NULL,
                transcript_length INTEGER NOT NULL,
                chunks_count INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                videoA_id TEXT NOT NULL,
                videoB_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (videoA_id) REFERENCES videos(video_id),
                FOREIGN KEY (videoB_id) REFERENCES videos(video_id)
            )
        ''')

        # Chat history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                sources TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(session_id)
            )
        ''')

        conn.commit()
        conn.close()

    def save_video(self, video_data: dict) -> bool:
        """Save video metadata and transcript"""
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('''
                INSERT INTO videos (
                    video_id, platform, title, creator, views, likes, comments,
                    engagement_rate, upload_date, duration, hashtags, thumbnail_url,
                    follower_count, transcript, transcript_length, chunks_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                video_data['video_id'],
                video_data['platform'],
                video_data['title'],
                video_data['creator'],
                video_data['views'],
                video_data['likes'],
                video_data['comments'],
                video_data['engagement_rate'],
                video_data.get('upload_date'),
                video_data.get('duration'),
                json.dumps(video_data.get('hashtags', [])),
                video_data.get('thumbnail_url'),
                video_data.get('follower_count'),
                video_data['transcript'],
                video_data['transcript_length'],
                video_data.get('chunks_count', 0)
            ))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False  # Video already exists
        finally:
            conn.close()

    def get_video(self, video_id: str) -> Optional[dict]:
        """Retrieve video by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM videos WHERE video_id = ?', (video_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return dict(row)
        return None

    def save_session(self, session_id: str, videoA_id: str, videoB_id: str) -> bool:
        """Save analysis session"""
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('''
                INSERT INTO sessions (session_id, videoA_id, videoB_id)
                VALUES (?, ?, ?)
            ''', (session_id, videoA_id, videoB_id))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()

    def get_session(self, session_id: str) -> Optional[dict]:
        """Retrieve session by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM sessions WHERE session_id = ?', (session_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return dict(row)
        return None

    def save_chat_message(
        self, session_id: str, role: str, content: str, sources: Optional[List[dict]] = None
    ) -> bool:
        """Save chat message"""
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('''
                INSERT INTO chat_history (session_id, role, content, sources)
                VALUES (?, ?, ?, ?)
            ''', (session_id, role, content, json.dumps(sources) if sources else None))
            conn.commit()
            return True
        finally:
            conn.close()

    def get_chat_history(self, session_id: str) -> List[dict]:
        """Retrieve chat history for a session"""
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT role, content, sources FROM chat_history
            WHERE session_id = ?
            ORDER BY created_at ASC
        ''', (session_id,))
        rows = cursor.fetchall()
        conn.close()

        messages = []
        for row in rows:
            messages.append({
                'role': row['role'],
                'content': row['content'],
                'sources': json.loads(row['sources']) if row['sources'] else None
            })
        return messages
