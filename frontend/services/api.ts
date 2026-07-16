import axios, { AxiosInstance } from "axios"
export interface ChatMessage {
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
                timeout: 20000,
                headers: {
                          "Content-Type": "application/json",
                },
        })
  }

  private friendlyError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                          return new Error("The request timed out. The backend may be slow or unreachable.")
                }
                if (!error.response) {
                          return new Error(
                                      "Can't reach the backend API. It may not be deployed yet, or NEXT_PUBLIC_API_URL isn't configured."
                                    )
                }
                const detail = (error.response.data as any)?.detail || (error.response.data as any)?.message
                return new Error(detail || `Request failed with status ${error.response.status}`)
        }
        return error instanceof Error ? error : new Error("Unexpected error")
  }

  async analyzeVideos(youtubeUrl: string, instagramUrl: string) {
        try {
                const response = await this.client.post("/analyze", {
                          youtube_url: youtubeUrl,
                          instagram_url: instagramUrl,
                })
                return response.data
        } catch (error) {
                throw this.friendlyError(error)
        }
  }

  async chat(sessionId: string, question: string) {
        let response: Response
        try {
                response = await fetch(`${this.baseURL}/chat`, {
                          method: "POST",
                          headers: {
                                      "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                                      session_id: sessionId,
                                      question,
                          }),
                })
        } catch (e) {
                throw new Error("Can't reach the backend API. It may not be deployed yet, or NEXT_PUBLIC_API_URL isn't configured.")
        }

      if (!response.ok) {
              const errorText = await response.text()
              throw new Error(errorText || "Chat request failed")
      }

      return response
  }

  async getHealth(): Promise<{ ok: boolean; detail?: string }> {
        try {
                const response = await this.client.get("/health", { timeout: 6000 })
                return { ok: true, detail: response.data?.status }
        } catch (error) {
                return { ok: false, detail: this.friendlyError(error).message }
        }
  }
}

export const apiClient = new APIClient()
