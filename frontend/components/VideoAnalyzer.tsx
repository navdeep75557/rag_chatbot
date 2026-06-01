"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import { apiClient } from "@/services/api"
import { useChatStore } from "@/hooks/useChatStore"

interface VideoAnalyzerProps {
  onSessionCreated?: (sessionId: string) => void
}

interface FormData {
  youtubeUrl: string
  instagramUrl: string
}

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ onSessionCreated }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const { setSession, setError } = useChatStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      setIsAnalyzing(true)
      setError(null)

      const result = await apiClient.analyzeVideos(data.youtubeUrl, data.instagramUrl)

      setSession(result.session_id, result.videoA, result.videoB)
      onSessionCreated?.(result.session_id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze videos"
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">RAF Chatbot</h1>
        <p className="mb-12 text-center text-lg text-slate-300">
          Compare YouTube and Instagram videos with AI-powered analysis
        </p>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Enter Video URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  YouTube URL
                </label>
                <Input
                  {...register("youtubeUrl", {
                    required: "YouTube URL is required",
                    pattern: {
                      value: /^https?:\/\/(www\.)?youtube\.(com|be)\//,
                      message: "Please enter a valid YouTube URL",
                    },
                  })}
                  placeholder="https://youtube.com/watch?v=xxx"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 caret-white"
                  disabled={isSubmitting || isAnalyzing}
                />
                {errors.youtubeUrl && (
                  <p className="mt-2 text-sm text-red-400">{errors.youtubeUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Instagram Reel URL
                </label>
                <Input
                  {...register("instagramUrl", {
                    required: "Instagram URL is required",
                    pattern: {
                      value: /^https?:\/\/(www\.)?instagram\.com\/reel\//,
                      message: "Please enter a valid Instagram Reel URL",
                    },
                  })}
                  placeholder="https://instagram.com/reel/xxx"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 caret-white"
                  disabled={isSubmitting || isAnalyzing}
                />
                {errors.instagramUrl && (
                  <p className="mt-2 text-sm text-red-400">{errors.instagramUrl.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing Videos..." : "Analyze Videos"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Paste a YouTube video URL (supports youtube.com/watch?v= and youtu.be/)</li>
            <li>• Paste an Instagram Reel URL</li>
            <li>• Click "Analyze Videos" to extract transcripts and metadata</li>
            <li>• Once analyzed, ask questions to compare the videos</li>
            <li>• The chatbot will provide insights with source citations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoAnalyzer
