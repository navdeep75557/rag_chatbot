import axios, { AxiosInstance } from "axios"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    video_id: string
    platform: string
    chunk_index: number
  }>
}

class APIClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") {
    this.baseURL = baseURL
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async analyzeVideos(youtubeUrl: string, instagramUrl: string) {
    const response = await this.client.post("/analyze", {
      youtube_url: youtubeUrl,
      instagram_url: instagramUrl,
    })
    return response.data
  }

  async chat(sessionId: string, question: string) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        question,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Chat request failed")
    }

    return response
  }

  async getHealth() {
    const response = await this.client.get("/health")
    return response.data
  }
}

export const apiClient = new APIClient()
