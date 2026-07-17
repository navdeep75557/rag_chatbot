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
  isDemo: boolean

  setSession: (sessionId: string, videoA: Video, videoB: Video, isDemo?: boolean) => void
  addMessage: (message: ChatMessage) => void
  updateLastMessage: (content: string, sources?: ChatMessage["sources"]) => void
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
  isDemo: false,

  setSession: (sessionId, videoA, videoB, isDemo = false) =>
    set({ sessionId, videoA, videoB, messages: [], error: null, isDemo }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateLastMessage: (content, sources) =>
    set((state) => {
      if (state.messages.length === 0) return state
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      messages[messages.length - 1] = {
        ...last,
        content,
        sources: sources ?? last.sources,
      }
      return { messages }
    }),

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
      isDemo: false,
    }),
}))
