export interface MockVideo {
  video_id: string
  platform: string
  title: string
  creator: string
  views: number
  likes: number
  comments: number
  engagement_rate: number
  upload_date?: string
  duration?: number
  hashtags: string[]
  thumbnail_url?: string
  transcript_length: number
  chunks_count: number
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{6,})/)
  return match ? match[1] : null
}

function extractInstagramId(url: string): string | null {
  const match = url.match(/reel\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export function generateMockSession(youtubeUrl: string, instagramUrl: string) {
  const ytId = extractYouTubeId(youtubeUrl) || "demo-yt"
  const igId = extractInstagramId(instagramUrl) || "demo-ig"

  const videoA: MockVideo = {
    video_id: ytId,
    platform: "youtube",
    title: "How I Built a SaaS in 30 Days (Full Breakdown)",
    creator: "Alex Builds",
    views: 482300,
    likes: 38900,
    comments: 2140,
    engagement_rate: 8.53,
    upload_date: "2025-03-14",
    duration: 742,
    hashtags: ["#saas", "#buildinpublic", "#indiehacker", "#startup", "#coding"],
    transcript_length: 12450,
    chunks_count: 34,
  }

  const videoB: MockVideo = {
    video_id: igId,
    platform: "instagram",
    title: "3 Mistakes Killing Your Reels Growth",
    creator: "creator.growth",
    views: 1254000,
    likes: 145200,
    comments: 3820,
    engagement_rate: 11.94,
    upload_date: "2025-05-02",
    duration: 58,
    hashtags: ["#reels", "#contentcreator", "#growthtips", "#instagramtips", "#viral"],
    transcript_length: 1180,
    chunks_count: 6,
  }

  return {
    session_id: `demo-${Date.now()}`,
    videoA,
    videoB,
  }
}

export function demoUrls() {
  return {
    youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    instagramUrl: "https://instagram.com/reel/Cxyz123Demo/",
  }
}

interface DemoAnswer {
  content: string
  sources: Array<{ video_id: string; platform: string; chunk_index: number }>
}

export function getDemoAnswer(question: string, videoA: MockVideo, videoB: MockVideo): DemoAnswer {
  const q = question.toLowerCase()

  const source = (video: MockVideo, chunk: number) => ({
    video_id: video.video_id,
    platform: video.platform,
    chunk_index: chunk,
  })

  if (q.includes("engagement")) {
    return {
      content: `Video B (Instagram) has a noticeably higher engagement rate at ${videoB.engagement_rate}% versus ${videoA.engagement_rate}% for Video A. Short-form Reels tend to convert views into likes and comments faster because of their length and rewatch behavior, while long-form YouTube content earns engagement more gradually over its runtime.`,
      sources: [source(videoA, 12), source(videoB, 2)],
    }
  }

  if (q.includes("view")) {
    return {
      content: `Video B has more total views (${videoB.views.toLocaleString()}) compared to Video A (${videoA.views.toLocaleString()}). Reels are distributed heavily through Instagram's Explore and recommendation feed, which usually drives faster view accumulation than YouTube's search and suggested-video traffic.`,
      sources: [source(videoA, 3), source(videoB, 1)],
    }
  }

  if (q.includes("better") || q.includes("why") || q.includes("perform")) {
    return {
      content: `Both videos perform well for different reasons. Video A builds authority with a detailed, step-by-step narrative that keeps its niche audience watching for over 12 minutes. Video B wins on reach and virality, using a punchy hook in the first 3 seconds that's typical of high-performing Reels. If your goal is depth and trust, follow Video A's format; for reach and speed, Video B's approach works better.`,
      sources: [source(videoA, 8), source(videoB, 4)],
    }
  }

  if (q.includes("hashtag") || q.includes("tag")) {
    return {
      content: `Video A uses broader, niche-authority hashtags like ${videoA.hashtags.slice(0, 2).join(", ")}, aimed at an audience actively searching those topics. Video B leans on high-volume discovery tags like ${videoB.hashtags.slice(0, 2).join(", ")} designed to maximize Explore-page reach rather than topical accuracy.`,
      sources: [source(videoA, 15), source(videoB, 5)],
    }
  }

  if (q.includes("length") || q.includes("duration") || q.includes("long")) {
    return {
      content: `Video A runs about ${Math.round((videoA.duration || 0) / 60)} minutes, allowing room for a full narrative and detailed transcript (${videoA.transcript_length.toLocaleString()} characters). Video B is only ${videoB.duration} seconds, optimized for quick consumption and replay value rather than depth.`,
      sources: [source(videoA, 1), source(videoB, 1)],
    }
  }

  return {
    content: `This is a demo answer — no live backend is connected yet, so I'm using sample logic instead of real AI analysis. Try asking about "engagement", "views", "hashtags", or "why one performs better" to see example comparisons between the two videos. Once a real backend is connected, this same interface will answer any question using the actual video transcripts.`,
    sources: [],
  }
}
