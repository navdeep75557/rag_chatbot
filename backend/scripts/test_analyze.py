import requests, json
url='http://127.0.0.1:8000/api/analyze'
p={'youtube_url':'https://www.youtube.com/watch?v=dQw4w9WgXcQ','instagram_url':'https://www.instagram.com/reel/ABC123/'}
res=requests.post(url,json=p)
print(res.status_code)
try:
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(res.text)
