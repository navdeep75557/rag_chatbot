"use client"

import React from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useChatStore } from "@/hooks/useChatStore"
import VideoAnalyzer from "@/components/VideoAnalyzer"
import VideoCard from "@/components/VideoCard"
import ChatPanel from "@/components/ChatPanel"

const queryClient = new QueryClient()

function DashboardContent() {
  const { sessionId, videoA, videoB, clearChat } = useChatStore()

  if (!sessionId || !videoA || !videoB) {
    return <VideoAnalyzer onSessionCreated={() => {}} />
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Video Analysis</h1>
          <button
            onClick={clearChat}
            className="px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium transition-colors"
          >
            Analyze New Videos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Video A */}
          <div className="overflow-auto">
            <VideoCard video={videoA} />
          </div>

          {/* Video B */}
          <div className="overflow-auto">
            <VideoCard video={videoB} />
          </div>

          {/* Chat Panel */}
          <div className="overflow-hidden">
            <ChatPanel sessionId={sessionId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <DashboardContent />
      </main>
    </QueryClientProvider>
  )
}
