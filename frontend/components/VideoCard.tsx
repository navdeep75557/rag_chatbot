"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import { Badge } from "./ui/Badge"

interface Video {
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

interface VideoCardProps {
  video: Video
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toString()
  }

  const isYouTube = video.platform.toLowerCase() === "youtube"

  return (
    <Card className="h-full bg-slate-800/70 backdrop-blur border-slate-700 shadow-xl overflow-hidden hover:shadow-2xl hover:border-slate-600 transition-all">
      <div className={`h-1 w-full ${isYouTube ? "bg-red-500" : "bg-gradient-to-r from-pink-500 to-purple-500"}`} />

      {video.thumbnail_url && (
        <div className="relative h-40 overflow-hidden bg-slate-700">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <Badge
            variant="secondary"
            className={`absolute top-2 left-2 ${isYouTube ? "bg-red-600 text-white" : "bg-purple-600 text-white"}`}
          >
            {video.platform.toUpperCase()}
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg text-white line-clamp-2">
          {video.title}
        </CardTitle>
        <p className="text-sm text-slate-400 mt-1">{video.creator}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400">👁️ Views</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.views)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400">❤️ Likes</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.likes)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400">💬 Comments</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.comments)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400">📈 Engagement</p>
            <p className="text-lg font-semibold text-emerald-400">{video.engagement_rate.toFixed(2)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
          {video.duration && (
            <div className="flex items-center">
              <span className="text-slate-400 mr-1.5">⏱️</span>
              <span>{Math.round(video.duration / 60)} min</span>
            </div>
          )}
          {video.upload_date && (
            <div className="flex items-center">
              <span className="text-slate-400 mr-1.5">📅</span>
              <span>{new Date(video.upload_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50 space-y-1">
          <p>📝 {video.transcript_length.toLocaleString()} characters transcribed</p>
          <p>🧩 {video.chunks_count} chunks processed</p>
        </div>

        {video.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.hashtags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                {tag}
              </Badge>
            ))}
            {video.hashtags.length > 5 && (
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                +{video.hashtags.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VideoCard
