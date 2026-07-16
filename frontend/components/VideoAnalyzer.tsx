"use client"

import React, { useEffect, useState } from "react"
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

type BackendStatus = "checking" | "online" | "offline"

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ onSessionCreated }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const { setSession, setError, error } = useChatStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking")
  const [backendDetail, setBackendDetail] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    apiClient.getHealth().then((result) => {
      if (cancelled) return
      setBackendStatus(result.ok ? "online" : "offline")
      setBackendDetail(result.detail)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setIsAnalyzing(true)
      setError(null)

      const result = await apiClient.analyzeVideos(data.youtubeUrl, data.instagramUrl)

      setSession(result.session_id, result.videoA, result.videoB)
      onSessionCreated?.(result.session_id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze videos"
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40 mb-4 text-2xl">
            🎬
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">RAF Chatbot</h1>
          <p className="mt-3 text-lg text-slate-400">
            Compare YouTube and Instagram videos with AI-powered analysis
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "online"
                  ? "bg-emerald-400"
                  : backendStatus === "offline"
                  ? "bg-red-400"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span className="text-slate-300">
              {backendStatus === "checking" && "Checking backend connection…"}
              {backendStatus === "online" && "Backend connected"}
              {backendStatus === "offline" && "Backend unavailable"}
            </span>
          </div>
        </div>

        {backendStatus === "offline" && (
          <div className="mb-6 rounded-xl border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            <p className="font-semibold mb-1">⚠️ The backend API isn't reachable right now.</p>
            <p className="text-amber-200/80">
              {backendDetail ||
                "The analysis service may not be deployed yet, or the API URL isn't configured. You can still explore the interface, but analyzing videos won't work until the backend is connected."}
            </p>
          </div>
        )}

        <Card className="bg-slate-800/70 backdrop-blur border-slate-700 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="text-white text-xl">Enter Video URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2">
                  <span aria-hidden>▶️</span> YouTube URL
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
                  className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 caret-white"
                  disabled={isSubmitting || isAnalyzing}
                />
                {errors.youtubeUrl && (
                  <p className="mt-2 text-sm text-red-400">{errors.youtubeUrl.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2">
                  <span aria-hidden>📸</span> Instagram Reel URL
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
                  className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500 caret-white"
                  disabled={isSubmitting || isAnalyzing}
                />
                {errors.instagramUrl && (
                  <p className="mt-2 text-sm text-red-400">{errors.instagramUrl.message}</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-200">
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 text-base font-semibold shadow-lg shadow-blue-900/30"
                disabled={isSubmitting || isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Analyzing Videos…
                  </span>
                ) : (
                  "Analyze Videos"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
          <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
            <li>Paste a YouTube video URL (supports youtube.com/watch?v= and youtu.be/)</li>
            <li>Paste an Instagram Reel URL</li>
            <li>Click "Analyze Videos" to extract transcripts and metadata</li>
            <li>Once analyzed, ask questions to compare the videos</li>
            <li>The chatbot will provide insights with source citations</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default VideoAnalyzer
