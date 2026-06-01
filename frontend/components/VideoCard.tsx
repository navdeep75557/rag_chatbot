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

  return (
    <Card className="h-full bg-slate-800 border-slate-700">
      {/* Thumbnail */}
      {video.thumbnail_url && (
        <div className="relative h-40 overflow-hidden bg-slate-700">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <Badge variant="secondary" className="absolute top-2 left-2">
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
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-400">Views</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.views)}</p>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-400">Likes</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.likes)}</p>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-400">Comments</p>
            <p className="text-lg font-semibold text-white">{formatNumber(video.comments)}</p>
          </div>
          <div className="bg-slate-700 rounded p-3">
            <p className="text-xs text-slate-400">Engagement</p>
            <p className="text-lg font-semibold text-green-400">{video.engagement_rate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Video Info */}
        {video.duration && (
          <div className="flex items-center text-sm text-slate-300">
            <span className="text-slate-400 mr-2">⏱️</span>
            <span>{Math.round(video.duration / 60)} minutes</span>
          </div>
        )}

        {video.upload_date && (
          <div className="flex items-center text-sm text-slate-300">
            <span className="text-slate-400 mr-2">📅</span>
            <span>{new Date(video.upload_date).toLocaleDateString()}</span>
          </div>
        )}

        {/* Processing Info */}
        <div className="bg-slate-700 rounded p-3 text-xs text-slate-300">
          <p>📝 {video.transcript_length} characters transcribed</p>
          <p>🧩 {video.chunks_count} chunks processed</p>
        </div>

        {/* Hashtags */}
        {video.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.hashtags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.hashtags.length > 5 && (
              <Badge variant="outline" className="text-xs">
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
