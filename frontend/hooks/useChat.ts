import { useCallback } from "react"
import { useChatStore } from "./useChatStore"
import { apiClient } from "@/services/api"
import { getDemoAnswer } from "@/lib/mockData"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useChat = () => {
  const { sessionId, isDemo, videoA, videoB, addMessage, updateLastMessage, setLoading, setError } =
    useChatStore()

  const sendMessage = useCallback(
    async (question: string) => {
      if (!sessionId) {
        setError("No active session")
        return
      }

      addMessage({
        role: "user",
        content: question,
      })

      addMessage({
        role: "assistant",
        content: "",
      })

      // Demo mode: no real backend is connected, so we simulate a realistic
      // typing response using sample logic instead of calling the API.
      if (isDemo && videoA && videoB) {
        try {
          setLoading(true)
          setError(null)

          const { content, sources } = getDemoAnswer(question, videoA as any, videoB as any)
          const words = content.split(" ")
          let built = ""
          for (let i = 0; i < words.length; i++) {
            built += (i === 0 ? "" : " ") + words[i]
            updateLastMessage(built)
            await sleep(16)
          }
          updateLastMessage(built, sources)
        } finally {
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setError(null)

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
                    updateLastMessage(fullResponse)
                  }
                  if (data.sources) {
                    sources = data.sources
                    updateLastMessage(fullResponse, sources)
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
          updateLastMessage(fullResponse, sources)
        }

        if (!fullResponse) {
          updateLastMessage("I couldn't generate a response. Please try rephrasing your question.")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to send message"
        setError(errorMessage)
        updateLastMessage("Error: " + errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [sessionId, isDemo, videoA, videoB, addMessage, updateLastMessage, setLoading, setError]
  )

  return { sendMessage }
}
