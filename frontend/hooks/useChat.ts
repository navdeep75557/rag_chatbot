import { useCallback } from "react"
import { useChatStore } from "./useChatStore"
import { apiClient } from "@/services/api"

export const useChat = () => {
  const { sessionId, addMessage, setLoading, setError } = useChatStore()

  const sendMessage = useCallback(
    async (question: string) => {
      if (!sessionId) {
        setError("No active session")
        return
      }

      try {
        setLoading(true)
        setError(null)

        addMessage({
          role: "user",
          content: question,
        })

        let fullResponse = ""
        let sources: any[] = []

        const response = await apiClient.chat(sessionId, question)

        if (response.body instanceof ReadableStream) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.token) {
                    fullResponse += data.token
                  }
                  if (data.sources) {
                    sources = data.sources
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } else {
          const data = await response.json()
          fullResponse = data.response || ""
          sources = data.sources || []
        }

        addMessage({
          role: "assistant",
          content: fullResponse,
          sources,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to send message"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [sessionId, addMessage, setLoading, setError]
  )

  return { sendMessage }
}
