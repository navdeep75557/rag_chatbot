"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import { apiClient } from "@/services/api"
import { useChatStore } from "@/hooks/useChatStore"
import { generateMockSession, demoUrls } from "@/lib/mockData"

interface VideoAnalyzerProps {
  onSessionCreated?: (sessionId: string) => void
}

interface FormData {
  youtubeUrl: string
  instagramUrl: string
}

type BackendStatus = "checking" | "online" | "offline"

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ onSessionCreated }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const { setSession, setError, error } = useChatStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking")

  useEffect(() => {
    let cancelled = false
    apiClient.getHealth().then((result) => {
      if (cancelled) return
      setBackendStatus(result.ok ? "online" : "offline")
    })
    return () => {
      cancelled = true
    }
  }, [])

  const loadDemo = (youtubeUrl: string, instagramUrl: string) => {
    const result = generateMockSession(youtubeUrl, instagramUrl)
    setSession(result.session_id, result.videoA, result.videoB, true)
    onSessionCreated?.(result.session_id)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsAnalyzing(true)
      setError(null)

      const result = await apiClient.analyzeVideos(data.youtubeUrl, data.instagramUrl)
      setSession(result.session_id, result.videoA, result.videoB, false)
      onSessionCreated?.(result.session_id)
    } catch (err) {
      // This is a prototype and no backend is connected yet, so fall back to
      // a sample demo session built from the URLs the user entered, rather
      // than leaving them with a dead end.
      loadDemo(data.youtubeUrl, data.instagramUrl)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTryDemo = () => {
    const { youtubeUrl, instagramUrl } = demoUrls()
    setValue("youtubeUrl", youtubeUrl)
    setValue("instagramUrl", instagramUrl)
    loadDemo(youtubeUrl, instagramUrl)
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
                  ? "bg-purple-400"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span className="text-slate-300">
              {backendStatus === "checking" && "Checking backend connection…"}
              {backendStatus === "online" && "Backend connected"}
              {backendStatus === "offline" && "Prototype · demo mode available"}
            </span>
          </div>
        </div>

        {backendStatus === "offline" && (
          <div className="mb-6 rounded-xl border border-indigo-800 bg-indigo-950/40 px-4 py-4 text-sm text-indigo-100">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <span aria-hidden>🧪</span> This is a prototype
            </p>
            <p className="text-indigo-200/80 mb-3">
              The AI backend isn't connected yet, so analyzing a video below will show sample
              results instead of live data. You can explore the full experience right now with
              demo data.
            </p>
            <Button
              type="button"
              onClick={handleTryDemo}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold h-9 px-4"
            >
              ▶ Try Demo Mode
            </Button>
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
