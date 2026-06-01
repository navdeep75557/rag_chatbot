import { create } from "zustand"

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

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    video_id: string
    platform: string
    chunk_index: number
  }>
}

interface ChatStore {
  sessionId: string | null
  videoA: Video | null
  videoB: Video | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null

  setSession: (sessionId: string, videoA: Video, videoB: Video) => void
  addMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  sessionId: null,
  videoA: null,
  videoB: null,
  messages: [],
  isLoading: false,
  error: null,

  setSession: (sessionId, videoA, videoB) =>
    set({ sessionId, videoA, videoB, messages: [] }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearChat: () =>
    set({
      sessionId: null,
      videoA: null,
      videoB: null,
      messages: [],
      isLoading: false,
      error: null,
    }),
}))
