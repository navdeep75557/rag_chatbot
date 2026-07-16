import { useCallback } from "react"
import { useChatStore } from "./useChatStore"
import { apiClient } from "@/services/api"

export const useChat = () => {
    const { sessionId, addMessage, updateLastMessage, setLoading, setError } = useChatStore()

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
          [sessionId, addMessage, updateLastMessage, setLoading, setError]
        )

    return { sendMessage }
}
