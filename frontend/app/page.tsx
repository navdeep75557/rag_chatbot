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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-blue-900/40">
              🎬
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">Video Analysis</h1>
              <p className="text-sm text-slate-400">Comparing two videos side by side</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-600 text-sm font-medium transition-colors border border-slate-600"
          >
            Analyze New Videos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          <div className="overflow-auto">
            <VideoCard video={videoA} />
          </div>

          <div className="overflow-auto">
            <VideoCard video={videoB} />
          </div>

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
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <DashboardContent />
      </main>
    </QueryClientProvider>
  )
}
