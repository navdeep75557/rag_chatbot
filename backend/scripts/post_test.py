import requests

try:
    r = requests.post(
        'http://127.0.0.1:8000/api/analyze',
        json={
            'youtube_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'instagram_url': 'https://www.instagram.com/reel/ABC123/'
        },
        timeout=120
    )
    print('STATUS:', r.status_code)
    print(r.text)
except Exception as e:
    print('EXC:', repr(e))
